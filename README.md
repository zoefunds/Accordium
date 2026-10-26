# Accordium

Accordium is a GenLayer protocol for commitments that carry financial assurance. A verified publisher locks GEN behind a precise statement, names a beneficiary, and selects a monitoring term. Evidence from independent public records is admitted by digest and evaluated under validator consensus. Deterministic policy—not the model—controls state transitions and value.

## StudioNet deployment

- Contract: `0x88B88571D53F9dCE4941339027dF0423D6703F52`
- Deployment transaction: `0x259c76e01fa41d1d7522f532f6c4ce296e442b42ccedb2c2b853ce7d05883d4f`

## Why Accordium exists

Public statements are easy to edit and difficult to enforce. Accordium turns a published commitment into a transparent pact with four guarantees:

- **Publisher authenticity.** A wallet-specific challenge at `/.well-known/accordium.json` binds the wallet staking value to the domain making the statement.
- **Evidence diversity.** A decision needs agreement from at least two distinct adapters: Internet Archive, Common Crawl, or a signed origin record.
- **Narrow intelligence.** Validators classify whether a statement holds, weakened, disappeared, or cannot be determined. They never decide payouts or see a payout instruction.
- **Capital liveness.** Three indeterminate rounds trigger a safety refund. Reviews and challenges have hard deadlines and permissionless terminal calls.

## State model

```text
                        +----------- challenge -----------+
                        |                                  v
LIVE -- breach quorum -> REVIEW -- deadline ----------> PAID
 |                         |                           CHALLENGED
 |                         +-- no challenge              |
 +-- term complete -------------------------------> RELEASED
 |
 +-- 3 indeterminate rounds ----------------------> REFUNDED
```

Every funded path ends in `PAID`, `RELEASED`, or `REFUNDED`. No privileged account can withdraw, pause, or redirect escrow.

## Repository layout

```text
contracts/Accordium.py      deployable intelligent contract
contracts/policy.py         pure, directly tested policy kernel
src/app                     Next.js registry and onboarding experience
src/components              independent interface components
tests/direct                contract invariants and policy tests
tests/frontend              presentation helper tests
docs                        architecture, threat model, and operations
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
python -m pytest
npm test
npm run lint
npm run build
```

## Contract surface

- `begin_identity(domain)`
- `verify_identity(domain)`
- `open_pact(id, domain, origin_url, statement, beneficiary, term_days)`
- `submit_evidence_round(id, round_id, evidence_json)`
- `challenge(id)`
- `finalize(id)`
- `get_pact(id)`, `list_pacts()`, `get_ledger()`, `get_limits()`

See [Architecture](docs/ARCHITECTURE.md), [Security](docs/SECURITY.md), and [Deployment](docs/DEPLOYMENT.md) before deploying.
