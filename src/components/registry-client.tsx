"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { loadDashboard, type Dashboard } from "@/lib/chain";
import { PactCard } from "@/components/pact-card";
import type { Pact, PactState } from "@/lib/protocol";
const empty: Dashboard = { pacts: [], ledger: { total_in: "0", total_out: "0", currently_locked: "0", pacts: "0" }, configured: true };
const state = (value: string) => value as PactState;
const status = (rounds:string,verdict:string,run:string,coverage:boolean) => rounds==="0"?"Awaiting first observation":verdict==="HOLDS"&&coverage?`Coverage intact · ${rounds} positive round(s)`:verdict==="HOLDS"?`Positive now · term coverage incomplete`:verdict==="INDETERMINATE"?`Unresolved · coverage incomplete`:`${verdict.toLowerCase()} · breach run ${run}`;
export function RegistryClient() {
  const [data,setData]=useState(empty),[loading,setLoading]=useState(true),[error,setError]=useState<string>(),[query,setQuery]=useState("");
  const refresh=useCallback(async()=>{setLoading(true);try{setData(await loadDashboard());setError(undefined)}catch(e){setError(e instanceof Error?e.message:"Registry unavailable")}finally{setLoading(false)}},[]);
  useEffect(()=>{const task=window.setTimeout(()=>void refresh(),0);return()=>window.clearTimeout(task)},[refresh]);
  const pacts=useMemo(()=>data.pacts.map<Pact>(p=>({id:p.id,state:state(p.state),statement:p.statement,publisher:p.publisher,beneficiary:p.beneficiary,origin:p.origin_url,stake:p.stake,expiresAt:p.expires_at,identityDomain:p.domain,evidenceQuorum:"2 independent archives",sourceKinds:["WAYBACK","ARQUIVO_PT"],evidenceStatus:status(p.monitoring_rounds,p.last_verdict,p.breach_run,p.coverage_intact),lastVerdict:p.last_verdict})).filter(p=>`${p.id} ${p.statement} ${p.origin}`.toLowerCase().includes(query.toLowerCase())),[data,query]);
  return <><div className="registry-toolbar"><label className="search"><Search size={16}/><input aria-label="Search accords" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by statement, ID, or origin"/></label><button className="secondary" onClick={()=>void refresh()}>Refresh ledger</button></div><div className="registry-stats"><div><small>Locked</small><b>{data.ledger.currently_locked} wei</b></div><div><small>Accords</small><b>{data.ledger.pacts}</b></div><div><small>Total out</small><b>{data.ledger.total_out} wei</b></div></div>{loading&&<p className="loading"><LoaderCircle className="spin"/>Reading StudioNet…</p>}{error&&<p className="form-error">{error}</p>}{!loading&&!pacts.length&&<div className="empty-registry"><b>No accords yet</b><p>The live contract is ready. Be the first verified publisher to open an accord.</p></div>}<div className="cards registry-cards">{pacts.map(p=><PactCard key={p.id} pact={p} onFinalized={refresh}/>)}</div></>;
}
