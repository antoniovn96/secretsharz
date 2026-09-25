# Secret Sharz — Career Assessment Build Plan V1

**Status:** Founder-approved build direction — assessment instruments remain draft until psychometric validation and, where applicable, licensing review  
**Branch:** rebuild/platform-foundation-v1

## 1. How we move forward

Do not immediately create hundreds of final questions.

Build the assessment system in layers:

1. Assessment architecture
2. Construct blueprints
3. Item bank
4. Scoring specification
5. Report interpretation rules
6. Pilot forms
7. Psychometric review/validation
8. Accessibility and language review
9. Production version
10. Longitudinal/reassessment integration

This keeps the platform from becoming a collection of unvalidated online quizzes.

## 2. Recommended build order

### Phase 1 — Foundation
Create the common assessment engine:
- instrument registry;
- construct/subscale model;
- item bank;
- item versioning;
- response model;
- scoring rules;
- scoring-version registry;
- validity/response-quality flags;
- assessment session;
- report generation inputs;
- consent/authorisation;
- longitudinal result storage;
- audit trail.

### Phase 2 — Core career discovery assessments
Build and pilot:
1. Career Interest Explorer — RIASEC
2. Career Aptitude Core
3. Work Values
4. Career Skills
5. Subject & Academic Alignment
6. Work Environment Preferences

### Phase 3 — Career decision/development assessments
Then build:
7. Career Decision Self-Efficacy
8. Career Adaptability
9. Career Readiness / Decision Maturity
10. Vocational Identity & Clarity
11. Career Exploration Knowledge
12. Motivation & Career Drivers

### Phase 4 — Advanced evidence
Then:
13. Work Style / Big Five
14. Situational Judgement
15. Entrepreneurial Orientation
16. Resilience / Persistence
17. Career Outcome Expectations
18. Career Barriers / Support Needs
19. Work Samples / Simulations
20. Portfolio / Experience
21. Career Goals / Preferences

## 3. Why RIASEC is first

RIASEC is a strong first module because:
- it is useful across multiple age bands;
- it provides a foundation for career exploration;
- it can be expressed through activities rather than occupation stereotypes;
- it can feed the broader career recommendation engine;
- it is comparatively easy to explain to students and parents.

The first version should be an original Secret Sharz instrument, not a copy of an existing instrument.

## 4. Item-development lifecycle

For every item:

Draft → content review → age/readability review → bias/accessibility review → pilot → item analysis → revision → validation → production

No item becomes a production item merely because it sounds good.

## 5. Assessment versioning

Every assessment must have:
- instrument ID;
- version;
- item-bank version;
- scoring version;
- normative/interpretation version where applicable;
- language;
- target age/grade;
- publication status;
- effective date;
- retirement date;
- validation status.

## 6. Pilot strategy

For the first pilot:
- use a diverse sample across target grades;
- collect response time;
- collect completion/abandonment;
- inspect item distributions;
- inspect missingness;
- inspect item discrimination and subscale reliability;
- inspect differential behaviour across relevant groups where sample size permits;
- review student/counsellor feedback.

Pilot results must be treated as evidence about the draft instrument, not as evidence that the instrument is already clinically or psychometrically validated.

## 7. Report generation

Reports are generated from structured evidence, not static templates.

The engine should preserve:
- source result;
- interpretation rule;
- report version;
- evidence references;
- audience;
- counsellor annotations.

## 8. Production gate

An assessment can move to production only after:
- item/content review;
- scoring verification;
- accessibility review;
- language review;
- privacy review;
- licensing review if third-party material is involved;
- pilot analysis;
- psychometric review appropriate to the instrument;
- report QA.

## 9. First implementation milestone

The first milestone is:

**Career Interest Explorer — RIASEC V0.1**

Deliverables:
- construct blueprint;
- 60-item original draft bank;
- scoring specification;
- response-quality rules;
- age-band presentation guidance;
- initial report interpretation map;
- pilot/validation checklist.


## 11. Milestone status — RIASEC vertical slice

Draft foundation completed:
- Career Assessment Build Plan
- Career Assessment Item Schema
- Career Interest Explorer RIASEC draft item bank
- RIASEC Scoring Specification
- RIASEC Personalised Report Logic

Next implementation step:
- assessment result data model;
- scoring service;
- RIASEC assessment UI;
- report-generation payload;
- test profiles;
- QA and pilot preparation.

Production validation remains a separate gate.

## 12. Implementation status — RIASEC V1

The first vertical-slice implementation is now isolated from the legacy/current career assessment code.

Added:
- src/career/riasecInterestExplorerV1.js
- src/career/riasecReportPayloadV1.js
- src/career/RiasecInterestExplorerV1.jsx
- test/career/riasecInterestExplorerV1.test.mjs

The current repository already contains an older VidyaVantage assessment implementation and scoring stack. The new RIASEC V1 must therefore remain versioned and isolated until the new assessment is reviewed, piloted and approved for replacement/integration.

The new V1 does not silently replace the existing 36-item RIASEC bank or existing scoring schema.

Next:
1. verify the new V1 implementation with repository CI/test tooling;
2. connect the structured result to the canonical assessment-result persistence model;
3. integrate the new assessment into the assessment library behind an explicit version/feature flag;
4. build test profiles for personalised-report QA;
5. pilot before production scoring claims.
