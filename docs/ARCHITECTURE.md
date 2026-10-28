# Architecture

## Trust boundaries

Accordium separates five concerns:

1. The wallet signs transactions and is the source of publisher authority.
2. The publisher domain proves that it recognizes that wallet.
3. Evidence adapters retrieve independently operated records.
4. GenLayer validators reach semantic consensus over admitted text.
5. Deterministic contract policy converts repeated, corroborated verdicts into state changes.

No evidence adapter can settle a pact alone. No model output can transfer value directly. A frontend is optional; every transition is callable on the contract.

Publisher proofs expire after 30 days. Opening another pact after that boundary requires a fresh domain verification, limiting the impact of a transferred or compromised domain.

## Evidence envelope

Opening a pact first retrieves and semantically admits a live baseline for the exact page beneath the wallet-verified domain. Each later claim includes an adapter name, the exact pact URL, immutable locator, archive-derived capture time, and SHA-256 digest. The contract binds the locator to the pact origin, confirms the timestamp, original URL, status, and archive digest through the operator's CDX index, constrains the capture to the monitoring term, and retrieves it inside an equivalence-principle block. For gzip captures, the indexed SHA-1 is verified against the archived wire bytes while the submitted SHA-256, baseline match, and semantic evaluation use the bounded decoded UTF-8 page. The source/timestamp/digest tuple is consumed only once.

A round accepts exactly one vote from each of the two supported archive operators and requires both to match. Each claimed timestamp and source URL is independently confirmed through that operator's capture index before content is admitted. Split or unavailable evidence is `INDETERMINATE`, never success or breach.

## Liveness policy

Funding is irrevocable by the publisher. Successful term completion requires at least two `HOLDS` rounds, the first within seven days of opening, no evidence gap longer than seven days, a final observation within seven days of expiry, and no admitted non-`HOLDS` round. Missing, stale, or broken coverage refunds at expiry rather than representing success. Uncertainty resets the consecutive-breach counter; three indeterminate live rounds cause a safety refund. During a challenged breach, unresolved evidence cannot overturn the breach: the stake goes to the beneficiary and only the bond returns to the publisher. A breach review and its ten-percent challenge each have seven-day terminal deadlines. The beneficiary may explicitly release a positively monitored live pact, but the publisher cannot cancel it.

## Application boundary

The registry derives its evidence status from on-chain monitoring rounds, the last verdict, and the consecutive breach count. Evidence preparation requires a pact ID, reads the authorized origin from StudioNet, and accepts only canonical Wayback or Arquivo.pt locators for that exact origin. DNS results, redirects, response size, and UTF-8 decoding are validated before a digest and claim are returned to the browser. The contract independently repeats the security-critical origin, metadata, time-window, digest, and replay checks.

## Accounting invariant

For each terminal pact:

```text
stake + challenge bond = paid to beneficiary + returned to publisher
```

The global ledger exposes total inflow, total outflow, and currently locked value for independent monitoring.
