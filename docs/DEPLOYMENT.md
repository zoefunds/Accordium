# Deployment

## Current StudioNet release

- Application: `https://accordium-eight.vercel.app`
- Contract: `0xF3B6F8CD79F1D2CB9B17519737e5B38197241803`
- Transaction: `0x6c8e6a1548b6429a23211838230b69611f4b7acca5afda474a99cf18e3bda293`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Exact deployment source commit: `fe9d36d`
- Contract source SHA-256: `e8814a86b066b6a9c47b0b8959ff15e4374e9f675fda8be15e586b43ba003338`
- Production frontend deployment: `dpl_EAwvovYTqG6fxBBa2NuyhWeZhWz8`

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
NEXT_PUBLIC_ACCORDIUM_CONTRACT=0xF3B6F8CD79F1D2CB9B17519737e5B38197241803
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
