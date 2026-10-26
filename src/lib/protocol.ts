export type PactState = "LIVE" | "REVIEW" | "CHALLENGED" | "PAID" | "RELEASED" | "REFUNDED";
export type SourceKind = "WAYBACK" | "COMMON_CRAWL" | "SIGNED_ORIGIN";

export type Pact = {
  id: string; state: PactState; statement: string; publisher: string; beneficiary: string;
  origin: string; stake: string; expiresAt: string; identityDomain: string;
  evidenceQuorum: string; sourceKinds: SourceKind[]; health: number;
};

export const demoPacts: Pact[] = [
  { id: "ACD-1048", state: "LIVE", statement: "The service will retain a free export path through 2027.", publisher: "0x42F…19A", beneficiary: "0x8C1…E02", origin: "status.northstar.example/pledges/export", stake: "18,000", expiresAt: "18 Dec 2027", identityDomain: "northstar.example", evidenceQuorum: "2 of 3", sourceKinds: ["WAYBACK", "COMMON_CRAWL", "SIGNED_ORIGIN"], health: 92 },
  { id: "ACD-0981", state: "REVIEW", statement: "No customer location history will be sold to advertising partners.", publisher: "0x91B…0D4", beneficiary: "0x51C…771", origin: "trust.helio.example/privacy", stake: "32,500", expiresAt: "04 Apr 2028", identityDomain: "helio.example", evidenceQuorum: "2 of 3", sourceKinds: ["WAYBACK", "COMMON_CRAWL", "SIGNED_ORIGIN"], health: 48 },
  { id: "ACD-0766", state: "RELEASED", statement: "All critical security fixes will remain available to community users.", publisher: "0x61A…3F8", beneficiary: "0x2DE…990", origin: "arc.example/security-policy", stake: "9,400", expiresAt: "12 Jul 2026", identityDomain: "arc.example", evidenceQuorum: "2 of 3", sourceKinds: ["WAYBACK", "COMMON_CRAWL"], health: 100 }
];

export const stateLabel = (state: PactState) => ({ LIVE: "Monitoring", REVIEW: "Evidence review", CHALLENGED: "Challenge open", PAID: "Paid", RELEASED: "Completed", REFUNDED: "Safety refund" }[state]);
export const shorten = (value: string, size = 34) => value.length <= size ? value : `${value.slice(0, size - 1)}…`;
export const challengeBond = (stake: string): bigint => { const value = BigInt(stake); const tenth = value / 10n; return tenth > 0n ? tenth : 1n; };
