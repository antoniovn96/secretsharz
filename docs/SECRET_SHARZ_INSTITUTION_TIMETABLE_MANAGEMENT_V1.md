# Secret Sharz — Institution Timetable Management Software V1

**Status:** Founder-approved product direction — implementation specification pending detailed UI/API design  
**Branch:** rebuild/platform-foundation-v1  
**Purpose:** Define the free institution timetable-management product that will be part of Secret Sharz.

## 1. Product principle

The Institution Timetable Manager is a standalone institution-facing capability inside the Secret Sharz platform.

It must be:
- free for the institution's core timetable-management use;
- cloud-based;
- role-based;
- easy for administrators and teachers to use;
- capable of automatic timetable generation;
- explainable when constraints cannot all be satisfied;
- versioned and auditable;
- multi-institution and internationally configurable.

The timetable product must not require an institution to purchase counselling, career, SEN or other Secret Sharz services.

## 2. Institution setup

An institution administrator creates/configures:

- academic year
- term/semester
- working days
- school days/holidays
- periods
- break periods
- grades/year groups
- classes/sections
- subjects
- teachers
- rooms
- labs
- shared resources
- subject-period requirements
- teacher availability
- class availability
- room capacity
- room capabilities
- fixed events
- institutional rules
- scheduling preferences

The system must support multiple campuses and locations under one institution where applicable.

## 3. Scheduling model

The scheduling engine separates:

### Hard constraints
These cannot be violated.

Examples:
- teacher cannot teach two classes at the same time;
- class cannot have two subjects at the same time;
- room cannot be double-booked;
- a teacher unavailable during a period cannot be scheduled then;
- room capacity cannot be exceeded;
- required subject-period count cannot be omitted;
- required fixed events cannot move;
- lab-only subjects require a suitable room.

### Soft constraints
These should be satisfied where possible.

Examples:
- avoid excessive consecutive periods;
- distribute subjects through the week;
- avoid placing certain subjects late in the day;
- preserve preferred teaching periods;
- balance teacher workload;
- preserve requested double periods;
- reduce unnecessary room changes;
- avoid repeated same-subject patterns;
- distribute difficult subjects across the week.

Each soft constraint receives a configurable weight.

## 4. Automatic timetable generation

Workflow:

Institution setup
→ Validate data
→ Configure constraints
→ Generate candidates
→ Constraint validation
→ Optimisation
→ Explain trade-offs
→ Draft timetable
→ Human review
→ Approval
→ Publish

The generator must never silently publish a timetable that violates a hard constraint.

When a valid timetable cannot be produced, the system should show:

- blocked constraint;
- affected class/teacher/room;
- reason;
- recommended resolution options;
- affected timetable sections.

## 5. Teacher workload balancing

The system calculates:

- teaching periods;
- free periods;
- consecutive periods;
- daily load;
- weekly load;
- subject allocation;
- substitution allocation;
- room movement where relevant.

Administrators can configure workload targets and warning thresholds.

The system should distinguish:
- contractual/workload requirement;
- preferred workload;
- temporary substitution load.

## 6. Substitution management

When a teacher is absent:

Teacher absent
→ identify affected periods
→ evaluate available teachers
→ check subject/grade suitability
→ check workload and conflicts
→ rank eligible substitutes
→ assign substitute
→ notify relevant users
→ record substitution

The system must not assign a substitute who creates a hard conflict.

Administrators may manually override a recommendation with an audit reason.

## 7. Examination timetable

The same institution timetable database should support examinations.

Capabilities:
- exam schedule;
- class/group allocation;
- room allocation;
- capacity checks;
- student seating;
- invigilator assignment;
- clash detection;
- special accommodation;
- exam-day versioning;
- publication.

Exam scheduling must be isolated from ordinary teaching schedules while sharing authoritative institution data.

## 8. Room and resource management

Resources may include:
- classrooms;
- laboratories;
- computer labs;
- auditoriums;
- libraries;
- sports facilities;
- specialist rooms;
- devices/equipment.

Each resource has:
- capacity;
- capabilities;
- availability;
- location;
- restrictions;
- booking rules.

The scheduler and manual booking system must use the same availability data.

## 9. Attendance and class register linkage

Published timetables can feed:
- teacher attendance/class register;
- student attendance;
- lesson topic/coverage;
- substitution records;
- class history.

A teacher should see the classes assigned to them for the current day without needing to search manually.

## 10. Role-based access

### Institution Administrator
Full institution timetable configuration and publication authority.

### Timetable Administrator
Schedule generation, validation, drafting and operational changes.

### Academic Leadership
Review, approval and high-level workload/schedule visibility.

### Department/Grade Coordinator
Relevant grade/department timetable management.

### Teacher
Own timetable, assigned classes, substitutions, availability requests and relevant changes.

### Student
Own class/grade timetable.

### Parent/Guardian
Authorised child's published timetable and relevant changes.

### Institution support/operations staff
Only the operational scheduling functions explicitly assigned.

No role receives another department's data simply because it is inside the same institution.

## 11. Notifications

Supported events:
- timetable published;
- timetable changed;
- class moved;
- room changed;
- teacher replaced;
- substitute requested;
- exam published;
- exam room/seating changed.

Delivery:
- in-app;
- email;
- push;
- SMS where the institution has enabled a supported provider.

Notifications are generated from the authoritative event and are not manually edited into conflicting states.

## 12. Integrations

Initial integration interfaces:
- CSV import/export;
- calendar export;
- REST API.

Planned connectors:
- Google Calendar;
- Microsoft 365/Outlook;
- SIS;
- LMS.

Institution must explicitly authorise each connector and data scope.

## 13. Timetable versioning

Every schedule follows:

Draft
→ Review
→ Approved
→ Published
→ Superseded
→ Archived

Published versions are immutable.

A modification creates a new version.

The system records:
- version;
- creator;
- approver;
- publication time;
- reason for change;
- affected classes/teachers/rooms;
- notification state.

## 14. Free product boundaries

Core free features:
- institution setup;
- timetable generation;
- conflict detection;
- teacher workload view;
- substitution management;
- exam timetable and seating;
- room/resource booking;
- attendance/register linkage;
- teacher/student/parent timetable views;
- CSV import/export;
- published timetable versions.

Potential future paid services remain separate:
- advanced institutional analytics;
- managed implementation;
- premium integrations;
- additional storage;
- dedicated support/SLA;
- custom enterprise workflows.

Paid services must not remove the core timetable-generation capability from the free product.

## 15. Internationalisation

The timetable engine must support:
- country;
- region/timezone;
- local week structure;
- academic calendar;
- local holidays;
- language;
- date/time formats;
- institution-specific terminology;
- local education structures.

The core scheduling engine remains jurisdiction-agnostic.

## 16. Data protection

The timetable system may contain child/student information. Access therefore remains subject to Secret Sharz's global minor-protection and institution-authorisation architecture.

The module must avoid unnecessary collection of student information.

Student timetable visibility should be based on:
- institution relationship;
- student membership;
- authorised guardian relationship;
- jurisdiction;
- consent/authority where required.

## 17. Multi-institution model

One Secret Sharz platform can host many institutions.

Each institution has:
- Institution ID;
- institution membership boundary;
- its own academic calendars;
- its own staff/classes/resources;
- independent timetable versions;
- independent permissions.

Institution A must never receive Institution B data through normal timetable APIs.

## 18. Future optimisation engine

The scheduling engine should be implemented behind a stable service boundary so that optimisation algorithms can evolve.

Possible implementation approaches include constraint programming, mixed-integer optimisation, heuristic search or hybrid methods.

The product contract is the constraint model and outcome, not a fixed algorithm.

## 19. Audit requirements

Audit material actions:
- create/update/delete timetable data;
- create generation run;
- publish/unpublish;
- approve timetable;
- manually override a conflict;
- substitute assignment;
- room allocation changes;
- exam seating changes;
- integration authorisation.

Audit records must identify actor, institution, action, object, timestamp and outcome.

## 20. Founder-approved product direction

The Institution Timetable Management Software is:
- free at its core;
- integrated into Secret Sharz;
- available to institutions internationally;
- role-based;
- automatic and constraint-driven;
- connected to substitution, exams, rooms, attendance and notifications;
- suitable for later SIS/LMS/calendar integration.


## 21. Founder decisions — institutional pricing, premium timetable tier and family resources — 25 September 2026

### Institutional commercial model
The Institution Timetable Manager remains a core capability within the institution ecosystem, but the **institutional dashboard itself is a paid service**.

Commercial logic:
- pricing is based on institution student count;
- the Founder has set a premium-entitlement threshold of **₹75,000**;
- once the institution crosses that threshold under the final billing calculation, premium timetable capabilities become included at no additional premium charge;
- the exact billing period/threshold calculation is still open.

The product must therefore separate:
1. institutional subscription entitlement;
2. core timetable capability;
3. premium timetable entitlement.

### Premium timetable capabilities
Premium entitlement includes:
- download timetable;
- structured export;
- school/institution logo and branding;
- enhanced printing/publication features;
- future premium timetable capabilities added through the entitlement registry.

Premium entitlement must not remove the core scheduler, conflict detection or ordinary viewing capabilities.

### Institution onboarding
Institution onboarding:
Institution application
→ institution verification
→ Institution Administrator creation
→ institution setup
→ subscription activation
→ timetable configuration
→ publish/use.

### Timetable publication
Institution Administrators control what is published to teachers, students and parents/guardians.

Published user experiences include:
- personal student timetable;
- class timetable;
- exam timetable;
- room/resource changes;
- substitution information;
- daily schedule.

### Import and migration
The timetable product must include:
- Excel/CSV import;
- existing timetable ingestion;
- conflict detection against imported timetables;
- structured conversion;
- optimisation/re-generation after conversion.

### Parent/child commercial content
The family dashboard may offer paid:
- parenting guides;
- parenting books;
- positive parenting resources;
- age/stage activity packs;
- child educational resources;
- family routine planners;
- child timetable/routine tools;
- other optional child-focused resources.

Purchasing any resource does not grant additional access to a child's private service records.

### External book purchasing
Secret Sharz may recommend third-party parenting books and send the user to an external retailer such as Amazon for purchase.

Recommendations should be based on:
- explicit parent-selected interests;
- general non-sensitive family/age-stage preferences;
- editorial curation.

Recommendations must not silently derive from confidential counselling, SEN, safeguarding, professional or other sensitive records.

## 22. Recommended commercial/product direction

The institution product should be structured as:
- **Institution Dashboard subscription** — paid, student-count based.
- **Core timetable engine** — included in the institutional service.
- **Premium timetable tier** — automatically included once the ₹75,000 Founder-defined commercial threshold is crossed under the final billing rule.
- **Parent/family resources** — separately purchased by parents/guardians.
- **Third-party book recommendations** — external retailer purchase.

The entitlement engine should be configurable so the commercial rules can later change without rewriting the timetable engine.


## 23. Founder decisions and proposed timetable pricing — 25 September 2026

### Institution dashboard
The institution dashboard is a paid institutional service.

Institution subscription → Institution Dashboard → institution services

The institution must have an active subscription before its institution-hosted timetable is available through Secret Sharz.

### Progressive India pricing
Recommended India price book, before applicable taxes:

| Student band | Marginal annual price per student |
| --- | ---: |
| 1–250 | ₹150 |
| 251–500 | ₹125 |
| 501–1,000 | ₹100 |
| 1,001–2,000 | ₹80 |
| 2,001–5,000 | ₹60 |
| 5,001+ | Custom |

At 563 active students, the annual value crosses ₹75,000.

The product should display a live billing calculation so the institution administrator can see:
- active students counted;
- current annual value;
- amount to premium threshold;
- premium status;
- next band impact.

### Premium entitlement
Once annual subscription value exceeds ₹75,000, premium timetable capabilities are automatically included:
- timetable download;
- structured export;
- institution logo/branding;
- enhanced print/publication features;
- future premium timetable capabilities defined in the entitlement registry.

### Pricing mechanics
- Annual is the default billing term.
- Monthly payment may be offered using the annual entitlement calculation plus an explicit payment-plan premium.
- Student counts use the defined active-enrolment rule.
- Price books are versioned.
- Existing contracts retain their agreed price until renewal unless contract terms say otherwise.

### Trial
Verified institutions receive a 30-day trial recommendation.
The trial is isolated from other institutions and cannot bypass identity, verification or data-residency controls.

### Institution hierarchy
The timetable service supports:
Organisation → Institution → Campus → Department/Program → Grade/Year → Class/Section.

Shared resources across campuses require explicit configuration.

### Timetable user experience
Teachers, students and parents can receive published:
- personal timetable;
- class timetable;
- exam timetable;
- room/resource changes;
- substitution information;
- daily schedule.

The institution controls what is published.

### Import/migration
Core timetable onboarding includes:
- Excel/CSV import wizard;
- existing timetable ingestion;
- column mapping;
- validation;
- conflict detection;
- structured conversion;
- optimisation/re-generation.

### Timetable generation
The scheduler exposes:
- simple Generate Best Timetable mode;
- advanced configuration mode;
- hard constraints;
- soft constraints;
- weighted preferences;
- explanation of unsatisfied constraints.

AI may explain, suggest and compare timetable changes, but the authoritative scheduler remains constraint-validated and deterministic at the decision point.

### Free vs premium boundary
Core scheduling remains part of the institutional service. Premium entitlement does not unlock the scheduler itself; it unlocks additional operational/export/branding capabilities.

### Institution operating system
The Institution ecosystem is intended to grow beyond timetables into a broader institution operating system:

People → Admissions/Intake → Students → Parents → Staff → Classes → Timetable → Attendance → Exams → Learning → Counselling → SEN → Career → Fees → Communication → Documents → Requests → Governance → Reports.

Timetable Management is the first major institution product capability, not the entire institution platform.

### Configurable terminology
Institution terminology must be configurable so the same platform can use local structures such as:
- Grade / Class / Section;
- Year / Form / Stream;
- Program / Cohort / Group;
without changing the underlying canonical data model.

### Localised retailer links
Book/resource recommendations can map to territory-specific retailer links, such as Amazon.in, Amazon.co.uk or Amazon.com where available.
If a territory does not have an appropriate retailer link, the platform can use an author/publisher/official source link.

## 24. Founder decisions — timetable product scope, trial and institutional services — 25 September 2026

### Pricing review
The earlier proposed ₹150–₹60/student/year price book is considered too low for the intended Institution ecosystem because the product is no longer just a timetable utility. It is also the access layer for Secret Sharz institutional services and, where configured, career/counselling/SEN offerings.

Current public 2026 benchmarks show basic school ERP pricing commonly around ₹100–₹500 per student/year, while some published career-assessment products charge around ₹599–₹799 per student for an institution assessment, and school career-guidance packages can be materially higher when human counselling is included. These are market reference points, not a required Secret Sharz price. citeturn440291search0turn440291search10turn353191search1turn353191search3turn353191search4

### Proposed revised India platform price book
The revised recommendation is:

| Active student band | Marginal annual platform price per student |
| --- | ---: |
| 1–250 | ₹499 |
| 251–500 | ₹449 |
| 501–1,000 | ₹399 |
| 1,001–2,000 | ₹349 |
| 2,001–5,000 | ₹299 |
| 5,001+ | Custom enterprise pricing |

This is still progressive, so larger institutions receive lower marginal pricing.

This price book is proposed, not Founder-approved.

### Important commercial separation
The institutional platform subscription should pay for the digital platform and included institutional functionality.

Human professional services should not be silently unlimited under the platform fee.

The following should be represented as separate service entitlements/engagements:
- counselling sessions;
- career counselling/coaching sessions;
- SEN educator support;
- workshops;
- assessments with material third-party/licensing costs;
- other staff-delivered services.

The commercial engine should therefore support:
Institution Subscription + Service Entitlements

rather than pretending that all human professional work has zero marginal cost.

### Founder-defined ₹75,000 threshold
The ₹75,000 threshold remains a Founder commercial rule for premium timetable entitlement.

Because the revised platform price is higher, many institutions will cross this threshold. That is acceptable only if the premium tier is treated as a value bonus rather than a core product gate.

The exact premium economics should therefore be reviewed once the service/assessment inclusions are fully costed.

### 2-hour institution trial
The institution can receive a single-use timed trial code.

Workflow:
- Marketing or HR generates a trial code from the authorised backend;
- the code has a single-use state;
- before redemption it may have a validity/expiration window;
- when the institution enters the code and successfully enters the trial dashboard, the two-hour countdown starts;
- the timer continues against server time and does not depend on browser refresh;
- the code cannot be reused after activation;
- the backend records code generation, issuer, redemption time, expiry time, institution/prospect context and trial completion.

The trial exposes the complete institution dashboard for two hours.

### Institution onboarding
Recommended onboarding:
Institution applies → verification → trial code/activation → two-hour full-dashboard trial → subscription decision → institution activation.

### Institution administration
Support:
- Primary Institution Administrator;
- Additional Institution Administrators;
- Temporary/Delegated Institution Administrators;
- Campus Administrators.

Campus administrators see only their campus unless broader institutional authority is explicitly granted.

### Campus shared resources
Shared teachers, rooms, labs, buses, equipment or facilities can be shared across campuses only through explicit configuration and conflict validation.

### Student code
The institution may retain its local roll number, while Secret Sharz provides a structured institutional student code.

Default proposed pattern:
YY-DD-II-RRR

The final segment lengths are configurable by institution, but fixed-width segments are recommended for reliable parsing and display.

### Parent relationship
Parent/guardian access is not self-service by name search.

A parent must contact the institution or Secret Sharz Support and provide proof of relationship/authority. Once verified, the guardian relationship is created with the required scope and consent/authority.

### Institutional service access
Institutions can outsource relevant services to Secret Sharz, including:
- counselling;
- career guidance/coaching;
- SEN education/support.

Service ordering, assignment and reporting remain separate from timetable permissions and from the professionals' confidential underlying records.

### Institution scope boundary
The timetable product does not include:
- institutional finance;
- payroll;
- admissions;
- general emergency alerting.

It may include timetable-related announcements and notifications only.

## 25. Founder decisions — institutional services, reports and trial links — 25 September 2026

### Career assessment service
Career assessments are offered by grade/stage-specific entitlements.
The institutional dashboard receives the assessment report appropriate to the chosen assessment.
The principal/authorised institutional leader can access the authorised report.
Teachers do not automatically receive individual assessment reports.
An assigned Secret Sharz counsellor/coach may receive the access required for the service.
Student/parent access remains separately governed.

### Counselling service packages
Counselling is an institution-paid service separate from the base platform subscription.

The service catalogue supports:
- one-month programmes;
- three-month programmes;
- six-month programmes;
- one-year programmes;
- online delivery;
- offline delivery;
- defined session frequencies such as one session per month, three sessions per month and other configured frequencies.

Pricing is based on configured:
- hours;
- number of students;
- duration;
- frequency;
- topic/scope;
- delivery mode;
- assigned team/professional;
- other agreed service factors.

### Workshops and school programmes
The institution catalogue may include programmes such as:
- WHO 10 Life Skills;
- 21st Century Skills;
- teacher training.

Working Founder reference prices:
- full day: approximately ₹8,000 for about 100 students over 8 hours;
- half day: approximately ₹4,000.

These are working reference figures and not yet a universal fixed tariff.

### SEN support
Secret Sharz SEN educators/tutors may provide institutional support as a separate service entitlement.
Working service pattern:
- two days per week;
- approximately 9:00 a.m. to 4:00 p.m. school-day coverage;
- configured student coverage and staffing;
- configured commercial terms.

### Institutional service entitlement architecture
The platform separates:
- Institution Dashboard subscription;
- career assessment entitlement;
- counselling entitlement;
- SEN entitlement;
- workshop/training entitlement;
- other human service entitlements.

Each has its own:
- quantity;
- scope;
- duration;
- delivery mode;
- schedule;
- assigned provider/team;
- status;
- reporting requirements.

### Career guidance teacher accounts
Basic career guidance includes a maximum of two teacher accounts.
The account entitlement is separate from the institution's student count.

### Trial access
Marketing/HR can create an institution-specific, single-use trial link through the backend.
The two-hour trial begins when the recipient opens the authorised link and successfully enters the dashboard.
The timer is server-authoritative and cannot be restarted by refresh or reuse of the link.
