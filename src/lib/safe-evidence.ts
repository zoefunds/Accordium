import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

const MAX_BYTES = 180_000;
const ARCHIVES: Record<string, { host: string; prefix: string }> = {
  WAYBACK: { host: "web.archive.org", prefix: "https://web.archive.org/web/" },
  ARQUIVO_PT: { host: "arquivo.pt", prefix: "https://arquivo.pt/wayback/" },
};

function privateAddress(address: string): boolean {
  if (isIP(address) === 4) { const [a,b] = address.split(".").map(Number); return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224; }
  const value = address.toLowerCase();
  return value === "::1" || value === "::" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") || value.startsWith("::ffff:127.") || value.startsWith("::ffff:10.") || value.startsWith("::ffff:192.168.");
}

export function validateArchiveLocator(source: string, locator: string, target: string): string {
  const adapter = ARCHIVES[source];
  if (!adapter || !locator.startsWith(adapter.prefix)) throw new Error("Locator does not match an approved archive.");
  const url = new URL(locator);
  if (url.protocol !== "https:" || url.hostname !== adapter.host || url.username || url.password || url.port) throw new Error("Archive destination is not authorized.");
  const tail = locator.slice(adapter.prefix.length), stamp = tail.slice(0,14);
  if (!/^\d{14}$/.test(stamp)) throw new Error("Archive locator must contain a 14-digit timestamp.");
  let rest = tail.slice(14); if (rest.startsWith("id_/")) rest = rest.slice(4); else if (rest.startsWith("/")) rest = rest.slice(1);
  if (rest !== target) throw new Error("Archive locator is not for this pact URL.");
  return stamp;
}

async function assertPublicArchive(url: URL, source: string): Promise<void> {
  const adapter = ARCHIVES[source];
  if (!adapter || url.protocol !== "https:" || url.hostname !== adapter.host || url.username || url.password || url.port) throw new Error("Archive redirect left the authorized destination.");
  const records = await lookup(url.hostname, { all: true, verbatim: true });
  if (!records.length || records.some(record => privateAddress(record.address))) throw new Error("Archive destination resolved to a non-public address.");
}

export async function fetchBoundedArchive(locator: string, source: string): Promise<string> {
  let current = new URL(locator);
  for (let redirects = 0; redirects <= 3; redirects++) {
    await assertPublicArchive(current, source);
    const response = await fetch(current, { headers: { "accept-encoding": "identity", accept: "text/html,text/plain" }, cache: "no-store", redirect: "manual" });
    if (response.status >= 300 && response.status < 400) { const location = response.headers.get("location"); if (!location || redirects === 3) throw new Error("Archive redirect limit exceeded."); current = new URL(location, current); continue; }
    if (!response.ok || !response.body) throw new Error(`Evidence source returned HTTP ${response.status}.`);
    const declared = Number(response.headers.get("content-length") || "0"); if (declared > MAX_BYTES) throw new Error("Evidence exceeds the 180 KB admission limit.");
    const reader = response.body.getReader(), chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_BYTES) { await reader.cancel(); throw new Error("Evidence exceeds the 180 KB admission limit."); } chunks.push(value); }
    const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }
  throw new Error("Archive retrieval failed.");
}
