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

Opening a pact first admits a verified live baseline for the exact bonded page. Each later claim includes an adapter name, the exact pact URL, immutable locator, archive-derived capture time, and SHA-256 digest. The contract binds the locator to the pact origin, constrains it to the monitoring term, retrieves it inside an equivalence-principle block, checks its size and digest, and consumes the capture tuple only once before asking whether the precise statement still holds.

A round accepts one vote per adapter and requires two matching votes. Split or unavailable evidence is `INDETERMINATE`, never success or breach.

## Liveness policy

Uncertainty is bounded. After three indeterminate rounds, the stake returns to the publisher. A breach review lasts seven days. A publisher may place a ten-percent challenge bond, but a challenge also has a seven-day terminal deadline. `finalize` is permissionless. Expiry without an admitted monitoring round is a refund, never a successful release.

## Accounting invariant

For each terminal pact:

```text
stake + challenge bond = paid to beneficiary + returned to publisher
```

The global ledger exposes total inflow, total outflow, and currently locked value for independent monitoring.
