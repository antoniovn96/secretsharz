# Canonical Read Path Audit

## Purpose

Every dashboard must consume the canonical Student Profile through the authorized API/resolver. Legacy fields are migration inputs only.

## Canonical domains

- `studentProfile.identity`
- `studentProfile.contact`
- `studentProfile.family`
- `studentProfile.academic`
- `studentProfile.institution`
- `studentProfile.services`
- `studentProfile.career`
- `studentProfile.wellbeing`
- `studentProfile.sen`
- `studentProfile.assessments`
- `studentProfile.goals`
- `studentProfile.relationships`
- `studentProfile.governance`

## Read rules

| Dashboard / viewer | Required source | Forbidden direct legacy reads |
|---|---|---|
| Student | Authorized student profile response | `name`, `grade`, `schoolName`, `primary_path`, `riasecCode` as independent sources |
| Career Counsellor | Resolver-filtered Career profile | Direct raw Firebase student document |
| Psychologist | Resolver-filtered Wellbeing profile | Direct raw Firebase student document |
| SEN Educator | Resolver-filtered SEN profile | Direct raw Firebase student document |
| Parent | Parent-authorized profile response | Other student's raw record |
| Institution | Institution-authorized summary/profile | Family/private professional records |
| Admin | Secure administrative profile endpoint | Unfiltered browser-side Firebase reads |

## Canonical mapping

| Information | Canonical source | Derived? |
|---|---|---:|
| Full name | `identity.fullName` | No |
| Date of birth | `identity.dateOfBirth` | No |
| Age | calculated from DOB | Yes |
| Phone | `contact.mobile` | No |
| Parent/guardian relationship | `family.guardians[]` | No |
| Institution | `institution` / `academic.institutionName` | No |
| Grade | `academic.grade` | No |
| Section | `academic.section` | No |
| Stream | `academic.stream` | No |
| Services | `services` | No |
| Career profile | `career` | No |
| Assessment history | `assessments[]` | No |
| RIASEC result | assessment result | Yes |
| Professional assignment | `relationships.assignments` | No |
| Profile completion | `onboarding` | Yes |

## Migration rule

Legacy fields may be consumed only by `studentRecordNormalizer.js` and migration utilities. New dashboard code must not create new dependencies on legacy fields.

## Verification checklist

- [ ] Admin Student Master Control uses secure detail API for detail views.
- [ ] Career directory uses service-authorized profile data.
- [ ] Psychology directory uses service-authorized profile data.
- [ ] SEN directory uses service-authorized profile data.
- [ ] Parent dashboard reads only linked-child data.
- [ ] Institution dashboard reads only institution-authorized data.
- [ ] Student dashboard reads canonical profile.
- [ ] Assessment views use `assessments[]` as source of truth.
- [ ] No dashboard writes derived age or assessment scores as authoritative values.
- [ ] No new dashboard code reads legacy fields directly.

## Current status

This document is the audit baseline. The remaining unchecked items require inspection and migration of the corresponding dashboard/API implementations; they must not be marked complete merely because the canonical resolver exists.
