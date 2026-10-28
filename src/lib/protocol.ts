export type PactState = "LIVE" | "REVIEW" | "CHALLENGED" | "PAID" | "RELEASED" | "REFUNDED";
export type SourceKind = "WAYBACK" | "ARQUIVO_PT";

export type Pact = {
  id: string; state: PactState; statement: string; publisher: string; beneficiary: string;
  origin: string; stake: string; expiresAt: string; identityDomain: string;
  evidenceQuorum: string; sourceKinds: SourceKind[]; evidenceStatus: string; lastVerdict: string;
};

export const stateLabel = (state: PactState) => ({ LIVE: "Monitoring", REVIEW: "Evidence review", CHALLENGED: "Challenge open", PAID: "Paid", RELEASED: "Completed", REFUNDED: "Safety refund" }[state]);
export const shorten = (value: string, size = 34) => value.length <= size ? value : `${value.slice(0, size - 1)}…`;
export const challengeBond = (stake: string): bigint => { const value = BigInt(stake); const tenth = value / 10n; return tenth > 0n ? tenth : 1n; };
