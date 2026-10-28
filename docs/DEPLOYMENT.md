# Deployment

## Current StudioNet release

- Application: `https://accordium-eight.vercel.app`
- Contract: `0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706`
- Transaction: `0x8f5f2f2323396334c97b81fc87b961ce3a6ceff9ace3ba1a2edeb67e70768256`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Exact deployment source commit: `910711c`
- Contract source SHA-256: `f0fdba86fc6f4a67b74682ea1c864009f34a3e5a820d559e9c58e2539987c79f`
- Production frontend release: `e7e605e`

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
NEXT_PUBLIC_ACCORDIUM_CONTRACT=0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706
NEXT_PUBLIC_GENLAYER_ENDPOINT=https://studio.genlayer.com/api
```

## Production checklist

- Pin the GenLayer dependency hash already declared in the contract.
- Restrict each evidence adapter to its canonical HTTPS host.
- Exercise identity proof, two-source agreement, split verdict, refund, review, challenge, and each terminal payout on the target network.
- Publish the byte-for-byte deployed source hash, deployment transaction, and frontend commit.
- Monitor `total_in - total_out` against the contract balance.

## Current operational proof

The `eventweaver` wallet completed domain challenge creation, validator-mediated identity verification, a funded pact creation, and a native refund on StudioNet. Pact `STUDIONET-VERIFY-20261028` is terminal in `REFUNDED`; `get_ledger()` reports one unit received, one returned, and zero locked. Transaction hashes and reproduction commands are in [VERIFICATION.md](VERIFICATION.md).
