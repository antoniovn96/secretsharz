# Secret Sharz — Career Assessment Item Schema V1

## 1. Purpose

Every assessment item must be stored as structured data so that the same item bank can power web, mobile, reports, analytics and future adaptive forms.

## 2. Required item fields

- item_id
- instrument_id
- instrument_version
- item_version
- construct
- subscale
- target_age_band
- target_grade_band
- locale
- language
- item_type
- prompt
- response_scale_id
- keyed_dimension
- scoring_direction
- score_weight
- reverse_scored
- difficulty_target
- readability_target
- estimated_time_seconds
- content_domain
- accessibility_notes
- bias_review_status
- content_review_status
- licensing_status
- author
- reviewer
- review_date
- validation_status
- active_from
- active_until
- retirement_reason

## 3. Response-quality fields

Items may optionally carry:
- attention_check flag;
- minimum response-time warning threshold;
- duplicate/similar-item group;
- straight-line detection group;
- inconsistent-response group.

These must never be used to punish a student. They are evidence-quality signals.

## 4. Scoring rules

Scoring must be defined outside the question text.

An item may contribute to:
- one subscale;
- multiple scored dimensions only where the validated scoring model explicitly permits it;
- an unscored quality indicator.

Raw response and derived score must remain separate.

## 5. Content rules

Draft items should:
- describe an activity, preference or scenario;
- avoid naming a career when the construct is interest;
- avoid requiring specialised knowledge unless knowledge is the construct;
- avoid socioeconomic assumptions;
- avoid gender stereotypes;
- avoid culturally specific assumptions where the instrument is intended to be international;
- avoid double-barrelled statements;
- use age-appropriate language;
- avoid diagnostic wording.

## 6. Change control

Changing an item substantially creates a new item version.

Changing:
- item wording;
- scoring;
- response scale;
- translation;
- construct assignment

must trigger the required review process.

Historical results remain linked to the original item/scoring versions.

## 7. Localization

Translations are separate item versions/locales and require review.

A translated item must not be treated as psychometrically equivalent automatically.

## 8. Example

item_id: RIASEC-R-001
instrument_id: CAREER-INTEREST-RIASEC
construct: Vocational Interest
subscale: Realistic
item_type: LikertEnjoyment
target_age_band: 12-18
prompt: "I would enjoy building or assembling something using tools."
response_scale_id: INTEREST-5
keyed_dimension: R
reverse_scored: false
