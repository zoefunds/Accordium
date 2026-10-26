"use client";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { CalldataEncodable, TransactionHash } from "genlayer-js/types";

const DEPLOYED_CONTRACT = "0x88B88571D53F9dCE4941339027dF0423D6703F52" as const;
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_ACCORDIUM_CONTRACT || DEPLOYED_CONTRACT) as `0x${string}`;
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const explorer = "https://explorer-studio.genlayer.com";

export type ChainPact = {
  id: string; publisher: string; beneficiary: string; domain: string; origin_url: string;
  statement: string; statement_digest: string; stake: string; state: string;
  created_at: string; expires_at: string; last_round: string; breach_run: string;
  indeterminate_rounds: string; review_deadline: string; challenge_deadline: string;
  resolved_at: string; paid: string; returned: string;
};
export type Ledger = { total_in: string; total_out: string; currently_locked: string; pacts: string };
export type Dashboard = { pacts: ChainPact[]; ledger: Ledger; configured: boolean };

type Encoded = string | number | boolean | null | Encoded[] | { __accordiumBigInt: string } | { [key: string]: Encoded };
const configuredAddress = () => {
  if (!CONTRACT_ADDRESS || /^0x0{40}$/i.test(CONTRACT_ADDRESS)) throw new Error("Accordium contract is not configured.");
  return CONTRACT_ADDRESS;
};
const client = (account?: `0x${string}`) => createClient({ chain: studionet, endpoint, account, provider: typeof window === "undefined" ? undefined : window.ethereum });
const encode = (value: CalldataEncodable): Encoded => typeof value === "bigint" ? { __accordiumBigInt: value.toString() } : Array.isArray(value) ? value.map(v => encode(v as CalldataEncodable)) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k, encode(v as CalldataEncodable)])) : value as Encoded;

export const txUrl = (hash: string) => `${explorer}/tx/${hash}`;
export async function readContract<T>(functionName: string, args: CalldataEncodable[] = []): Promise<T> {
  const response = await fetch("/api/accordium/read", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ functionName, args: args.map(encode) }) });
  const payload = await response.json() as { result?: T; error?: string };
  if (!response.ok || payload.error) throw new Error(payload.error ?? "Contract read failed.");
  return payload.result as T;
}
export async function loadDashboard(): Promise<Dashboard> {
  if (!CONTRACT_ADDRESS || /^0x0{40}$/i.test(CONTRACT_ADDRESS)) return { pacts: [], ledger: { total_in: "0", total_out: "0", currently_locked: "0", pacts: "0" }, configured: false };
  const [pacts, ledger] = await Promise.all([readContract<ChainPact[]>("list_pacts"), readContract<Ledger>("get_ledger")]);
  return { pacts, ledger, configured: true };
}
export async function writeContract(account: `0x${string}`, functionName: string, args: CalldataEncodable[], value = 0n) {
  const writer = client(account); await writer.connect("studionet");
  return writer.writeContract({ address: configuredAddress(), functionName, args, value, consensusMaxRotations: 3 }) as Promise<TransactionHash>;
}
export async function waitFinalized(account: `0x${string}`, hash: TransactionHash) {
  const writer = client(account); await writer.connect("studionet");
  await writer.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 5000, retries: 180 });
  const transaction = await writer.getTransaction({ hash });
  const execution = transaction?.consensus_data?.leader_receipt?.[0]?.execution_result;
  if (execution && execution !== "SUCCESS") throw new Error(`Finalized transaction rolled back (${execution}).`);
  return transaction;
}

declare global { interface Window { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, fn: (...args: unknown[]) => void) => void; removeListener?: (event: string, fn: (...args: unknown[]) => void) => void } } }
