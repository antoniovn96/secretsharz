# Secret Sharz — RIASEC V1 PostgreSQL Migration Slice

**Status:** Implemented migration slice  
**Branch:** `rebuild/platform-foundation-v1`

## Current flow

Browser answer set
→ Firebase ID-token authentication (temporary migration bridge)
→ `/api/career/assessment/riasec-v1`
→ server-side RIASEC scoring
→ canonical `AssessmentResult`
→ PostgreSQL transaction
→ structured student report payload

The browser does not submit authoritative scores. The server recomputes the score from the submitted item responses.

## Read flow

Signed-in student
→ authenticated API request
→ self-only assessment authorization context
→ PostgreSQL latest-result query
→ canonical result summary

Raw responses are not returned by the latest-result API.

## Migration boundary

Firebase remains the temporary authentication bridge and legacy assessment source.

PostgreSQL is now the write target for the new RIASEC V1 assessment flow.

Legacy `profile.careerAssessment`, `profile.assessments`, and related Firebase records are not automatically rewritten by this slice.

## Production blockers

- target RDS instance and connection secret must be provisioned
- migration command must be executed against non-production first
- CI must run the new assessment tests
- end-to-end authenticated submission must be exercised against non-production
- Cognito/application authorization migration must eventually replace the Firebase bridge
- historical Firebase assessment backfill requires source-level reconciliation before any write

## Security rule

No endpoint may accept client-provided score values, Holland codes, career matches, maturity values or recommendations as authoritative assessment output.

Only item responses are submitted. Scoring and report payload generation happen server-side.
