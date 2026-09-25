# Secret Sharz — Canonical Assessment Result Record V1

**Status:** Draft platform contract — implementation-ready data model, persistence adapter pending
**Branch:** rebuild/platform-foundation-v1

## 1. Purpose
A career-assessment attempt is a durable, versioned evidence record. It is not merely a set of answers on a user profile.
It preserves identity, instrument/version, attempt lifecycle, responses, derived scores, evidence quality, report versions and longitudinal links.

## 2. Identity
The record references the canonical Secret Sharz Person/Account model and never creates a second student identity.
Required linkage: personId. Optional linkage: accountId, institutionRelationshipId, serviceEngagementId.

## 3. Lifecycle
created → started → submitted → scored → reported
Exceptional states: abandoned, invalidated, superseded.
Later attempts never overwrite earlier evidence.

## 4. Versioning
Every result records instrumentId, instrumentVersion, itemBankVersion, scoringVersion, reportVersion, language/locale and norm/algorithm versions where applicable.

## 5. Responses
Responses are immutable after final submission and retain item ID/version, response value/type, timestamp, duration where collected and presentation order where randomised.
Raw responses are not exposed to ordinary institution roles.

## 6. Scores
Derived scores are stored separately from raw responses.
Scores retain construct/subscale, raw value, transformed/display value, scoring version, interpretation status and normative reference where applicable.
Non-normed instruments must not fabricate percentiles or population ranks.

## 7. Evidence quality
Store completion, timing, missingness, response-pattern and scientifically supported validity indicators.
Quality flags are interpretation signals, not accusations of dishonest responding.

## 8. Context snapshot
Store the authorised context used for report interpretation, such as age/grade, subjects, stated goals, academic context and portfolio references.
Each context value should identify its source, such as student, institution, parent/guardian, professional or imported system evidence.

## 9. Reports
Reports are separately versioned records linked to the assessment result.
Each report stores reportId, assessmentResultId, reportVersion, reportType, audience, generation time, data snapshot, content hash and generation source.
Regenerating a report creates a new version.

## 10. Longitudinal history
Each attempt may reference a previous result, reassessment reason, recommended retake date and longitudinal sequence.
The chain is append-only.

## 11. Visibility
Result existence does not imply result visibility.
Audience permissions include student, parent/guardian, institution, teacher, counsellor/coach and administrator.
Institution access uses institution tenancy + role + relationship + purpose + assessment/service entitlement.

## 12. Commercial linkage
Optional entitlementId, serviceEngagementId and orderId may link the result to purchased or institution-funded services.
Commercial entitlement must never alter the underlying assessment score.

## 13. Audit
Audit material events including create, start, submit, score, report generation, access grant/revocation, annotation, regeneration, invalidation and archival.

## 14. Deletion and retention
Retention and deletion follow the applicable policy. Records requiring retention can be archived/restricted rather than physically deleted immediately.

## 15. Canonical shape
AssessmentResult → identity, attempt, instrument, responses[], scores[], evidenceQuality, contextSnapshot, reports[], longitudinal, entitlement, audit.

## 16. Production rules
- Historical scores are immutable.
- Historical reports are immutable.
- New scoring versions never silently rewrite historical scores.
- New report versions never silently overwrite historical reports.
- Every result remains reproducible from its instrument, item bank and scoring versions.