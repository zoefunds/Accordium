"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Copy, ShieldCheck } from "lucide-react";
import { useWallet } from "@/components/wallet-provider";
import { TxLifecycle } from "@/components/tx-lifecycle";
import { useTransaction } from "@/lib/use-transaction";

export function CreatePanel({ onFinalized }: { onFinalized?: () => Promise<void> | void }) {
  const [step, setStep] = useState(1); const [domain, setDomain] = useState(""); const [origin, setOrigin] = useState("");
  const [statement, setStatement] = useState(""); const [beneficiary, setBeneficiary] = useState(""); const [stake, setStake] = useState(""); const [term, setTerm] = useState("365"); const [proofStarted, setProofStarted] = useState(false); const [challenge, setChallenge] = useState("");
  const { address, connect } = useWallet(); const { transactions, error, send } = useTransaction(onFinalized);
  useEffect(() => { if (!address || !domain) return; const input = new TextEncoder().encode(`${address.toLowerCase()}|${domain.trim().toLowerCase()}|accordium-v1`); void crypto.subtle.digest("SHA-256", input).then(buffer => setChallenge(Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join(""))); }, [address, domain]);
  async function account() { return address ?? connect(); }
  async function beginProof() { const wallet = await account(); if (await send("Create identity challenge", "begin_identity", [domain], wallet)) setProofStarted(true); }
  async function verifyProof() { const wallet = await account(); if (await send("Verify publisher identity", "verify_identity", [domain], wallet)) setStep(2); }
  async function openPact() { const wallet = await account(); const id = `ACD-${Date.now().toString(36).toUpperCase()}`; await send("Open assurance pact", "open_pact", [id, domain, origin, statement, beneficiary, Number(term)], wallet, BigInt(stake || "0")); }
  return <aside className="create-panel">
    <div className="step-mark">0{step}<span>/ 03</span></div><p className="kicker">Open an accord</p><h2>{step === 1 ? "Bind your public identity" : step === 2 ? "Define the commitment" : "Fund the assurance"}</h2>
    {step === 1 && <><p className="panel-copy">Generate a wallet-bound challenge, publish it under your domain, then verify control on-chain.</p><label>Publisher domain<input value={domain} onChange={e => setDomain(e.target.value)} placeholder="your-company.example" /></label><label>Wallet address<input value={address ?? ""} readOnly placeholder="Connect wallet" /></label>{proofStarted && <div className="proof-box"><b>Publish at</b><code>https://{domain}/.well-known/accordium.json</code><b>JSON body</b><code>{JSON.stringify({ wallet: address, challenge })}</code><Copy size={14}/></div>}<div className="inline-actions"><button className="secondary" onClick={beginProof} disabled={!domain}>{proofStarted ? "Restart proof" : "Begin proof"}</button><button className="primary" onClick={verifyProof} disabled={!proofStarted}>Verify domain<ArrowRight size={16}/></button></div></>}
    {step === 2 && <><p className="panel-copy">Pin concrete language and the HTTPS page beneath your verified domain.</p><label>Public statement<textarea value={statement} onChange={e => setStatement(e.target.value)} placeholder="Write one concrete, testable commitment" /></label><label>Origin URL<input value={origin} onChange={e => setOrigin(e.target.value)} placeholder={`https://${domain || "domain.example"}/commitments`} /></label><div className="panel-actions"><button className="secondary" onClick={() => setStep(1)}>Back</button><button className="primary" onClick={() => setStep(3)} disabled={statement.length < 30 || !origin}>Continue<ArrowRight size={16}/></button></div></>}
    {step === 3 && <><p className="panel-copy">Name the beneficiary, term, and stake. Review wallet value carefully.</p><label>Beneficiary<input value={beneficiary} onChange={e => setBeneficiary(e.target.value)} placeholder="0x…" /></label><label>Term in days<input type="number" min="14" max="1095" value={term} onChange={e => setTerm(e.target.value)} /></label><label>Stake in wei<input inputMode="numeric" value={stake} onChange={e => setStake(e.target.value.replace(/\D/g, ""))} placeholder="Amount in wei" /></label><div className="safety-note"><ShieldCheck size={17}/>Automatic refund is enforced if evidence remains unresolved.</div><div className="panel-actions"><button className="secondary" onClick={() => setStep(2)}>Back</button><button className="primary" onClick={openPact} disabled={!beneficiary || !stake}>Sign &amp; open<ArrowRight size={16}/></button></div></>}
    {error && <p className="form-error">{error}</p>}<TxLifecycle items={transactions}/>
  </aside>;
}
