"use client";
import { useState } from "react";
import type { CalldataEncodable, TransactionHash } from "genlayer-js/types";
import { CONTRACT_ADDRESS, waitFinalized, writeContract } from "@/lib/chain";
export type TxState = "AWAITING_SIGNATURE" | "CONSENSUS_RUNNING" | "DONE" | "FAILED";
export type TxRecord = { hash: string; label: string; state: TxState };
export function useTransaction(onFinalized?: () => Promise<void> | void) {
  const [transactions, setTransactions] = useState<TxRecord[]>([]); const [error, setError] = useState<string>();
  const update = (hash: string, state: TxState) => setTransactions(items => items.map(item => item.hash === hash ? { ...item, state } : item));
  async function send(label: string, functionName: string, args: CalldataEncodable[], account: `0x${string}`, value = 0n) {
    const pending = `pending-${Date.now()}`; setError(undefined); setTransactions(items => [{ hash: pending, label, state: "AWAITING_SIGNATURE" }, ...items]);
    if (!CONTRACT_ADDRESS || /^0x0{40}$/i.test(CONTRACT_ADDRESS)) { update(pending, "FAILED"); setError("Deploy the contract and configure NEXT_PUBLIC_ACCORDIUM_CONTRACT first."); return false; }
    let activeHash = pending;
    try { const hash = await writeContract(account, functionName, args, value) as TransactionHash; activeHash = hash; setTransactions(items => items.map(item => item.hash === pending ? { hash, label, state: "CONSENSUS_RUNNING" } : item)); await waitFinalized(account, hash); update(hash, "DONE"); await onFinalized?.(); return true; }
    catch (cause) { update(activeHash, "FAILED"); setError(cause instanceof Error ? cause.message : "Transaction failed."); return false; }
  }
  return { transactions, error, send };
}
