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

- [x] Admin Student Master Control has a secure detail API path.
- [ ] Admin directory/list readers are fully canonical.
- [ ] Career directory uses service-authorized canonical profile data end-to-end.
- [ ] Psychology directory uses service-authorized canonical profile data end-to-end.
- [ ] SEN directory uses service-authorized canonical profile data end-to-end.
- [ ] Parent dashboard reads only linked-child data.
- [x] Institution dashboard obtains its student roster through an institution-authorized API.
- [ ] Student dashboard reads canonical profile end-to-end.
- [ ] Profile Editor writes canonical profile end-to-end.
- [ ] Assessment views use `assessments[]` as source of truth.
- [ ] No dashboard writes derived age or assessment scores as authoritative values.
- [ ] No new dashboard code reads legacy fields directly.

## Findings from the current implementation audit

### Admin

The secure student-detail architecture exists. The Admin detail path is therefore structurally ahead of the other dashboards, but the directory/list read path still requires verification before being marked complete.

### Professional caseload

`pages/api/professional/caseload.js` now normalizes display fields from `studentProfile` first and falls back to legacy fields for migration compatibility. The authorization boundary still depends on the existing `assignedStaff.*` relationship fields. Canonical relationship assignment is therefore **not yet verified end-to-end** and must not be marked complete until the relationship system is migrated.

### Parent

`src/ParentDashboard.jsx` currently subscribes directly to `users/{currentParentUid}` and derives the displayed child from that document. This is **not yet a valid linked-child read path**. The parent relationship system must supply authoritative child IDs/relationship records before the dashboard is migrated. Do not solve this by scanning arbitrary student records from the browser.

### Institution

`InstitutionDashboard.jsx` calls `/api/institution/dashboard`, and the API validates the institution coordinator custom-claim relationship before returning institution roster data. This is the correct architectural direction. The institution dashboard currently receives roster/assessment operational data rather than unrestricted student profile data, which is appropriate for the institution role.

### Student/Profile Editor

The live `ProfileEditor.jsx` still calls the legacy `updateUserProfile()` path. The canonical write API and write adapter exist, but the UI write migration is **not complete**. The Profile Editor must not be declared migrated until the actual live component uses the canonical API and waits for a successful server response before displaying a saved state.

## Safety note

A migration attempt against `ProfileEditor.jsx` was reverted before it could remain on `main` because a complete-file replacement would have risked dropping the component's existing render tree. The repository was restored to the pre-migration commit before continuing the audit. No claim of successful Profile Editor migration should be made until a surgical change is applied safely.

## Current status

The canonical model, normalizer, access architecture, onboarding structure and secure APIs are in place. The remaining work is **integration verification**, not another parallel data model. The next changes should be surgical and test-driven: migrate the live Profile Editor write path, then verify Student → Career → Psychology → SEN → Parent → Institution → Admin visibility with one controlled test student.
