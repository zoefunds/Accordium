# Deployment

## Current StudioNet release

- Application: `https://accordium-eight.vercel.app`
- Contract: `0x1b24bbB2c8441E38Df159EbE1bB7a6F80DD515ce`
- Transaction: `0x3b9ab56bd8994d25b2cd4b1298005cca84674815d9121dffd08b37c52d395d61`
- Deployer: `0x1c2e587043568239B2fcaeC5f96F278EB134b7f5`

## Prerequisites

- Node.js 20+
- Python 3.11+
- A GenLayer StudioNet account funded for deployment
- `genlayer-js` 1.1.8

## Preflight

Run all checks and record their exact commit:

```bash
python -m pytest
npm ci
npm run verify
git rev-parse HEAD
```

Deploy `contracts/Accordium.py` with the Studio CLI or Studio interface. Set `NEXT_PUBLIC_ACCORDIUM_CONTRACT` to the finalized address, then rebuild the frontend. Confirm `get_limits()` and `get_ledger()` before accepting funds.

## Production checklist

- Pin the GenLayer dependency hash already declared in the contract.
- Restrict each evidence adapter to its canonical HTTPS host.
- Exercise identity proof, two-source agreement, split verdict, refund, review, challenge, and each terminal payout on the target network.
- Publish the deployed bytecode digest and frontend commit.
- Monitor `total_in - total_out` against the contract balance.
