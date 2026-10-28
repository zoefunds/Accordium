import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { CalldataEncodable } from "genlayer-js/types";

export const runtime = "nodejs";
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const deployedContract = "0xF3B6F8CD79F1D2CB9B17519737e5B38197241803" as const;
const allowed = new Set(["list_pacts", "get_pact", "pact_evidence", "get_ledger", "get_limits"]);
type Encoded = string | number | boolean | null | Encoded[] | { __accordiumBigInt: string } | { [key: string]: Encoded };
function decode(value: Encoded): CalldataEncodable {
  if (Array.isArray(value)) return value.map(decode) as CalldataEncodable;
  if (value && typeof value === "object") {
    if (typeof (value as { __accordiumBigInt?: unknown }).__accordiumBigInt === "string") return BigInt((value as { __accordiumBigInt: string }).__accordiumBigInt);
    return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, decode(v)])) as CalldataEncodable;
  }
  return (value ?? "") as CalldataEncodable;
}
export async function POST(request: Request) {
  try {
    const address = (process.env.NEXT_PUBLIC_ACCORDIUM_CONTRACT || deployedContract) as `0x${string}`;
    if (!address || /^0x0{40}$/i.test(address)) return Response.json({ error: "Accordium contract is not configured." }, { status: 503 });
    const body = await request.json() as { functionName?: string; args?: Encoded[] };
    const functionName = String(body.functionName ?? "");
    if (!allowed.has(functionName)) return Response.json({ error: "Read method is not allowed." }, { status: 400 });
    const result = await createClient({ chain: studionet, endpoint }).readContract({ address, functionName, args: (body.args ?? []).map(decode) });
    return Response.json({ result });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Contract read failed." }, { status: 500 }); }
}
