# Security model

## Protected properties

- Only a wallet proven by the publishing domain can open a pact for that domain.
- Each evidence round requires exactly one vote from each approved archive adapter.
- A verified baseline must contain the commitment before escrow opens.
- Every evidence locator must represent the pact's exact source URL.
- Archive metadata timestamps must fall within the monitoring term.
- Round identifiers and source/timestamp/digest tuples are consumed once.
- Retrieved content must match the submitted SHA-256 digest.
- Model or archive disagreement is treated as indeterminate and resets consecutive breach progress.
- Escrow cannot remain indefinitely in an uncertainty or challenge state, and an unmonitored pact cannot be released as successful.
- During a challenged breach, unresolved evidence pays the stake to the beneficiary and returns only the challenge bond to the publisher.
- No owner, guardian, fee receiver, or upgrade key exists.

## Adversarial inputs

Archived documents are untrusted. The prompt explicitly marks their content as evidence, caps the text length, and requests a strict finite verdict. Evidence locators are restricted to canonical Internet Archive and Arquivo.pt paths that embed both a capture timestamp and the pact's exact URL. The contract confirms the timestamp, original URL, and successful status against the archive operator's capture index. The preparation API independently authorizes the on-chain origin, rejects private-address DNS results and off-host redirects, limits redirects to three, requests identity encoding, enforces a 180 KB declared and streaming response limit, and rejects invalid UTF-8.

## Operational assumptions

The two archive operators may still share upstream captures or both be unavailable. This is an explicit availability dependency; disagreement fails closed as indeterminate. Domain proof establishes control at verification time and expires after 30 days for new pact creation. Existing pacts retain their immutable publisher identity. The live baseline proves publication at opening time but is not itself a monitoring vote.

## Regression coverage

Executable direct tests cover wallet-bound identity, byte-body web responses, baseline admission, metadata substitution, digest replay under a new round ID, chronological evidence, consecutive breach reset, successful and unsuccessful challenges, both deadlines, native transfers, cancellation refunds, and ledger conservation. Frontend tests cover wrong-network switching, visible wallet errors, locator binding, SSRF controls, response limits, and finalized transaction rollback presentation.

## Reporting

Do not test against a funded public deployment without permission. Include the contract address, transaction hash, reproduction steps, and impact in a private report to the deployment operator.
