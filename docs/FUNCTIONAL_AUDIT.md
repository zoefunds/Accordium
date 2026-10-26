# Functional audit

Date: 2026-10-26

## Executive status

The public presentation and read-only StudioNet integration are operational. The GitHub repository at `zoefunds/Accordium` is empty, so the published source is currently unavailable. The funded workflow is not ready for production use because evidence can be unrelated to the bonded URL, timestamps and evidence digests are not replay-pinned across rounds, and the available Common Crawl input is not decoded into an admissible document.

## Confirmed working

- Public routes `/`, `/registry`, `/create`, `/protocol`, and `/security` return HTTP 200.
- The production API reads `get_ledger` from StudioNet.
- The deployed contract exposes the documented public methods.
- Domain challenges are wallet-specific and the proof is checked under strict validator equality.
- Semantic breach excerpts are checked against admitted text.
- Quorum requires distinct adapter labels within one round.
- Indeterminate rounds, reviews, and challenges have bounded terminal paths.
- Local direct tests, frontend unit tests, lint, build, and dependency audit pass.

## Critical gaps

### Evidence is not bound to the pact origin

`_allowed_locator` validates only the evidence host. A Wayback or Common Crawl locator may describe any page. Signed-origin evidence may describe any path on the verified domain. The semantic evaluator can therefore classify unrelated content against the bonded statement.

Required remediation: admit a canonical target URL into every evidence claim and deterministically prove the retrieved archive record identifies the exact `pact.origin_url`.

### No baseline admission

`open_pact` stores caller-supplied statement text but never fetches the origin page or proves that the statement was published there at activation. A pact can begin around a statement that never appeared publicly.

Required remediation: fetch and digest a baseline record during creation, verify the statement semantically holds, and pin its timestamp, source identities, and content digest.

### Replay protection covers round IDs, not evidence

Changing `round_id` permits the same capture and digest to be submitted repeatedly. Two submissions of identical content can satisfy the consecutive breach threshold.

Required remediation: track pact-scoped `(source, captured_at, digest)` keys and require monotonically increasing, distinct evidence points.

### Evidence timestamps are untrusted metadata

`captured_at` is copied into storage without format checks, term-bound checks, or proof that it belongs to the retrieved record.

Required remediation: parse timestamps deterministically, bind them to archive metadata, and enforce `created_at <= captured_at <= expires_at`.

### Common Crawl evidence path is not usable as written

The contract requests `data.commoncrawl.org` content as `response.text`. Common Crawl record endpoints commonly return compressed WARC segments, not clean page text. There is no WARC framing, decompression, response-header extraction, or decoded-size gate.

Required remediation: implement a bounded deterministic WARC admission pipeline or use an independently operated archive adapter that returns canonical decoded documents with signed metadata.

## High-priority product gaps

- The frontend requires users to manually construct evidence JSON and calculate SHA-256 digests.
- Invalid evidence JSON throws before the transaction error state can render.
- Transaction completion in registry cards does not refresh the ledger.
- The copy icon in publisher onboarding has no copy action.
- Wallet connection errors are stored in context but never rendered by the shared header.
- There is no wrong-network detection or guided StudioNet network switch.
- There is no pact detail or evidence-history view.
- A live pact can expire and release its stake with zero accepted monitoring rounds.

## Test coverage gaps

The green suite does not exercise a funded pact lifecycle, archive retrieval, two-source semantic quorum, evidence replay, deadline transitions, transfer conservation across every terminal path, wallet interaction, component behavior, or browser end-to-end transactions. Several contract tests assert source-code strings rather than behavior.

## Release recommendation

Keep the current deployment as a public prototype with no user funds. Do not present it as production escrow until the critical evidence-binding, baseline, replay, timestamp, and archive-decoding gaps are fixed in a new contract and covered by direct and StudioNet lifecycle tests.
