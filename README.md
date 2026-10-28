# Accordium

Accordium is a GenLayer protocol for commitments that carry financial assurance. A verified publisher locks GEN behind a precise statement, names a beneficiary, and selects a monitoring term. Evidence from independent public records is admitted by digest and evaluated under validator consensus. Deterministic policy—not the model—controls state transitions and value.

## StudioNet deployment

- Live application: `https://accordium-eight.vercel.app`
- Contract: `0x9641BA0a9682739b9869070681BfeB09681a6c14`
- Deployment transaction: `0x839a9090673b02bee90b8e6062e2212fbeae740a0896574b3d43846c636abab3`
- Deployment source commit: `1f1eb03`
- Contract source SHA-256: `609d726e9c8964c5e68507a2adca0f024c108d4b6df4ed2cad7814ebee3692bb`
- Production frontend deployment: `dpl_4x1jJMGJWsu2oy46MzNsB69rd1ZH`
- Production frontend source commit: `44d7b50`

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

The current suite contains 27 direct contract tests and 16 frontend tests. `npm run verify` runs ESLint, Vitest, TypeScript checking, and a production Next.js build.

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
