# Secret Sharz — Backend Audit 2026-08

## Scope

This audit checks the backend against `SECRET_SHARZ_MASTER_PLATFORM_BLUEPRINT.md`, the existing security audit records, Firestore rules, server API patterns, canonical platform services, specialist-domain APIs, and the repository CI/test configuration.

The Blueprint is the architecture authority; existing code is implementation evidence. The Blueprint requires server-side authorization, separate sensitive domains, relationship-aware access, granular service consent, safeguarding, auditability, and shared platform services.

## Executive verdict

**Backend foundation: substantial and real. Production readiness: not yet approved.**

The repository has a strong Firebase/Auth/Firestore/server-API foundation, default-deny Firestore rules, canonical student/profile adapters, professional relationship controls, counselling consent enforcement, institution isolation, and automated security/integration test infrastructure.

The main remaining risk is architectural fragmentation: several services still implement overlapping identity, relationship, authorization, sharing, and legacy-data logic independently. Sensitive workflows therefore require alignment before broad expansion.

## Verified strengths

- Firebase ID tokens are verified server-side for sensitive API operations.
- Firestore uses a default-deny catch-all and denies direct client access to counselling, SEN, career, safeguarding, and audit domains.
- Counselling session access uses professional relationship authorization plus counselling consent.
- SEN professional access uses canonical relationship precedence and blocks resurrection from stale legacy assignments when a canonical relationship has ended.
- Parent career visibility uses an explicit `sharedInformation` projection and parent audience/status checks.
- Institution reporting is deliberately aggregate and excludes individual IEP/counselling records.
- Professional identity is derived server-side for clinical/SEN writes.
- The repository has server, Auth/Firestore integration, and Firestore rules test suites, plus a CI workflow that runs them on pull requests and pushes to `main`.

## Critical / high findings

### BE-001 — Minor/guardian architecture incomplete
The approved architecture requires supervised minor accounts and an explicit adult-autonomy transition at 18. The backend is not yet the single canonical implementation of this lifecycle.

**Priority:** P0

### BE-002 — Sensitive-domain authorization is fragmented
Career, counselling, SEN, parent, institution, and legacy paths use related but different authorization helpers and fallback rules. This creates policy drift risk.

**Priority:** P0

### BE-003 — Legacy privileged-role fallbacks remain
Firestore rules still permit profile-role fallback and a verified founder-email bootstrap path. The security audit records this as migration-only and says it must be removed after claims migration.

**Priority:** P1

### BE-004 — App Check enforcement is incomplete
The security foundation documents App Check as not yet enforced for the appropriate Firebase services.

**Priority:** P1

### BE-005 — AI gateway previously had unauthenticated wildcard-CORS access
`pages/api/chat.js` was an unauthenticated Anthropic proxy. This audit branch now requires a verified Firebase ID token, removes wildcard CORS, validates message size/shape, adds a timeout, and avoids returning upstream provider error details.

**Priority:** P0/P1

**Remaining:** distributed rate limiting, AI-specific consent/purpose enforcement, sensitive-domain isolation, and App Check where appropriate.

### BE-006 — SEN professional → Parent data contract was inconsistent
The SEN writer stored IEP records in `sen/{studentId}/iep_records` with `createdAt`, while the Parent Overview previously queried `users/{studentId}/iep_records` ordered by `timestamp`. The audit branch now reads the canonical SEN collection and `createdAt` field and supports simultaneous Career + SEN parent-visible projections.

**Priority:** P0

### BE-007 — SEN IEP versioning was not concurrency-safe
Version was derived from active-record count and previous records were not retired. The audit branch now creates the record and supersedes prior active IEPs inside a Firestore transaction and records an audit event after successful creation.

**Priority:** P1

### BE-008 — Broad legacy `users`/`students` documents remain compatibility surfaces
The Blueprint requires sensitive domain data to remain separated because Firestore document reads do not provide field-level hiding. Legacy documents are still used by multiple backend paths and therefore remain a migration risk.

**Priority:** P0/P1

### BE-009 — Founder/profile authorization bypass patterns require migration closure
The repository security audit records founder-email and `users.role` fallbacks as migration mechanisms. The professional student authorization helper has been hardened on this branch to use the verified `super_admin` claim (with the documented founder bootstrap), rather than trusting the target user's profile role.

**Priority:** P1

### BE-010 — Safeguarding break-glass workflow is not complete
The Blueprint requires authorised identity, mandatory reason, limited scope, temporary access, immutable audit, and post-event review. The backend does not yet demonstrate this complete workflow as one shared service.

**Priority:** P0

## Backend service coverage

| Capability | Backend state |
|---|---|
| Authentication | Strong foundation |
| Authorization | Implemented but fragmented |
| Profiles | Implemented, migration ongoing |
| Relationships | Partial/shared pieces |
| Consent | Implemented, not universal |
| Human Journey | Not yet a complete shared backend service |
| Scheduling | Partial |
| Messaging | Partial |
| Notifications | Partial |
| Files | Partial |
| Search | Partial |
| Knowledge | Partial |
| AI | Exists; security hardening underway |
| Trust & Safety | Partial |
| Safeguarding | Incomplete |
| Audit | Exists in pieces; needs platform-wide enforcement |
| Analytics | Exists in specialist areas |
| Reporting | Exists; institution aggregate path is strong |
| Payments | Partial |
| Opportunity engine | Partial/future |
| Accessibility engine | Not yet implemented as the documented shared engine |
| Localisation/translation/speech | Partial/future |

## Firestore rules assessment

The rules use a strong default-deny model and protect the dedicated sensitive domains from direct client reads/writes. However, privileged-role/profile fallbacks remain during migration, and the broad `students`/`users` documents remain compatibility surfaces. These are architectural migration items, not reasons to weaken the default-deny posture.

## Testing assessment

The repository defines:

- `npm run test:server`
- `npm run test:integration`
- `npm run test:rules`
- `npm test` as the combined suite

CI is configured to run the server tests, Auth/Firestore integration tests, Firestore rules tests, and a Next.js build on pull requests and pushes to `main`.

**This audit environment did not execute the repository's Node/Firebase test suite locally.** The current changes are therefore code-reviewed against the repository contracts but are not being represented as test-passing until CI or a local test environment confirms them.

## Changes made in audit branch

1. Hardened `/api/chat` with Firebase authentication, request validation, body-size limits, timeout handling, and safe upstream error responses.
2. Hardened professional student authorization so the privileged admin decision uses the verified `super_admin` claim plus the documented founder bootstrap rather than trusting a profile role.
3. Corrected Parent Overview SEN reads to the canonical SEN IEP collection and `createdAt` contract.
4. Changed Parent Overview to expose separate permitted Career and SEN projections when both services are active, while keeping counselling specialist details hidden.
5. Made SEN IEP version creation transactional, superseded prior active records, and added a clinical audit event.
6. Created this backend audit record.

## Next backend remediation order

1. Complete API inventory and classify every endpoint by auth, role, relationship, consent, domain, and data projection.
2. Complete minor/guardian supervised-account and adult-transition backend.
3. Consolidate professional authorization behind shared relationship/policy services.
4. Finish consent-before-profile and service-specific consent enforcement.
5. Implement safeguarding/break-glass as a dedicated restricted domain.
6. Complete privileged-claim migration and remove legacy role fallbacks.
7. Enforce App Check where required.
8. Migrate sensitive data out of broad legacy documents.
9. Add backend tests for every new authorization/data-sharing contract.
10. Run full CI and only then promote the remediation branch.

## Production gate

The backend should **not** be declared production-ready for the full Secret Sharz ecosystem until the P0 items above are closed and the complete automated test suite passes.
