# Release verification

## Corrected StudioNet release

- Contract: `0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706`
- Deployment transaction: `0x8f5f2f2323396334c97b81fc87b961ce3a6ceff9ace3ba1a2edeb67e70768256`
- Finalized result: `MAJORITY_AGREE`
- Deployer: `0x7452084e1cf767bf19c743051cff27d9f7a87a4d` (`eventweaver`)
- Deployment source commit: `910711c`
- Contract SHA-256: `f0fdba86fc6f4a67b74682ea1c864009f34a3e5a820d559e9c58e2539987c79f`

The contract source fetched back from StudioNet was byte-for-byte identical to `contracts/Accordium.py` at the deployment commit. The finalized receipt reported three agreeing validators and no disagreeing validator.

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

The GenVM AST safety lint passed with no warnings. Its optional SDK semantic-validation phase could not locate the pinned legacy SDK artifact in the linter's newest artifact bundle; StudioNet compilation, execution, validator agreement, and finalization succeeded with that exact dependency and source.
