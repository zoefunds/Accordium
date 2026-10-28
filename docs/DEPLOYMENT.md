# Deployment

## Current StudioNet release

- Application: `https://accordium-eight.vercel.app`
- Contract: `0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706`
- Transaction: `0x8f5f2f2323396334c97b81fc87b961ce3a6ceff9ace3ba1a2edeb67e70768256`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Exact deployment source commit: `910711c`

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
