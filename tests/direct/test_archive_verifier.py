import base64
import gzip
import hashlib
import json

from scripts.verify_archive_round import (
    _content_hashes,
    _decode_body,
    _normalized_archive_digest,
    _parse_arquivo,
    _parse_wayback,
)


def test_wayback_cdx_parser_maps_declared_columns():
    item = _parse_wayback(json.dumps([
        ["timestamp", "original", "statuscode", "digest"],
        ["20261028013212", "https://example.com/commitment", "200", "ABC"],
    ]))
    assert item == {
        "timestamp": "20261028013212",
        "original": "https://example.com/commitment",
        "statuscode": "200",
        "digest": "ABC",
    }


def test_arquivo_cdx_parser_accepts_one_ndjson_record_only():
    record = {"url": "https://example.com/commitment", "timestamp": "20261028053813", "status": "200", "digest": "ABC"}
    assert _parse_arquivo(json.dumps(record) + "\n") == record


def test_content_hashes_match_contract_encodings():
    body = "Accordium commitment ✓"
    wire_body = gzip.compress(body.encode())
    sha1, sha256 = _content_hashes(wire_body, body)
    assert sha1 == base64.b32encode(hashlib.sha1(wire_body).digest()).decode().rstrip("=")
    assert sha256 == hashlib.sha256(body.encode()).hexdigest()
    assert _normalized_archive_digest("sha1:" + sha1.lower()) == sha1


def test_archive_body_decoder_handles_gzip_with_a_bound():
    compressed = gzip.compress("Accordium commitment ✓".encode())
    assert _decode_body(compressed, "https://archive.example/replay", 100) == "Accordium commitment ✓"
