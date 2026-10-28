# Release verification

## StudioNet release

- Contract: `0x9641BA0a9682739b9869070681BfeB09681a6c14`
- Deployment transaction: `0x839a9090673b02bee90b8e6062e2212fbeae740a0896574b3d43846c636abab3`
- Finalized result: `MAJORITY_AGREE`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Deployment source commit: `1f1eb03`
- Contract SHA-256: `609d726e9c8964c5e68507a2adca0f024c108d4b6df4ed2cad7814ebee3692bb`
- Production application: `https://accordium-eight.vercel.app`
- Production frontend deployment: `dpl_4x1jJMGJWsu2oy46MzNsB69rd1ZH`
- Production frontend source commit: `44d7b50`

The contract source fetched from StudioNet is byte-for-byte identical to `contracts/Accordium.py` at the deployment commit. The finalized deployment receipt reports validator agreement.

## Finalized live identity and funding

- Identity challenge: `0x27d409ceb3b89738dd71db4c052fd5f05977dd3637f2f3904424528677eef69d`
- Wallet-bound identity verification: `0x12c999f4f9f5bca55234c3c71b2f0d86cba5e32f7a8500e59c5a9ef486b614f9`
- Funded pact creation: `0xc6cf9e1d043dd474a6afe8086802c68fa86f33ee3fba49db44e4b66c23cb2a55`
- Verification pact: `STUDIONET-ARCHIVE-20261028`
- Stake: `1 wei`
- Publisher: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d`
- Beneficiary: `0x1c2e587043568239b2fcaec5f96f278eb134b7f5`
- Baseline admitted at: `2026-10-28T01:29:47.446155Z`
- Baseline SHA-256: `dc9a3786a5df6cfee5dc167f4dbb1221cdca2d2d694b5b74da8782eacc47d121`

Validators retrieved the wallet-specific proof at `https://accordium-eight.vercel.app/.well-known/accordium.json`, verified the live commitment at `https://accordium-eight.vercel.app/commitment`, and finalized an irrevocable funded pact. Its initial ledger is `total_in = 1`, `total_out = 0`, and `currently_locked = 1`.

## Independent archive captures

- Wayback capture: `20261028013212`
- Wayback index digest: `L6DMMDBE6WJH6B3YN3P5KECNDUQ2O25Z`
- Wayback Save Page Now job: `spn2-f488cc62601ceb9682f65d6cc58dcdf60c0adcd4` (`success`, HTTP 200)
- Arquivo.pt finalized recording: `20261028053813`

Both captures were completed after pact creation. The Wayback capture is indexed. Arquivo.pt finalized the browser recording and issued its replay timestamp, but has not yet exposed it through its public CDX/replay index, so no evidence-admission or settlement transaction is claimed here until that independent metadata is retrievable. Accordium rejects an unindexed capture rather than weakening origin, timestamp, or content-identity admission.

## Reproduction

```bash
python3 scripts/verify_archive_round.py \
  --origin https://accordium-eight.vercel.app/commitment \
  --baseline-sha256 dc9a3786a5df6cfee5dc167f4dbb1221cdca2d2d694b5b74da8782eacc47d121 \
  --wayback-stamp 20261028013212 \
  --arquivo-stamp 20261028053813
python3 -m pytest tests/direct -q
npm ci
npm run verify
genvm-lint lint contracts/Accordium.py --json
genlayer receipt 0x839a9090673b02bee90b8e6062e2212fbeae740a0896574b3d43846c636abab3
genlayer code 0x9641BA0a9682739b9869070681BfeB09681a6c14
shasum -a 256 contracts/Accordium.py
```

The archive verifier is read-only and exits nonzero unless both operator indexes return exactly one HTTP 200 record for the pact origin and capture timestamp, each archived wire payload matches its indexed SHA-1 digest, and each bounded decoded UTF-8 replay matches the on-chain baseline SHA-256. This distinction is required for gzip captures. The verifier requires no wallet or private key.

The GenVM AST safety lint passes all three checks with no warnings. StudioNet compilation, validator execution, agreement, and finalization succeeded with the pinned dependency and exact source above.

## Verified test baseline

- Direct contract tests: 27 passed.
- Frontend tests: 16 passed across five test files.
- ESLint: passed.
- TypeScript and production Next.js build: passed.
- GenVM AST safety lint: passed with three checks and no warnings.
