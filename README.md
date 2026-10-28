# Accordium

Accordium is a GenLayer protocol for commitments that carry financial assurance. A verified publisher locks GEN behind a precise statement, names a beneficiary, and selects a monitoring term. Evidence from independent public records is admitted by digest and evaluated under validator consensus. Deterministic policy—not the model—controls state transitions and value.

## StudioNet deployment

- Live application: `https://accordium-eight.vercel.app`
- Contract: `0xF3B6F8CD79F1D2CB9B17519737e5B38197241803`
- Deployment transaction: `0x6c8e6a1548b6429a23211838230b69611f4b7acca5afda474a99cf18e3bda293`
- Deployment source commit: `fe9d36d`
- Contract source SHA-256: `e8814a86b066b6a9c47b0b8959ff15e4374e9f675fda8be15e586b43ba003338`
- Production frontend deployment: `dpl_EAwvovYTqG6fxBBa2NuyhWeZhWz8`

## Why Accordium exists

Public statements are easy to edit and difficult to enforce. Accordium turns a published commitment into a transparent pact with four guarantees:

- **Publisher authenticity.** A wallet-specific challenge at `/.well-known/accordium.json` binds the wallet staking value to the domain making the statement.
- **Evidence diversity.** A decision needs agreement from both independently fetched archive adapters: Internet Archive and Arquivo.pt. Each capture is confirmed against the operator's authoritative index metadata.
- **Narrow intelligence.** Validators classify whether a statement holds, weakened, disappeared, or cannot be determined. They never decide payouts or see a payout instruction.
- **Irrevocable assurance.** The publisher cannot cancel a funded pact. Successful term completion requires continuous positive coverage from the opening week through the final week.

## State model

```text
LIVE -- complete positive coverage + term ends ----------> RELEASED
  |  -- incomplete, stale, or broken coverage -----------> REFUNDED
  |  -- 3 indeterminate rounds --------------------------> REFUNDED
  +  -- 2 consecutive breach rounds ---------------------> REVIEW
                                                            |
                  review deadline, no challenge ------------+--> PAID
                  publisher adds 10% bond ----------------------> CHALLENGED
                                                                  |
                  fresh HOLDS quorum -----------------------------> RELEASED
                  fresh breach quorum ----------------------------> PAID
                  deadline / 3 indeterminate rounds --------------> PAID stake
                                                                  + returned bond
```

Every funded path ends in `PAID`, `RELEASED`, or `REFUNDED`. No privileged account can withdraw, pause, or redirect escrow.

## Repository layout

```text
contracts/Accordium.py      deployable intelligent contract
contracts/policy.py         pure, directly tested policy kernel
src/app                     Next.js registry and onboarding experience
src/components              independent interface components
tests/direct                executable contract lifecycle and invariant tests
tests/frontend              wallet, transaction, evidence, and SSRF regressions
docs                        architecture, security, deployment, and release evidence
```

The deployable contract stays focused on storage, GenLayer consensus calls, and settlement. Pure quorum, liveness, and accounting rules live in a small module that can be audited without a VM.

## Publisher proof

1. Call `begin_identity("example.com")` from the publisher wallet.
2. Publish the returned challenge:

```json
{"wallet":"0xYOUR_WALLET","challenge":"RETURNED_CHALLENGE"}
```

3. Serve it at `https://example.com/.well-known/accordium.json`.
4. Call `verify_identity("example.com")` from the same wallet.
5. Open pacts only for HTTPS pages beneath that verified domain.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add the deployed address.

## Verification

```bash
python3 -m pytest tests/direct -q
npm run verify
genvm-lint lint contracts/Accordium.py --json
```

The current suite contains 32 direct contract and archive-verifier tests and 16 frontend tests. `npm run verify` runs ESLint, Vitest, TypeScript checking, and a production Next.js build. The read-only `scripts/verify_archive_round.py` command in the release verification document reproduces archive metadata and payload binding without wallet access, including compressed archive payloads.

## Contract surface

- `begin_identity(domain)`
- `verify_identity(domain)`
- `open_pact(id, domain, origin_url, statement, beneficiary, term_days)`
- `submit_evidence_round(id, round_id, evidence_json)`
- `challenge(id)`
- `beneficiary_release(id)`
- `finalize(id)`
- `get_pact(id)`, `pact_evidence(id)`, `list_pacts()`, `get_ledger()`, `get_limits()`

See [Architecture](docs/ARCHITECTURE.md), [Security](docs/SECURITY.md), [Deployment](docs/DEPLOYMENT.md), and [Release verification](docs/VERIFICATION.md).
