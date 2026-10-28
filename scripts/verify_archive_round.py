#!/usr/bin/env python3
"""Fail-closed, read-only verifier for an Accordium two-archive round."""

from __future__ import annotations

import argparse
import base64
import gzip
import hashlib
import io
import json
import sys
from dataclasses import asdict, dataclass
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class Capture:
    source: str
    timestamp: str
    locator: str
    metadata_digest: str
    sha1_base32: str
    sha256: str


def _decode_body(body: bytes, url: str, limit: int) -> str:
    # Replays can preserve the origin's Content-Encoding even when the client
    # requests identity. Keep the decompressed body under the same hard limit.
    if body.startswith(b"\x1f\x8b"):
        try:
            with gzip.GzipFile(fileobj=io.BytesIO(body)) as stream:
                body = stream.read(limit + 1)
        except (EOFError, OSError) as error:
            raise ValueError(f"archive response has invalid gzip content: {url}") from error
        if len(body) > limit:
            raise ValueError(f"decompressed response exceeded {limit} bytes: {url}")
    try:
        return body.decode("utf-8")
    except UnicodeDecodeError as error:
        raise ValueError(f"archive response is not valid UTF-8: {url}") from error


def _request_text(url: str, limit: int = 200_000) -> str:
    _, text = _request_payload(url, limit)
    return text


def _request_payload(url: str, limit: int = 200_000) -> tuple[bytes, str]:
    request = Request(url, headers={"Accept-Encoding": "identity", "User-Agent": "AccordiumVerifier/1.0"})
    try:
        with urlopen(request, timeout=30) as response:
            body = response.read(limit + 1)
            if len(body) > limit:
                raise ValueError(f"response exceeded {limit} bytes: {url}")
            if response.status != 200:
                raise ValueError(f"HTTP {response.status}: {url}")
    except (HTTPError, URLError) as error:
        raise ValueError(f"archive request failed: {url}: {error}") from error
    return body, _decode_body(body, url, limit)


def _parse_wayback(text: str) -> dict[str, str]:
    payload = json.loads(text)
    if not isinstance(payload, list) or len(payload) != 2:
        raise ValueError("Wayback CDX did not return exactly one capture")
    header, row = payload
    return {str(header[index]): str(row[index]) for index in range(len(header))}


def _parse_arquivo(text: str) -> dict[str, str]:
    rows = [json.loads(line) for line in text.splitlines() if line.strip()]
    if len(rows) != 1 or not isinstance(rows[0], dict):
        raise ValueError("Arquivo.pt CDX did not return exactly one capture")
    return {str(key): str(value) for key, value in rows[0].items()}


def _content_hashes(wire_body: bytes, text: str) -> tuple[str, str]:
    sha1 = base64.b32encode(hashlib.sha1(wire_body).digest()).decode().rstrip("=")
    return sha1, hashlib.sha256(text.encode("utf-8")).hexdigest()


def _normalized_archive_digest(value: str) -> str:
    digest = value.strip().upper()
    return digest[5:] if digest.startswith("SHA1:") else digest


def _verify_capture(source: str, origin: str, timestamp: str, baseline_sha256: str) -> Capture:
    encoded_origin = quote(origin, safe="")
    if source == "WAYBACK":
        metadata_url = (
            "https://web.archive.org/cdx/search/cdx?url=" + encoded_origin
            + "&output=json&fl=timestamp,original,statuscode,digest&filter=statuscode:200&from="
            + timestamp + "&to=" + timestamp + "&limit=1&gzip=false"
        )
        item = _parse_wayback(_request_text(metadata_url, 16_384))
        original, status = item.get("original", ""), item.get("statuscode", "")
        locator = f"https://web.archive.org/web/{timestamp}id_/{origin}"
    elif source == "ARQUIVO_PT":
        metadata_url = (
            "https://arquivo.pt/wayback/cdx?url=" + encoded_origin
            + "&output=json&fl=url,timestamp,status,digest&filter=status:200&from="
            + timestamp + "&to=" + timestamp + "&limit=1"
        )
        item = _parse_arquivo(_request_text(metadata_url, 16_384))
        original, status = item.get("url", ""), item.get("status", "")
        locator = f"https://arquivo.pt/wayback/{timestamp}id_/{origin}"
    else:
        raise ValueError(f"unsupported archive source: {source}")

    if item.get("timestamp") != timestamp or original != origin or status != "200":
        raise ValueError(f"{source} metadata does not bind the exact origin, timestamp, and HTTP 200 status")

    wire_body, body = _request_payload(locator)
    sha1_base32, sha256 = _content_hashes(wire_body, body)
    archive_digest = _normalized_archive_digest(item.get("digest", ""))
    if archive_digest != sha1_base32:
        raise ValueError(f"{source} replay body does not match its indexed SHA-1 digest")
    if sha256 != baseline_sha256.lower():
        raise ValueError(f"{source} replay body does not match the pact baseline SHA-256")
    return Capture(source, timestamp, locator, archive_digest, sha1_base32, sha256)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", required=True)
    parser.add_argument("--baseline-sha256", required=True)
    parser.add_argument("--wayback-stamp", required=True)
    parser.add_argument("--arquivo-stamp", required=True)
    args = parser.parse_args()
    try:
        captures = [
            _verify_capture("WAYBACK", args.origin, args.wayback_stamp, args.baseline_sha256),
            _verify_capture("ARQUIVO_PT", args.origin, args.arquivo_stamp, args.baseline_sha256),
        ]
    except (ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"ok": False, "error": str(error)}, indent=2), file=sys.stderr)
        return 1
    print(json.dumps({"ok": True, "captures": [asdict(capture) for capture in captures]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
