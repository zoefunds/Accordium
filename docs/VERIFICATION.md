# Release verification

## StudioNet release

- Contract: `0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706`
- Deployment transaction: `0x8f5f2f2323396334c97b81fc87b961ce3a6ceff9ace3ba1a2edeb67e70768256`
- Finalized result: `MAJORITY_AGREE`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Deployment source commit: `910711c`
- Contract SHA-256: `f0fdba86fc6f4a67b74682ea1c864009f34a3e5a820d559e9c58e2539987c79f`

The contract source fetched back from StudioNet was byte-for-byte identical to `contracts/Accordium.py` at the deployment commit. The finalized receipt reported three agreeing validators and no disagreeing validator.

- Production application: `https://accordium-eight.vercel.app`
- Production frontend release: `e7e605e`

## Finalized live lifecycle

- Identity challenge: `0x40a5ab27e790266cd11a40f6ec9ed5a6602e11a1f79ef622dd30e49a68513f68`
- Wallet-bound identity verification: `0x8587957323db0988e3fb6b89f7ca5ae6d808ab6efd765a15648aa7c2cb70535e`
- Funded pact creation: `0x1d7042668c9e6a53cfc98d9e43200f13810d3ba40e5c52c02f1818fbbf212c2f`
- Native refund through `cancel_unmonitored`: `0xcde509ca19c8e317b8a1d66c986296ed21895030fd0cb8e17900c04a370cff13`
- Verification pact: `STUDIONET-VERIFY-20261028`

Validators retrieved the wallet-specific proof at `https://accordium-eight.vercel.app/.well-known/accordium.json`, admitted the live baseline at `https://accordium-eight.vercel.app/commitment`, and finalized a funded pact. The cancellation then emitted the native refund to the publisher. The on-chain ledger reports `total_in = 1`, `total_out = 1`, and `currently_locked = 0`.

The production read API independently returned the same terminal pact and conserved ledger after deployment.

## Reproduction

```bash
python3 -m pytest tests/direct -q
npm ci
npm run verify
genvm-lint lint contracts/Accordium.py --json
genlayer receipt 0x8f5f2f2323396334c97b81fc87b961ce3a6ceff9ace3ba1a2edeb67e70768256
genlayer code 0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706
shasum -a 256 contracts/Accordium.py
```

The GenVM AST safety lint passed with no warnings. The linter's optional SDK semantic-validation phase could not locate the contract's pinned SDK artifact in its newest artifact bundle, so it is not represented as passed. StudioNet compilation, execution, validator agreement, and finalization succeeded with that exact dependency and source.

## Verified test baseline

- Direct contract tests: 23 passed.
- Frontend tests: 16 passed across five test files.
- ESLint: passed.
- TypeScript and production Next.js build: passed.
- GenVM AST safety lint: passed with three checks and no warnings.
