# Secret Sharz — RIASEC Personalised Report Logic V1

**Status:** Draft report specification — NOT production-validated
**Branch:** rebuild/platform-foundation-v1

## 1. Core principle
The report must be an evidence-backed interpretation of the individual student, not a template with the student's name and scores substituted.
Pipeline: Observed responses → Scores → Interpretation → Exploration → Next action.

## 2. Audiences
Student: readable, encouraging and action-oriented.
Parent/Guardian: plain-language support guidance.
Counsellor/Coach: detailed evidence, comparisons and annotations.
Institution: authorised reporting and aggregate views.

## 3. Required and optional inputs
Required: six RIASEC scores, assessment version, completion date and completeness status.
Optional authorised inputs: grade/age band, subject preferences, stated career goals, prior assessments, portfolio/experience evidence, academic context and counsellor annotations.
If context is unavailable, the report must not invent it.

## 4. Report structure
1. Career Interest Snapshot
2. What Stands Out
3. Your Interest Pattern
4. Where Your Interests Overlap
5. Where the Profile Is Mixed
6. Career Areas to Explore
7. What Else We Need to Know
8. Your Next Step
9. Longitudinal Career Journey

## 5. Content-atom personalisation
Report language is selected from evidence-linked content atoms.
Each content atom stores condition, construct, score relationship, age band, audience, approved text, action suggestions, evidence references and version.
The composer selects only atoms whose conditions are satisfied.
Personalisation comes from different evidence and relevant actions, not random wording changes.

## 6. RIASEC interpretation examples
R + I: practical activity and figuring out how things work may both be appealing.
I + A: curiosity and original creation may both be useful exploration themes.
S + E: people-oriented activity and initiative/leadership may both be prominent.
These examples are draft interpretation language and require review before production.

## 7. Career recommendations
RIASEC alone should produce career areas to explore, not a definitive ranked career list.
Each career-area card should contain: why it appeared, supporting interest signals, information still needed and a suggested exploration action.

## 8. Contradictions
A contradiction requires at least two distinct evidence sources, such as RIASEC plus stated career goal, subject preference or aptitude.
When evidence conflicts: name the conflict neutrally, explain both signals, suggest a way to investigate, and do not declare one signal wrong.

## 9. Confidence/data completeness
Show evidence completeness, recency and available domains.
Suggested labels: Limited evidence / Developing evidence / Strong evidence base.
This is not a probability that a career recommendation will be correct.

## 10. Longitudinal reporting
New assessment results create new report versions. Previous results remain accessible so the student can see what changed and what stayed consistent.

## 11. Counsellor annotation
Counsellor annotations are separate versioned records and cannot rewrite the historical automated result.

## 12. Report regeneration
Record report ID, student/person ID, assessment result ID, assessment version, scoring version, report version, data snapshot, audience, generated timestamp and annotations.

## 13. Quality testing
Test profiles must include clear top dimensions, balanced profiles, close top scores, missing data, changed goals, repeated assessments and conflicting evidence.
The composer must change relevant content, preserve score accuracy, surface missing evidence and avoid unsupported claims.

## 14. Core rule
A personalised report is not a different set of adjectives. It is a different evidence-backed explanation and action plan.