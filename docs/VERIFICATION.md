# Release verification

## StudioNet release

- Contract: `0xF3B6F8CD79F1D2CB9B17519737e5B38197241803`
- Deployment transaction: `0x6c8e6a1548b6429a23211838230b69611f4b7acca5afda474a99cf18e3bda293`
- Finalized result: `MAJORITY_AGREE`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Deployment source commit: `fe9d36d`
- Contract SHA-256: `e8814a86b066b6a9c47b0b8959ff15e4374e9f675fda8be15e586b43ba003338`
- Production application: `https://accordium-eight.vercel.app`
- Production frontend deployment: `dpl_EAwvovYTqG6fxBBa2NuyhWeZhWz8`

The contract source fetched from StudioNet matches `contracts/Accordium.py` at the deployment commit (ignoring trailing newlines added by the CLI formatter). The finalized deployment receipt reports validator majority agreement.

## Finalized live identity and funding

- Identity challenge: `0x3d07392c8658f08af3a68274c0cd0a17b9b81085b64a94ea58c882484f7160a9`
- Wallet-bound identity verification: `0x71f1c1efaec006d1e3cfeac0dc78e2b09979cbbe26638516b1e4e1d41deca7c3`
- Funded pact creation: `0x05a884ab2f81293a295794d470568c5f774e1de2846685ecdc6abb21e367fe3a`
- Verification pact: `STUDIONET-WIRE-20261028`
- Stake: `1 wei`
- Publisher: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d`
- Beneficiary: `0x1c2e587043568239b2fcaec5f96f278eb134b7f5`
- Baseline admitted at: `2026-10-28T06:56:39.371650Z`
- Baseline SHA-256: `640de92c0e5898a5211def9813208a9323033512ae86cacb436bf2c5f06574cf`

Validators retrieved the wallet-specific proof at `https://accordium-eight.vercel.app/.well-known/accordium.json`, verified the live commitment at `https://accordium-eight.vercel.app/commitment`, and finalized an irrevocable funded pact. Its initial ledger is `total_in = 1`, `total_out = 0`, and `currently_locked = 1`.

## Independent archive captures

- Wayback capture: `20261028065828`
- Arquivo.pt finalized recording: `20261028070954`
- Arquivo.pt replay reference: `https://arquivo.pt/wayback/20261028070954/https://accordium-eight.vercel.app/commitment`

Both recordings were completed after pact creation. Arquivo.pt reports that its finalized recording will become available at the replay reference above, but it must also appear through the public CDX/replay index before an evidence-admission or settlement transaction can be claimed. Accordium rejects missing or unindexed captures rather than weakening origin, timestamp, wire-digest, or decoded-content admission.

## Reproduction

```bash
python3 scripts/verify_archive_round.py \
  --origin https://accordium-eight.vercel.app/commitment \
  --baseline-sha256 640de92c0e5898a5211def9813208a9323033512ae86cacb436bf2c5f06574cf \
  --wayback-stamp 20261028065828 \
  --arquivo-stamp 20261028070954
python3 -m pytest tests/direct -q
npm ci
npm run verify
genvm-lint lint contracts/Accordium.py --json
genlayer receipt 0x6c8e6a1548b6429a23211838230b69611f4b7acca5afda474a99cf18e3bda293
genlayer code 0xF3B6F8CD79F1D2CB9B17519737e5B38197241803
shasum -a 256 contracts/Accordium.py
```

The archive verifier is read-only and exits nonzero unless both operator indexes return exactly one HTTP 200 record for the pact origin and capture timestamp, each archived wire payload matches its indexed SHA-1 digest, and each bounded decoded UTF-8 replay matches the on-chain baseline SHA-256. This distinction is required for gzip captures. The verifier requires no wallet or private key.

The GenVM AST safety lint passes all three checks with no warnings. StudioNet compilation, validator execution, agreement, and finalization succeeded with the pinned dependency and exact source above.

## Verified test baseline

- Direct contract and archive-verifier tests: 32 passed.
- Frontend tests: 16 passed across five test files.
- ESLint: passed.
- TypeScript and production Next.js build: passed.
- GenVM AST safety lint: passed with three checks and no warnings.
