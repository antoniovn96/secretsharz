# Secret Sharz — Legacy Career Assessment Migration V1

## Purpose

Move legacy Firebase career-assessment evidence into the canonical PostgreSQL assessment model without deleting, rewriting or pretending that unavailable raw item responses still exist.

## Supported legacy sources

The first importer recognizes, in priority order:

1. `users/{personId}.careerAssessmentV2`
2. `users/{personId}.careerAssessment`
3. top-level `riasecScores` / `riasecCode` legacy fields

The importer preserves the source payload in the migrated assessment's report/context snapshot.

## Evidence limitation

The legacy records inspected in the application source expose summary outputs such as RIASEC scores/codes, streams, career matches and report context, but do not provide a reliable universal source of original item responses.

Therefore imported historical results are explicitly labelled:

- `rawResponsesAvailable: false`
- `reproducibility: limited`
- `interpretationStatus: legacy_imported_unknown_scale`

The migration does **not** invent original answers or fabricate a scoring key.

## Safety

The importer is dry-run by default.

Write mode requires both:

`--write --confirm`

It uses an idempotent migration registry and never deletes Firebase records.

## Operational sequence

1. Run the importer in dry-run mode against non-production.
2. Review candidate counts and representative records.
3. Reconcile hashes/counts against the source.
4. Run write mode for approved records.
5. Verify PostgreSQL counts and migration registry.
6. Keep Firebase as read-only migration source until reconciliation and governance sign-off.
7. Only then remove legacy assessment writes from application paths.

## Known limitation

The first version imports one assessment snapshot per source/person according to the priority above. A future historical-expansion pass should enumerate multiple attempts where the legacy data model contains them rather than collapsing them into a single latest snapshot.
