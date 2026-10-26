# Architecture

## Trust boundaries

Accordium separates five concerns:

1. The wallet signs transactions and is the source of publisher authority.
2. The publisher domain proves that it recognizes that wallet.
3. Evidence adapters retrieve independently operated records.
4. GenLayer validators reach semantic consensus over admitted text.
5. Deterministic contract policy converts repeated, corroborated verdicts into state changes.

No evidence adapter can settle a pact alone. No model output can transfer value directly. A frontend is optional; every transition is callable on the contract.

## Evidence envelope

Each claim includes an adapter name, immutable locator, capture time, and SHA-256 digest. The contract retrieves the locator inside an equivalence-principle block, checks its size and digest, then asks the model only whether the precise statement still holds.

A round accepts one vote per adapter and requires two matching votes. Split or unavailable evidence is `INDETERMINATE`, never success or breach.

## Liveness policy

Uncertainty is bounded. After three indeterminate rounds, the stake returns to the publisher. A breach review lasts seven days. A publisher may place a ten-percent challenge bond, but a challenge also has a seven-day terminal deadline. `finalize` is permissionless.

## Accounting invariant

For each terminal pact:

```text
stake + challenge bond = paid to beneficiary + returned to publisher
```

The global ledger exposes total inflow, total outflow, and currently locked value for independent monitoring.
