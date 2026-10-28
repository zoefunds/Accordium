# Deployment

## Current StudioNet release

- Application: `https://accordium-eight.vercel.app`
- Contract: `0x9641BA0a9682739b9869070681BfeB09681a6c14`
- Transaction: `0x839a9090673b02bee90b8e6062e2212fbeae740a0896574b3d43846c636abab3`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Exact deployment source commit: `1f1eb03`
- Contract source SHA-256: `609d726e9c8964c5e68507a2adca0f024c108d4b6df4ed2cad7814ebee3692bb`
- Production frontend deployment: `dpl_4x1jJMGJWsu2oy46MzNsB69rd1ZH`
- Production frontend source commit: `44d7b50`

## Prerequisites

- Node.js 20+
- Python 3.11+
- A GenLayer StudioNet account funded for deployment
- `genlayer-js` 1.1.8

## Preflight

Run all checks and record their exact commit:

```bash
python3 -m pytest tests/direct -q
npm ci
npm run verify
genvm-lint lint contracts/Accordium.py --json
git rev-parse HEAD
```

Deploy `contracts/Accordium.py` with the Studio CLI or Studio interface. Wait for `FINALIZED`, fetch the deployed source with `genlayer code`, and compare its SHA-256 with the reviewed local file. Set `NEXT_PUBLIC_ACCORDIUM_CONTRACT` to the finalized address, rebuild the frontend, and verify the production `/api/accordium/read` endpoint reports the same ledger as a direct contract read.

The live frontend uses:

```text
NEXT_PUBLIC_ACCORDIUM_CONTRACT=0x9641BA0a9682739b9869070681BfeB09681a6c14
NEXT_PUBLIC_GENLAYER_ENDPOINT=https://studio.genlayer.com/api
```

## Production checklist

- Pin the GenLayer dependency hash already declared in the contract.
- Restrict each evidence adapter to its canonical HTTPS host.
- Exercise identity proof, two-source agreement, split verdict, refund, review, challenge, and each terminal payout on the target network.
- Publish the byte-for-byte deployed source hash, deployment transaction, and frontend commit.
- Monitor `total_in - total_out` against the contract balance.

## Operational proof

Finalized deployment, identity, archive-adjudication, and evidence-driven settlement transaction hashes are maintained in [VERIFICATION.md](VERIFICATION.md).
