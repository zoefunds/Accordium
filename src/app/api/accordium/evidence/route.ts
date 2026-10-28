import { createHash } from "node:crypto";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { fetchBoundedArchive, validateArchiveLocator } from "@/lib/safe-evidence";

export const runtime = "nodejs";
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const fallback = "0xF3B6F8CD79F1D2CB9B17519737e5B38197241803" as const;

export async function POST(request: Request) {
  try {
    const { pact_id, source, locator, target_url } = await request.json() as Record<string,string>;
    if (!pact_id) throw new Error("A pact ID is required.");
    const address = (process.env.NEXT_PUBLIC_ACCORDIUM_CONTRACT || fallback) as `0x${string}`;
    const pact = await createClient({ chain: studionet, endpoint }).readContract({ address, functionName: "get_pact", args: [pact_id] }) as { origin_url?: string; state?: string };
    if (pact.origin_url !== target_url) throw new Error("The requested URL is not the pact's on-chain origin.");
    if (!["LIVE", "CHALLENGED"].includes(String(pact.state))) throw new Error("This pact does not accept evidence.");
    const captured_at = validateArchiveLocator(source, locator, pact.origin_url);
    const body = await fetchBoundedArchive(locator, source);
    const digest = createHash("sha256").update(body,"utf8").digest("hex");
    return Response.json({ claim: { source, target_url: pact.origin_url, locator, captured_at, digest }, preview: body.slice(0,500), bytes: Buffer.byteLength(body) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidence preparation failed." }, { status: 400 });
  }
}
