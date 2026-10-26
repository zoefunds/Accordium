# Security model

## Protected properties

- Only a wallet proven by the publishing domain can open a pact for that domain.
- One adapter receives at most one vote in an evidence round.
- A verified baseline must contain the commitment before escrow opens.
- Every evidence locator must represent the pact's exact source URL.
- Archive metadata timestamps must fall within the monitoring term.
- Round identifiers and source/timestamp/digest tuples are consumed once.
- Retrieved content must match the submitted SHA-256 digest.
- Model disagreement is treated as indeterminate.
- Escrow cannot remain indefinitely in an uncertainty or challenge state, and an unmonitored pact cannot be released as successful.
- No owner, guardian, fee receiver, or upgrade key exists.

## Adversarial inputs

Archived documents are untrusted. The prompt explicitly marks their content as evidence, caps the text length, and requests a strict finite verdict. Evidence locators are restricted to canonical Internet Archive and Arquivo.pt paths that embed both a capture timestamp and the pact's exact URL. Live-origin evidence must use the exact identity-bound source URL.

## Operational assumptions

Two archive operators may still share upstream data. Operators should choose adapters with independent storage and retrieval paths. Domain proof establishes control at verification time and expires after 30 days for new pact creation. Existing pacts retain their immutable publisher identity.

## Reporting

Do not test against a funded public deployment without permission. Include the contract address, transaction hash, reproduction steps, and impact in a private report to the deployment operator.
