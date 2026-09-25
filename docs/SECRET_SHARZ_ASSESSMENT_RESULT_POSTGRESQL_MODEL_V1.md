# Secret Sharz — Assessment Result PostgreSQL Model V1

**Status:** Approved persistence implementation — PostgreSQL via node-postgres (pg) with explicit SQL migrations  
**Branch:** `rebuild/platform-foundation-v1`

## 1. Purpose

Persist the canonical `AssessmentResult` contract in PostgreSQL without collapsing it into a single JSON profile field.

The model must preserve:

- one canonical Person identity
- immutable historical assessment evidence
- instrument/item-bank/scoring/report versioning
- attempt lifecycle
- raw responses separated from derived scores
- longitudinal links
- report versions
- audit history
- institution/service/commercial context without allowing commercial entitlement to alter scores

This is a persistence model, not an authorization model. Access remains governed by the Secret Sharz authorization layer.

## 2. Database boundary

PostgreSQL stores assessment evidence and lifecycle state.

It does **not** become the source of truth for:

- Person identity
- Account authority
- Role assignment
- Relationship authorization
- Consent decisions
- Professional authority
- Safeguarding authority

The assessment persistence layer references canonical identifiers as opaque text values until the broader Person/Account/RDS identity migration establishes concrete foreign-key tables.

## 3. Tables

### 3.1 `assessment_results`

One durable record per assessment attempt.

Primary fields:

- `id` — UUID
- `person_id` — canonical PersonID, opaque text
- `account_id` — optional AccountID
- `institution_relationship_id` — optional relationship reference
- `service_engagement_id` — optional service reference
- `status` — created / started / submitted / scored / reported / abandoned / invalidated / superseded
- attempt timestamps
- completion percentage
- attempt number
- instrument/version references
- language/locale
- norm/algorithm/report version references
- evidence-quality JSON
- authorised context snapshot JSON
- longitudinal previous-result reference
- reassessment reason
- recommended retake date
- longitudinal sequence
- entitlement/order references
- created/updated timestamps

The result row contains metadata and lifecycle state, not the full response or report bodies.

### 3.2 `assessment_responses`

One row per item response.

Responses retain:

- item ID/version
- response value
- response type
- response timestamp
- response duration where collected
- presentation order

Raw responses become immutable after final submission.

Raw assessment responses are not exposed merely because a role can see the assessment result.

### 3.3 `assessment_scores`

One row per derived construct/subscale.

Stores:

- construct
- optional subscale
- raw score
- transformed score
- display score
- scoring version
- interpretation status
- normative-reference JSON

Historical score rows must not be rewritten when a future scoring version is released.

### 3.4 `assessment_reports`

One row per generated report version.

Stores:

- report ID
- assessment result ID
- report version
- report type
- audience
- generation timestamp
- source/result snapshot JSON
- content hash
- generation source

Regeneration creates a new report row rather than silently replacing the previous report.

### 3.5 `assessment_audit_events`

Append-only material audit history.

Stores:

- event ID
- result ID
- sequence
- action
- actor PersonID / AccountID where known
- purpose
- outcome
- event metadata
- occurred timestamp

The audit table is separate from the result row so audit history is independently queryable and can later be fed into a central platform audit pipeline.

## 4. Referential strategy

The assessment schema intentionally uses opaque text references for PersonID, AccountID, institution relationship and service engagement during the migration phase.

The schema may gain foreign keys later when the canonical platform tables are established in PostgreSQL. Until then, application-level existence and authorization checks are mandatory.

The longitudinal `previous_result_id` is a database foreign key because both records live in this assessment domain.

## 5. Immutability model

The application must treat these as immutable after submission:

- raw responses
- final scores
- historical reports
- historical audit events

Lifecycle metadata may still transition according to the canonical state machine.

The first migration includes database triggers that reject response/score mutation once the parent result reaches `submitted`, `scored`, `reported`, `invalidated` or `superseded`.

Historical correction is performed by creating a new result/versioned record, not editing the historical evidence.

## 6. JSON boundaries

JSONB is appropriate for values whose internal shape belongs to the application contract:

- evidence quality
- context snapshot
- normative reference
- report source snapshot
- audit metadata

Core identity, lifecycle, versioning and longitudinal fields remain relational so they can be indexed and queried predictably.

## 7. Indexing

Initial indexes should support:

- latest results for a Person
- results by instrument and version
- results by service engagement
- results by institution relationship
- result status and submission/scoring dates
- previous-result chains
- report lookup by result/audience
- audit lookup by result and time

No index should make raw response values directly discoverable through ordinary role queries.

## 8. Deletion and retention

Physical deletion is not part of the assessment-result write path.

Retention/restriction policy will be implemented by the platform governance layer. When evidence must remain for audit or contractual reasons, the platform may archive or restrict access rather than silently destroying the historical record.

## 9. Security boundary

The PostgreSQL repository must never accept `personId`, institution ID or role assertions as proof of access.

The calling service must first resolve:

**identity → account → role → relationship → data domain → purpose → consent/safeguarding → entitlement/time status**

The persistence layer then receives an already-authorized command/query context.

## 10. Migration strategy

Phase 1:
- create PostgreSQL assessment tables
- write new canonical results to PostgreSQL
- keep legacy Firebase assessment data read-only for migration compatibility
- retain the existing legacy resolver as a compatibility path

Phase 2:
- backfill eligible historical assessment records into canonical result form
- preserve original source/version metadata
- mark migrated records with migration metadata
- reconcile counts and hashes

Phase 3:
- move dashboard/report reads to the canonical assessment service
- remove direct Firebase assessment writes

Phase 4:
- retire legacy assessment storage after governance, retention and reconciliation sign-off

## 11. Approved implementation choice

The PostgreSQL implementation standard is:

- Node.js PostgreSQL client: `pg`
- Migration format: explicit versioned SQL files under `infra/postgres/migrations/`
- Migration runner: `scripts/run-postgres-migrations.mjs`
- Application persistence boundary: `src/platform/assessmentResultPostgresRepository.js`
- Runtime connection boundary: `src/platform/postgres.js`

The application uses parameterized SQL and transactions for assessment persistence. Authorization remains outside the repository boundary.

## 12. Current migration status

The first assessment persistence migration and repository have been added to the rebuild branch. Legacy Firebase assessment storage remains read-only and is not silently overwritten by this migration.

The next deployment step is to provision/configure the target RDS connection, run `npm run db:migrate`, and then wire an authorized server service to the repository. A public assessment API is intentionally not exposed until the canonical authentication/authorization boundary is ready.

## 13. Production gate

Before the assessment service is considered production-ready:

- authorization is enforced before repository access
- PersonID is canonical
- response/score/report history is immutable
- assessment versions are reproducible
- audit events are append-only
- raw responses are not exposed to ordinary institution roles
- report audiences are enforced by the authorization layer
- migration reconciliation is tested
- PostgreSQL backups/restore are verified in the target RDS environment
