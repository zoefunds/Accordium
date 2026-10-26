"use client";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { txUrl } from "@/lib/chain";
import type { TxRecord } from "@/lib/use-transaction";
export function TxLifecycle({ items }: { items: TxRecord[] }) { if (!items.length) return null; return <div className="tx-list">{items.map(item => { const done = item.state === "DONE", failed = item.state === "FAILED"; const Icon = done ? CheckCircle2 : failed ? CircleAlert : LoaderCircle; return <a key={item.hash} className={`tx-row ${failed ? "failed" : done ? "done" : ""}`} href={item.hash.startsWith("pending-") ? undefined : txUrl(item.hash)} target="_blank" rel="noreferrer"><Icon className={!done && !failed ? "spin" : ""} size={14}/><span>{item.label}</span><b>{item.state.toLowerCase().replaceAll("_", " ")}</b></a>; })}</div>; }
