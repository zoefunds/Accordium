# Security model

## Protected properties

- Only a wallet proven by the publishing domain can open a pact for that domain.
- One adapter receives at most one vote in an evidence round.
- A round identifier is consumed once, preventing replay.
- Retrieved content must match the submitted SHA-256 digest.
- Model disagreement is treated as indeterminate.
- Escrow cannot remain indefinitely in an uncertainty or challenge state.
- No owner, guardian, fee receiver, or upgrade key exists.

## Adversarial inputs

Archived documents are untrusted. The prompt explicitly marks their content as evidence, caps the text length, and requests a strict finite verdict. Evidence locators are restricted by adapter policy in production deployments; deployments should add an explicit hostname allowlist once final adapter endpoints are selected.

## Operational assumptions

Two archive operators may still share upstream data. Operators should choose adapters with independent storage and retrieval paths. Domain proof establishes control at verification time; long-duration pacts should require periodic re-verification in a later protocol version.

## Reporting

Do not test against a funded public deployment without permission. Include the contract address, transaction hash, reproduction steps, and impact in a private report to the deployment operator.
