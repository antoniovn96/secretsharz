# Secret Sharz — Administrative Organisation & SuperAdmin Control Model

**Status:** Working Founder baseline — not a final HR policy
**Branch:** `rebuild/platform-foundation-v1`
**Purpose:** Define the initial human department structure and the SuperAdmin control-plane shape while preserving the canonical PRD/TRD/IS boundaries.

## 1. Operating principle

Secret Sharz has one platform and one canonical person identity, but it may have many human departments and many specialist service domains.

The administrative model must therefore distinguish:

```text
Person / Account / Role / Relationship / Consent / Authorisation
                    ↓
             Secret Sharz platform
                    ↓
        Human departments / workspaces
                    ↓
       Specialist product/data domains
```

A departmental assignment must never, by itself, create blanket access to another person's sensitive records.

The documented authorisation rule remains:

`Role + Relationship + Data Domain + Purpose + Consent + Safeguarding + Time/Status = Access decision`

## 2. Initial organisation

### Executive Leadership

Current people:
- Grace Noronha
- Antonio Vian Noronha

Initial responsibility:
- institutional direction
- Founder-level product decisions
- organisation-wide oversight
- SuperAdmin governance
- major policy/approval decisions
- departmental oversight

### Academic Leadership

Planned department.

Initial responsibility:
- courses
- learning ecosystem
- academic programmes
- SEN department oversight
- academic standards
- future academic staff management

The final academic job titles and delegated authority remain open.

### Human Resources Department

Initial responsibility includes:

- employee hiring
- employee offboarding/firing
- immediate access revocation
- employee/student/parent directory management where HR is authorised
- work/task management
- HRMS
- payroll coordination
- departmental restructuring
- multi-role staff assignment
- support tickets
- mandatory professional/legal/licensing verification
- employee compliance checklists
- full-time / part-time workforce management
- employee session/work tracking
- employment records
- employee lifecycle

HR works with Accounts, Intake/Operations, Admin and relevant departmental leads.

### Accounts Department

Initial responsibility includes:

- fees
- admissions/fee administration
- approved offers/discounts
- online and offline payment administration
- financial records
- inventory
- certificates
- ID-card issuance
- employee financial records where authorised
- financial reporting
- payment/reconciliation workflows

HR and Accounts are jointly responsible for employee e-ID card issuance, with the exact approval/revocation workflow to be defined.

### Media & Communications Department

Initial responsibility includes:

- Secret Sharz social media
- brand communications
- information gathering for approved public content
- marketing integrations
- sales/marketing support
- public communications
- customer communications
- campaign/content workflow
- media asset coordination

Media access must distinguish public content from restricted personal/professional information.

### Intake & Operations

The source requirements refer to an Intake team working with HR and Accounts. This department is therefore preserved as a **working department**, pending Founder confirmation.

Potential responsibility:
- admissions/intake
- initial enquiries
- service intake
- appointment/request routing
- document collection
- handoff to specialist departments
- operational task tracking

Exact scope is intentionally not closed yet.

## 3. Specialist service departments

### Counselling / Psychology

Professional categories currently specified by the Founder:

- Clinical Psychologists — RCI-licensed
- Counsellors — counselling qualification/study as defined by Secret Sharz governance
- Doctors — MBBS

The platform must distinguish professional qualification/verification from platform role and from specialist case access.

Planned operational capabilities:
- intake
- assignment/caseload
- appointment/scheduling
- sessions
- professional records
- care/support planning
- referrals
- safeguarding workflows
- supervision
- reporting
- fees/earnings where applicable
- professional verification

### Career Guidance / VidyaVantage

VidyaVantage is a Secret Sharz product experience, not a separate company/platform.

Public experience:

`secretsharz.com/vidyavantage`

Career department responsibilities may include:
- career intake
- assessment
- career counselling
- case management
- career plans/roadmaps
- course/college discovery
- opportunities
- professional guidance
- reporting

### SEN Department

Current Founder requirement:
- B.Ed in Special Education **or**
- 5 years of experience

The final verification policy remains subject to professional/governance review.

Planned capabilities:
- SEN intake
- assessment/referral
- support planning / IEP
- accommodations
- interventions
- parent collaboration
- teacher collaboration
- professional collaboration
- progress tracking
- transition planning

## 4. Additional platform-aligned departments that the documentation indicates will eventually be required

These are derived from the Master Platform Blueprint and TRD/IS set as organisational needs, not yet Founder-approved employee departments.

### Knowledge & Learning
- courses
- learning resources
- professional knowledge
- content/knowledge governance

### Community & Safeguarding
- community operations
- moderation
- safeguarding
- trust & safety
- restricted incident workflows

### Professional Verification & Quality
- professional onboarding
- credential verification
- registration verification
- experience/background checks
- scope review
- activation/renewal

### Partnerships & Institutions
- schools
- colleges
- universities
- NGOs
- employers
- programmes
- partnerships
- institutional relationships
- aggregate reporting

### Research
- study operations
- participation
- consent
- ethics
- research datasets
- anonymisation/de-identification
- publication/knowledge workflows

### Opportunities
- jobs
- internships
- projects
- volunteering
- mentorship
- employer workflows

### Technology / Platform / Security
- application platform
- AWS infrastructure
- integrations
- identity/authentication
- authorisation
- observability
- security
- data migration
- technical operations

This may initially be performed by the Founder/engineering function rather than a separate employee department.

## 5. SuperAdmin Dashboard

The SuperAdmin Dashboard is the organisational control plane.

At the beginning, the Founder must be able to reach all department workspaces from one dashboard.

The SuperAdmin shell should therefore provide:

1. Executive Overview
2. People
3. Accounts & Identity
4. Departments
5. Roles & Permissions
6. HR
7. Intake & Operations
8. Accounts & Finance
9. Counselling / Psychology
10. Career / VidyaVantage
11. SEN / Academic
12. Knowledge / Learning
13. Media & Communications
14. Community / Safeguarding
15. Professionals / Verification
16. Institutions / Partnerships
17. Opportunities
18. Research
19. Support
20. Compliance
21. Audit
22. System / Integrations
23. Reports / Analytics
24. Settings

Not every module needs to be implemented as a separate dashboard immediately. The important requirement is that the SuperAdmin control plane has one consistent navigation and permission framework.

## 6. Founder-first operating mode

For the initial stage:

`Founder SuperAdmin → department access → specialist workspace`

The Founder should not need separate accounts for each department.

Instead, the platform should support controlled department/role context switching.

Example:

```text
Antonio
  ↓
SuperAdmin
  ├─ HR context
  ├─ Accounts context
  ├─ Intake context
  ├─ Counselling administration context
  ├─ Career administration context
  ├─ SEN / Academic context
  ├─ Media context
  └─ Platform/Security context
```

This must be **context switching**, not permission bypass.

The system must record:
- who the real actor is
- which administrative context was selected
- what action was performed
- which object/data was affected
- resulting allow/deny decision
- sensitivity/context where required

This aligns with the TRD-16 SuperAdmin/View-As and duty-separation architecture.

## 7. Future departmental staffing

When staff are hired:

```
Person
  ↓
Account
  ↓
Employment / Department Membership
  ↓
Department Role(s)
  ↓
Permission Context
  ↓
Allowed Domain Actions
```

An employee may hold multiple departmental roles.

Example:

`Accounts + HR`

must be represented as two explicit assignments rather than a single broad administrator role.

Removing an employment/department assignment must trigger immediate re-evaluation and revocation of affected access.

## 8. HR immediate-access-revocation requirement

HR requires an immediate access-revocation workflow for offboarding.

The workflow should eventually:

1. record the employee lifecycle change;
2. deactivate/revoke the relevant Secret Sharz employment roles;
3. invalidate affected sessions/tokens according to the authentication architecture;
4. remove department/context access;
5. preserve required audit evidence;
6. retain records required by policy/legal/operational retention;
7. prevent revoked department membership from silently continuing through cached permissions.

Authentication and Secret Sharz authorisation remain separate layers.

## 9. Employee assurance

The documentation already identifies employee assurance / verification and induction as governed implementation areas.

The administrative platform must therefore eventually support:
- identity verification
- qualification verification
- registration/licence verification
- experience verification
- background checks where applicable
- induction
- agreement/activation state
- expiry/renewal
- suspension/revocation
- audit evidence

The exact provider, taxonomy and jurisdiction-specific rules remain governed decisions where the source documents leave them open.

## 10. Compliance

The Founder has requested HR controls covering DPDA Act and HIPAA-related checklists.

The system should treat these as **compliance/control checklists and evidence workflows**, not as an engineering assertion that Secret Sharz is legally compliant merely because a checklist exists.

Legal/privacy/professional applicability and final wording remain subject to appropriate review.

## 11. Documents vs departments

Not every technical domain in the Master Blueprint becomes a human department.

For example:
- Identity
- Consent
- Authorisation
- Audit
- Notifications
- Files
- Search
- AI
- Analytics

are primarily shared platform capabilities.

Human departments consume those capabilities.

## 12. Open Founder decisions

The following remain open and must not be silently implemented:

- exact Academic Leadership authority
- exact Intake/Operations scope
- final compliance ownership
- whether Safeguarding is a separate department or a restricted function
- whether Professional Verification is an independent department or HR/Quality function
- exact Accounts approval hierarchy
- exact employee multi-role approval workflow
- exact departmental reporting structure
- final job titles and reporting lines
- final country-specific professional verification rules
- exact legal/compliance applicability and wording

