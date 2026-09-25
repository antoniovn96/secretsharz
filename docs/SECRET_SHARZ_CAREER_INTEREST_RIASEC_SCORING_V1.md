# Secret Sharz — Career Interest Explorer (RIASEC) Scoring Specification V1

**Status:** Draft scoring specification — NOT psychometrically validated
**Branch:** rebuild/platform-foundation-v1

## 1. Scope
The original 60-item Secret Sharz Career Interest Explorer draft contains 10 items each for Realistic, Investigative, Artistic, Social, Enterprising and Conventional.
This document defines response capture, raw scoring, subscale scoring, profile presentation, provisional response-quality checks, top-interest identification and longitudinal comparison inputs.
It does not establish final normative cut-offs, percentiles or validated career-fit thresholds.

## 2. Response scale
1 = Would really dislike doing this
2 = Would probably not enjoy this
3 = Not sure / might enjoy this
4 = Would probably enjoy this
5 = Would really enjoy this

Responses are stored as integers 1–5 plus the scale version.

## 3. Raw scoring
For each RIASEC dimension: raw_score = sum of the ten item responses assigned to that dimension.
Range: 10–50 per dimension for a complete scale.

## 4. Mean score
mean_score = raw_score / number_of_answered_items_in_dimension
Production scoring should use the validated completeness policy; mean scoring is useful for pilot analysis.

## 5. Display index
For UI development only: display_index = ((mean_score - 1) / 4) × 100.
This is a display transformation, not a percentile or population rank.

## 6. Pilot completeness rule
Provisional software rule:
- 60/60 answered: full profile
- 54–59 answered: profile may be shown with an incomplete-data warning
- below 54 answered: request completion before generating a profile

These are product-data rules, not validated psychometric missing-data rules.

## 7. Response-quality signals
Store completion percentage, total response time, median item response time, unusually-fast-completion flag, unanswered items and repeated-pattern indicators.
Quality flags are evidence-quality signals, not accusations that a student answered dishonestly.

## 8. Top-interest profile
Rank all six dimensions from highest to lowest, preserve all six scores, identify the top two, and calculate the score spread.
Do not use unvalidated fixed thresholds such as an arbitrary 'high interest' cut-off.

## 9. Provisional three-letter code
The system may create a three-letter exploration code from the three highest dimensions, for example S-A-E.
The code is an exploration summary, not a diagnosis or permanent identity.
If the top scores are closely clustered, report a broad or balanced profile rather than forcing a dominant type.

## 10. Context boundaries
RIASEC measures activity-interest preferences only. It must not infer academic ability, intelligence, personality, resilience, mental health, family circumstances, financial circumstances or career readiness.
Those domains enter the integrated career profile only when separately assessed and authorised.

## 11. Longitudinal storage
Each attempt stores assessment version, item-bank version, scoring version, completion timestamp, six raw scores, six means, quality indicators, exploration code and report version.
Later attempts never overwrite earlier results.

## 12. Retake recommendation
Default starting point:
- Interest: 6–12 months
- Aptitude: about 12 months
- Work Values: 6–12 months
- Work Style: about 12 months
- Career readiness/decision modules: about 6 months

Production intervals must remain configurable and be reviewed against test-retest evidence.

## 13. Production gate
Before production, pilot all items; inspect item distributions, missingness and response times; estimate subscale reliability; examine item discrimination and domain structure as appropriate; review subgroup behaviour where sample size permits; validate the scoring and interpretation model; and complete accessibility/report QA.

O*NET's mature 60-item Short Form is a useful benchmark for the level of psychometric evidence expected, but Secret Sharz must establish its own evidence for its own items. citeturn817650search24