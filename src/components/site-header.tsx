"use client";
import Link from "next/link";
import { useWallet } from "@/components/wallet-provider";
export function SiteHeader() { const { address, connect, disconnect, error, clearError } = useWallet(); return <><nav><Link className="brand" href="/"><span>AC</span>Accordium</Link><div className="nav-center"><Link href="/registry">Registry</Link><Link href="/protocol">Protocol</Link><Link href="/security">Security</Link><Link href="/create">Create</Link></div><button className="wallet" onClick={() => address ? disconnect() : void connect().catch(()=>undefined)}><i/>{address ? `${address.slice(0,6)}…${address.slice(-4)}` : "Connect wallet"}</button></nav>{error&&<div className="wallet-error" role="alert"><span>{error}</span><button onClick={clearError}>Dismiss</button></div>}</>; }
