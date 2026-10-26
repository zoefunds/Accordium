# Deployment

## Current StudioNet release

- Contract: `0x88B88571D53F9dCE4941339027dF0423D6703F52`
- Transaction: `0x259c76e01fa41d1d7522f532f6c4ce296e442b42ccedb2c2b853ce7d05883d4f`
- Deployer: `0x7452084E1Cf767bf19C743051cFf27D9F7A87a4D`

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
