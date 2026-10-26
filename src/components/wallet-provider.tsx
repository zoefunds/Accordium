"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Wallet = { address?: `0x${string}`; connect: () => Promise<`0x${string}`>; disconnect: () => void; error?: string };
const Context = createContext<Wallet | undefined>(undefined);
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<`0x${string}`>(); const [error, setError] = useState<string>();
  useEffect(() => { const changed = (...values: unknown[]) => setAddress((values[0] as `0x${string}`[] | undefined)?.[0]); window.ethereum?.on?.("accountsChanged", changed); return () => window.ethereum?.removeListener?.("accountsChanged", changed); }, []);
  async function connect() { try { if (!window.ethereum) throw new Error("Install a GenLayer-compatible browser wallet."); const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as `0x${string}`[]; if (!accounts[0]) throw new Error("Wallet returned no account."); setAddress(accounts[0]); setError(undefined); return accounts[0]; } catch (cause) { const message = cause instanceof Error ? cause.message : "Wallet connection failed."; setError(message); throw new Error(message); } }
  return <Context.Provider value={{ address, connect, disconnect: () => setAddress(undefined), error }}>{children}</Context.Provider>;
}
export function useWallet() { const value = useContext(Context); if (!value) throw new Error("WalletProvider is missing."); return value; }
