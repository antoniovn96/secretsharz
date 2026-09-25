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
- Recommended structure: Community & Trust & Safety is the wider operational area, with Safeguarding as a restricted function/team inside it. Safeguarding keeps its own permissions, restricted records, purpose-bound access and break-glass controls; it is not equivalent to ordinary Community administration.
- whether Safeguarding is a separate department or a restricted function
- Recommended structure recorded: Safeguarding = restricted function/team within Community & Trust & Safety, not a blanket-access department.
- whether Professional Verification is an independent department or HR/Quality function
- Founder decision: Professional Verification is jointly owned by HR and a dedicated Professional Quality/Verification function. Required verification must pass both sides before governed activation.
- exact Accounts approval hierarchy
- Accounts/HR employee e-ID issuance requires both HR approval and Accounts approval.
- exact employee multi-role approval workflow
- Founder-selected model: Department → Position → Role → Permissions. Multiple active department/position/role assignments may belong to the same canonical Person/Account.
- exact departmental reporting structure
- final job titles and reporting lines
- final country-specific professional verification rules
- exact legal/compliance applicability and wording



## 13. Founder-confirmed administrative decisions — 24 September 2026

### Executive leadership and SuperAdmin
- Antonio Vian Noronha is the initial SuperAdmin.
- Grace Noronha is an Executive Leadership role, not the SuperAdmin role.
- The SuperAdmin control plane should prominently display Grace Noronha's Executive Leadership identity at the top of the organisational hierarchy while preserving separate authority models.

### Intake
- Intake & Operations is confirmed as an organisational department.

### Community / Trust & Safety / Safeguarding
- Recommended working structure: Community & Trust & Safety is the broader operational area.
- Safeguarding is a restricted team/function within that area.
- Safeguarding has separate permissions, protected data, purpose-bound access and break-glass controls.
- Ordinary Community/Trust & Safety staff do not receive unrestricted Safeguarding access.

### Professional verification
- HR and Professional Quality/Verification jointly own professional verification.
- Required professional verification must pass both governance/administrative sides before governed professional activation.

### HR access boundary
HR may manage employment-related and administrative people information, including employee lifecycle, HR complaints, workforce records, department assignments, leave/work status and related support workflows.
HR should receive administrative directory access to students/parents only where needed for an HR-defined operational purpose.
HR does not automatically receive counselling notes, psychological records, SEN records, private career records, safeguarding case details or unrelated specialist service data.

### Employee access revocation
- Recommended: authorised HR staff can immediately revoke an employee's organisational access when an access-containment event occurs.
- The revocation itself must be independently auditable and should invalidate relevant department/position/role assignments and session access according to the authentication/session architecture.
- Termination/firing decisions and the technical access-revocation action are represented as separate governed actions so the security containment action does not have to wait for a secondary approver.
- Consequential employment decisions may still require configured separation-of-duties/approval rules when later defined.

### Employee e-ID
- E-ID issuance requires HR approval AND Accounts approval.
- Revocation rules and replacement-card workflow remain to be defined.

### Permission model
The organisational permission hierarchy is:

Person → Account → Department Membership → Position → Role → Permissions → authorised actions

This is organisational context, not a bypass of the canonical Secret Sharz authorisation model.

## 14. Founder-confirmed leadership operating model — 24 September 2026

### Grace Noronha — Executive Leadership
- Grace Noronha receives an organisational dashboard covering the same broad department/module landscape as the SuperAdmin control plane.
- Her dashboard is governed by SuperAdmin-controlled permissions and does not inherit SuperAdmin authority simply because she is Executive Leadership.
- The interface should present Grace Noronha's Executive Leadership identity prominently at the top of the organisational hierarchy.
- Grace is the initial front-end/product-experience lead alongside her Executive Leadership responsibilities.
- Executive Leadership should focus on high-level organisational visibility and non-technical oversight such as:
  - blogs and public-content overview
  - organisational notes
  - feedback
  - reports and high-level analytics
  - departmental summaries
  - key operational updates
  - approvals or decisions explicitly delegated by SuperAdmin
- Technical infrastructure, security administration, permission engineering, identity architecture and other deeply technical controls remain outside ordinary Executive Leadership access unless explicitly delegated.

### Antonio Vian Noronha — SuperAdmin
- Antonio Vian Noronha is the initial SuperAdmin.
- Antonio is the initial backend/platform technical authority and backend engineering lead, and may use controlled context switching from his own dashboard.
- Context switching must not create fake employment records or bypass authorisation. It changes the effective administrative context while preserving the real actor identity.
- Every context-sensitive action must remain auditable.

### Leadership administration
- The administrative model must support a governed mechanism through which authorised administrators decide who holds Executive Leadership and SuperAdmin roles.
- Appointment/removal of leadership roles must be represented as explicit organisational governance actions rather than ordinary department membership.
- The exact separation-of-duties rule for changing SuperAdmin membership remains open and is a required Founder decision.

## 15. Department staffing and workload division

The organisation may have more than one person performing the same department function.

The model must therefore support:
- multiple HR staff
- multiple Accounts staff
- multiple Intake & Operations staff
- multiple Media staff
- multiple staff within every specialist department
- multiple people holding the same position
- different work queues, responsibilities and case/task ownership within the same department
- reassignment of work without changing the person's canonical identity

The department model is therefore not one department-to-one-person. It is a multi-person staffing model in which a department contains positions and role assignments.

Administrators should be able to divide operational responsibility between staff while preserving least-privilege access.

## 16. Mandatory/statutory committee architecture

Secret Sharz should implement a Committee Registry + Applicability Engine rather than treating every committee as mandatory for every legal entity.

The registry should track:
- legal entity / workplace
- jurisdiction
- employee/worker count
- committee type
- legal basis
- applicability status
- constitution date
- chair/presiding officer
- members
- member terms and expiry
- required training
- meeting schedule
- minutes/evidence
- complaints/cases where applicable
- annual reporting requirements where applicable
- public/internal notice requirements
- approval history
- replacement/reconstitution events

### Workforce / workplace committees

**POSH Internal Committee (IC)**  
Under the Sexual Harassment of Women at Workplace Act, a workplace with 10 or more employees must constitute an Internal Committee. Where the workplace has fewer than 10 employees, or where the complaint is against the employer, the statutory Local Committee mechanism applies. The Government of India reiterated this framework in 2026. citeturn349556search0turn349556search2

The platform should therefore support:
- statutory Internal Committee configuration
- prescribed member roles/composition
- confidentiality controls
- complaint intake and case handling
- term/constitution tracking
- required awareness/training evidence
- escalation to the statutory Local Committee path when applicable

**Grievance Redressal Committee (GRC) — applicability controlled**  
The Industrial Relations Code, 2020 is in force from 21 November 2025. It provides for a Grievance Redressal Committee in an industrial establishment employing 20 or more workers. Whether Secret Sharz is legally classified as an establishment to which this provision applies must be determined from its legal/operational status; the product must not assume universal applicability. citeturn475747search0turn280819search72

**Works Committee — applicability controlled**  
The Industrial Relations Code provides for a Works Committee in an industrial establishment in which 100 or more workers are employed, subject to the statutory trigger/mechanism. This should also be handled through applicability rules rather than created automatically for every Secret Sharz entity. citeturn280819search72turn280819search74

### CBSE school committee support

For a CBSE-affiliated school, CBSE inspection/guidance materials identify the following committee structures as required/verified:
- Sexual Harassment of Women at Workplace / Internal Committee
- POCSO-related committee(s)
- School Management Committee

CBSE safety guidance has also directed schools to maintain separate grievance-redressal mechanisms for public, staff, parents and students. The exact composition and current state-specific requirements must be tied to the school's applicable CBSE/state rules. citeturn729295search17turn280819search75

The Secret Sharz platform should support these as a school-governance committee set, not assume that school committees automatically govern the Secret Sharz corporate workplace.

### Companies Act board committees — entity-dependent

For companies, statutory board committees such as an Audit Committee and Nomination & Remuneration Committee apply only to specified classes of companies, including listed companies and certain prescribed public-company classes. A Stakeholders Relationship Committee applies to companies crossing the statutory security-holder threshold, and vigil-mechanism requirements apply to specified classes. These should therefore be activated only after the legal-entity applicability profile is known. citeturn329404search13turn329404search15

### Compliance design rule

HR may create and manage committee records operationally, but the platform should enforce the legal composition and approval rules for each committee type. HR must not be able to create a statutory committee configuration that contradicts a required statutory role, member qualification or composition rule.

## 17. Committee governance workflow — working design

Recommended starting workflow:

Admin identifies applicable committee
→ HR creates/reconstitutes committee record
→ required composition checks
→ authorised appointment/approval
→ members accept/acknowledge
→ training/evidence checks
→ committee active
→ meetings / cases / reports
→ term expiry / reconstitution

For highly sensitive committees such as POSH and safeguarding-related committees:
- membership visibility must be restricted
- case records must be segregated from ordinary HR data
- committee members receive only the data required for their statutory/assigned function
- audit logs must be immutable/append-only at the platform layer
- no SuperAdmin title alone should silently expose confidential case content


## 18. Founder-confirmed operational decisions — 24 September 2026

### Legal-entity status
- Secret Sharz is currently unregistered.
- Registration is planned.
- The platform must therefore distinguish current organisational configuration from future legal-entity applicability.
- Legal/statutory rules must not be hard-coded as if the current unregistered state were permanent.

### Current workforce size
- Current expected Secret Sharz workforce is under 10 people.
- Statutory committee applicability must still be calculated from the actual legal entity, workplace, worker/employee count, jurisdiction and applicable law at the time of activation.

### Committee creation gate
Before HR can select members for a committee, the platform must first present the applicable law/regulatory basis and require the responsible administrator to review a checklist.

Working flow:
1. Identify legal entity / workplace.
2. Determine jurisdiction and applicable regulation.
3. Determine whether the committee is applicable.
4. Display the governing law, regulation, circular, bye-law or official guidance.
5. Present a required applicability/composition checklist.
6. Record review/acknowledgement.
7. Only then allow member selection.
8. Validate proposed members against the applicable composition requirements.
9. Obtain required Executive Leadership / SuperAdmin approvals.
10. Activate the committee and begin its evidence/meeting lifecycle.

The law-review checklist is a governance control, not a claim that the software itself provides legal advice.

### Leadership permissions over committees
Committee administration must support controlled permissions for:
- HR
- Department Head / relevant operational owner
- Executive Leadership
- SuperAdmin

The platform must distinguish:
- who can create a draft committee;
- who can review the legal basis;
- who can propose members;
- who can approve the constitution;
- who can activate the committee;
- who can view confidential committee cases;
- who can reconstitute/suspend the committee.

The exact duty-separation matrix remains a Founder decision.

### SuperAdmin final authority
- SuperAdmin is the final administrative authority in the system.
- A SuperAdmin may grant another person SuperAdmin dashboard access through a governed action.
- Granting access to another SuperAdmin does not create a second authentication identity for the original SuperAdmin; each person retains their own canonical Person/Account identity.
- The system must record which SuperAdmin granted access, to whom, when, for what scope and under what governance context.
- SuperAdmin access remains subject to explicit audit and sensitive-domain authorisation; the SuperAdmin title alone is not a blanket bypass of specialist data protections.

### Case management requirement
Secret Sharz will use a common case-management foundation across relevant dashboards.

Every case record should have a system-generated case number and, at minimum:
- case number
- date of submission
- exact submission time
- submitting person/account or authorised anonymous/intake identity
- intake channel
- case type/category
- source department
- current owner
- current department/team
- sensitivity level
- affected service/domain
- applicable policy/law/framework
- current status
- priority/severity where configured
- escalation state
- assigned investigator/handler where applicable
- notes and evidence references
- action history
- decision/outcome
- closure date/time
- closure reason
- audit trail

The case number must be immutable after creation.

Submission time and all material status/assignment/escalation changes should be recorded server-side, not accepted from the browser as authoritative values.

### Case visibility across dashboards
A common case engine must appear as a consistent capability across the organisational dashboards, but each dashboard receives only the case fields and records authorised for that role, department, purpose and sensitivity.

For example:
- HR sees HR-authorised workforce cases.
- Counselling sees authorised counselling cases.
- Career sees authorised career cases.
- SEN sees authorised SEN cases.
- Community/Trust & Safety sees authorised community cases.
- Safeguarding sees restricted safeguarding cases.
- Executive Leadership sees permitted overview information and only the underlying case detail explicitly delegated.
- SuperAdmin has final administrative authority but still uses governed access controls for sensitive case content.

This creates one case identity across the platform without creating unrestricted cross-department visibility.

### Escalation architecture
The platform must include a first-class escalation engine.

Working baseline:
Case Intake → Triage → Assignment → Action → Review → Escalation (when triggered) → Resolution → Closure → Retention/Audit

Escalation triggers may include:
- statutory reporting duty
- safeguarding concern
- allegation against a senior leader or relevant decision-maker
- conflict of interest
- inactivity/SLA breach
- severity threshold
- repeated incidents
- professional misconduct concern
- complaint involving a committee member
- complaint involving the assigned handler
- appeal/review request
- legal/regulatory deadline

Escalation must be able to move a case to a different authorised team or authority without exposing the full record to everyone along the route.

The escalation engine must support:
- configured escalation rules
- human override where authorised
- automatic escalation for defined trigger conditions
- deadline/SLA clocks
- escalation history
- recipient acknowledgement
- conflict-of-interest reassignment
- restricted break-glass path for emergencies
- audit trail

Where applicable, the platform should route a case toward the relevant statutory mechanism rather than creating an internal substitute for that authority.

### Mandatory committee evidence
Committee existence alone is not enough. The system should track operation and evidence, including:
- constitution/appointment record
- member acknowledgements
- required training
- meeting dates
- agenda
- minutes/evidence
- actions
- cases handled, where applicable
- annual review/reporting requirements
- term expiry
- reconstitution
- notices/contact details where publication is required

This is especially important for school safety and child-protection governance, where CBSE enforcement material has distinguished between merely listing committees and demonstrating that they actually function.


## 19. Founder decision — global legal operating model

Secret Sharz is intended to operate worldwide. The current recommendation is:

**Start with one Indian Private Limited Company as the initial operating/legal entity, while building the platform as a multi-entity international system from day one.**

Rationale:
- A private company provides a standard corporate structure for ownership, hiring, contracts and future investment.
- The Companies Act, 2013 permits formation of a private company by two or more persons, which fits the current two-founder leadership model. citeturn614337search39
- A private company structure is more suitable than an informal/unregistered structure for a global commercial platform with employees, customers, professional services and institutional contracts.
- Secret Sharz should not assume that incorporation in one country makes one set of privacy/employment/consumer rules sufficient worldwide. For example, the EU GDPR can apply to organisations outside the EU when their processing relates to offering goods/services to people in the EU or monitoring their behaviour there; the UK GDPR has a similar territorial approach. citeturn614337search5turn614337search40
- The Indian DPDP Rules were notified in November 2025 with a phased commencement timeline, so the India operating entity must be built for Indian data-protection obligations from the outset. citeturn772729search0turn772729search7

### Multi-entity architecture

The software must therefore separate:

Legal Entity
→ Country / Jurisdiction
→ Workplace / Establishment
→ Department
→ Position
→ Role
→ Permission
→ Data / Service Domain

Future international expansion may add subsidiaries, branches, or other locally appropriate entities without redesigning the identity model.

The platform must never assume that:
- one employee works for every Secret Sharz entity;
- one committee applies globally;
- one employment law applies globally;
- one privacy notice applies to every jurisdiction;
- one data-retention rule applies globally.

The exact incorporation jurisdiction, tax structure and future international entity strategy must be confirmed with qualified legal/tax advisers before registration.

## 20. Global identifier and code architecture

Secret Sharz will use one consistent identifier family across countries and user types.

The key principle is:

**Person identity is permanent; organisational/service relationships receive their own codes.**

Example structure:

- SS-PER-XXXXXXXX — canonical Person code
- SS-EMP-XXXXXXXX — employment/employee assignment code
- SS-CUS-XXXXXXXX — customer code
- SS-PRO-XXXXXXXX — professional code
- SS-STU-XXXXXXXX — student relationship code
- SS-PAR-XXXXXXXX — parent/guardian relationship code
- SS-INS-XXXXXXXX — institution code
- SS-ORG-XXXXXXXX — legal/operating entity code
- SS-CASE-XXXXXXXX — case code
- SS-TKT-XXXXXXXX — support/request ticket code
- SS-COM-XXXXXXXX — committee code

These are **opaque, globally unique identifiers**, not sequential public numbers.

The code must not reveal:
- country
- date of birth
- age
- department
- diagnosis
- safeguarding status
- salary
- seniority
- case severity
- any other sensitive attribute

Internal database identifiers should be separate from human-facing display codes.

A single person may therefore have:

SS-PER-...
+
SS-EMP-...
+
SS-PRO-...

without creating three Secret Sharz identities.

## 21. Case interface model — no universal Cases tab

The common Case Engine is a platform capability, not a universal navigation item.

Only roles/departments that legitimately handle case-based work should receive a Cases workspace.

Examples:

**Student**
- Requests
- Appointments
- Messages
- My Journey
- My assessments/services where applicable
- No generic internal Cases tab

**Parent/Guardian**
- Requests
- Appointments
- Family/service matters where authorised
- No access to internal HR, professional or safeguarding case records

**HR**
- Employee Matters
- HR Complaints
- Workforce Cases
- Committee Governance

**Accounts**
- Transactions
- Invoices
- Payments
- Refunds/disputes
- Financial requests/issues where applicable
- No specialist counselling/safeguarding case access

**Professional**
- Assigned Caseload / Service Work
- Relevant service cases only

**Institution**
- Requests
- Programmes
- Agreements
- Reports
- Institutional support matters
- No internal employee/safeguarding case workspace by default

**Executive Leadership**
- Governance Overview
- Assigned Reviews / Approvals
- authorised case summaries/details
- no automatic unrestricted specialist-case access

**SuperAdmin**
- Organisational Governance
- Cross-domain case administration where authorised
- protected escalation handling
- audit and escalation control

**Safeguarding**
- Restricted Safeguarding Cases

This prevents a universal case tab from becoming a back-door route to sensitive information.

## 22. Anonymous and confidential reporting

Secret Sharz should support three intake modes where legally and operationally appropriate:

1. **Identified** — the organisation knows the submitter.
2. **Confidential** — identity is known to an authorised restricted handler but not exposed to ordinary users.
3. **Anonymous** — the organisation does not receive identifying information.

The system must not assume that anonymous reporting is legally sufficient for a formal statutory process.

For example, India's POSH Act provides a formal written complaint mechanism for an aggrieved woman, and allows specified representatives to assist/file in circumstances such as incapacity or death. The law also restricts disclosure of the complaint contents and identities of the parties and witnesses. citeturn659088search24turn659088search25

Therefore the Secret Sharz design should distinguish:

Anonymous report
→ risk/intelligence/intake assessment
→ determine whether a formal statutory complaint can be initiated

from:

Formal statutory complaint
→ required statutory information/identity
→ statutory process

The exact workflow must be jurisdiction-specific.

## 23. Protected Leadership Escalation

A protected escalation route is mandatory.

A complaint or case involving:
- SuperAdmin
- Executive Leadership
- Academic Leadership
- a committee approver
- a senior departmental authority
- the person currently assigned to the case

must be capable of being removed from that person's normal escalation chain.

The system should prevent the subject of the complaint from:
- changing the escalation destination
- closing the case
- reassigning it to themselves
- deleting evidence
- suppressing notifications
- altering the original submission
- changing the immutable case identifier

A restricted independent authority path should handle these cases according to the applicable jurisdiction and governance configuration.

## 24. SuperAdmin continuity and emergency succession

The Founder has established an emergency continuity rule.

If a SuperAdmin becomes unable to perform their duties because of medical incapacity or death:

**Executive Leadership + Academic Leadership** temporarily assume governance responsibility for a maximum period of **two months**.

During the emergency period they must:
- preserve platform continuity;
- maintain required organisational operations;
- protect access to sensitive systems;
- prevent unauthorised leadership changes;
- review the leadership succession requirement;
- determine whether to appoint/hire a new SuperAdmin or divide the responsibilities between appropriate leaders;
- record the decision and its approval trail.

The emergency authority is temporary and expires automatically at the end of the two-month maximum unless a formally governed successor arrangement is completed.

The software should therefore have an **Emergency SuperAdmin Succession Mode** with:
- activation reason
- activating authorities
- start date/time
- automatic expiry date/time
- restricted elevated permissions
- mandatory audit
- succession decision workflow
- handover record
- automatic expiry/review warning

Medical information itself should not be collected unnecessarily; the system should record the governance fact that emergency succession criteria have been validated by the authorised leadership process.

## 25. Founder decisions — governance and succession — 25 September 2026

### Ownership and company formation
- Founder ownership has not yet been finalised.
- Antonio Vian Noronha is explicitly not the intended owner by default.
- Recommended initial legal structure: Indian Private Limited Company, subject to final legal/tax advice and Founder confirmation.
- The platform must support multiple legal entities and jurisdictions from the beginning.
- Ownership/shareholding is separate from platform roles such as SuperAdmin, Executive Leadership, Backend Lead and Academic Leadership.

### Technical leadership
- Antonio Vian Noronha is the initial Backend/Platform technical lead.
- Technical leadership does not determine company ownership or directorship.
- Other director/officer positions remain open.

### Executive and Academic Leadership
- Executive Leadership is a temporary organisational assignment and may contain multiple people.
- Academic Leadership is a top-level leadership function alongside Executive Leadership and may contain multiple people.
- Exact appointment, tenure and normal authority remain open.

### Emergency Governance Council
If the active SuperAdmin becomes unable to perform duties:
1. Executive Leadership + Academic Leadership jointly activate Emergency Governance Mode.
2. They form a temporary Emergency Governance Council for a maximum of two months.
3. Emergency Governance is time-limited and is not automatically a permanent SuperAdmin appointment.
4. Routine continuity can be delegated within the emergency authority.
5. High-risk identity, permission, financial, sensitive-data, legal and leadership actions require two-person approval.
6. The Council decides whether to appoint/hire a replacement SuperAdmin or divide the responsibilities among qualified leaders.
7. The succession decision must be recorded with scope, dates, handover and audit evidence.
8. Emergency Governance expires automatically at the two-month maximum unless a governed successor arrangement has been completed.
9. Emergency authority cannot be used to permanently expand a person's own authority without the required succession decision.

### SuperAdmin model
Secret Sharz supports:
- Primary SuperAdmin
- Additional Permanent SuperAdmin
- Temporary/Delegated SuperAdmin

Temporary/Delegated SuperAdmin access requires a grantor, scope, reason, start time, expiry time and audit history.

### Recommended SuperAdmin removal rule
- Temporary/Delegated SuperAdmin access can be revoked through normal governed administration.
- Additional Permanent SuperAdmin removal follows the configured governance and duty-separation process.
- Primary SuperAdmin removal/succession is not a unilateral action available to an ordinary additional SuperAdmin.
- Primary SuperAdmin succession uses the Executive Leadership + Academic Leadership route or the formal ownership/board mechanism once established.
- Emergency succession remains available when the Primary SuperAdmin is unavailable.

### External request to internal case conversion
The platform supports external-to-internal case conversion for appropriate requests from students, parents, customers, institutions and professionals.
The external user sees only their permitted request/status information. Internal Case Engine records remain governed by sensitivity, purpose and authorisation.

### Global legal/governance library
The library is structured:
Country → State/Province/Region → Legal domain → Law/Regulation/Official guidance → Effective date/version → Applicability rules → Review checklist → Evidence → Review status → Next review date.

HR manages operational review and checklist work. SuperAdmin controls authoritative activation of governance rules.

### Committee approval model
- HR prepares, researches, completes the legal checklist and recommends.
- Executive Leadership may provide final approval.
- SuperAdmin may provide final approval.
- Either Executive Leadership or SuperAdmin is sufficient for final committee approval unless a later duty-separation rule requires more.

## 26. Founder decisions — leadership, protected governance, department heads and global identity — 25 September 2026

### Executive Leadership
- Multiple Executive Leaders may exist simultaneously.
- Executive Leadership appointments are explicit and independently permissioned.
- While the organisation remains pre-registration, appointment/removal of an Executive Leader requires:
  - Primary SuperAdmin approval
  - existing Executive Leadership approval
- Once the legal entity is established, formal corporate governance rules supersede the temporary pre-registration workflow.

### Academic Leadership
- Academic Leadership is a top-level leadership function.
- Multiple Academic Leaders may exist.
- The model should support a Head of Academic Leadership with additional Academic Leaders underneath.
- Academic appointments are explicit and independently permissioned.

### Emergency Governance Council composition
- If the active Primary SuperAdmin is unavailable, the Emergency Governance Council is formed from designated Emergency Executive Lead and Emergency Academic Lead.
- Each has a designated alternate.
- The Council is temporary and operates for a maximum of two months.
- The Council does not become the permanent SuperAdmin.
- High-risk emergency actions require two-person approval.

### SuperAdmin delegation and protected actions
SuperAdmin access supports full and delegated forms, but even a SuperAdmin cannot unilaterally perform protected governance actions.

Protected governance actions should include:
- changing/removing the Primary SuperAdmin;
- appointing or removing the successor to the Primary SuperAdmin;
- permanent alteration of the ownership/governance structure recorded in the platform;
- disabling or materially weakening safeguarding controls;
- deleting, purging or irreversibly altering protected audit evidence;
- permanently deleting or destroying protected case records;
- overriding mandatory statutory committee composition/eligibility controls;
- disabling legal/governance applicability controls;
- granting themselves broader protected governance authority;
- bypassing a required duty-separation approval;
- activating or disabling Emergency Governance Mode outside the defined succession workflow.

The exact legal/corporate authority for these actions must eventually align with the registered entity's constitutional documents, shareholder/board governance and applicable law.

### Department Head authority
- A Department Head manages department operations.
- A Department Head cannot independently alter:
  - canonical organisational identity;
  - employment status;
  - salary/payroll terms;
  - platform/system permissions;
  - financial authority limits.
- Department Heads may receive operational authority for staff assignment, work queues, departmental reporting, task management and other explicitly delegated functions.
- Department Heads may exist across multiple departments for the same person, but every appointment is explicit and separately permissioned.

### Case architecture
- Case Type and Sensitivity are independent dimensions.
- Examples of Case Type include HR, Financial, Professional, Counselling, Career, SEN, Community, Safeguarding, POSH, Institution, Compliance, Legal, Security and Other.
- Sensitivity is determined separately and can elevate any case type.
- This prevents a supposedly general case from being treated as low-risk merely because its category is general.

### Global identity/participant model
Secret Sharz will distinguish:
- Person
- Account
- Party/participant type
- Relationship
- Service role
- Employment assignment
- Institution relationship
- Professional relationship
- Customer relationship
- Student relationship
- Parent/guardian relationship
- Partner relationship
- Vendor relationship

These distinctions must not create duplicate human identities.

A person remains one canonical Secret Sharz Person while holding multiple explicit relationships, assignments and service roles.

### Global data-residency architecture
- The platform must support jurisdiction-aware data residency.
- Future deployment may place eligible data in region-specific infrastructure such as India, EU and other designated regions.
- Data residency must be determined by legal entity, jurisdiction, person/service context, data domain and applicable policy rather than simply by the user's login country.
- The canonical identity model must remain globally coherent even when some data is regionally stored.
- Sensitive domains may require stricter residency/transfer controls than ordinary public or low-sensitivity platform data.
- Cross-region access must use explicit authorised data-transfer and access policies.

### Governance separation principle
The architecture must keep these concepts separate:
- ownership
- legal directorship/officership
- Executive Leadership
- Academic Leadership
- SuperAdmin
- Backend/Platform technical leadership
- Department Head
- functional role
- permission
- relationship

Holding one role must not silently grant another.

## 27. Founder decisions — positions, roles, lifecycle and participant model — 25 September 2026

### Department and position governance
- SuperAdmin creates and retires departments.
- Executive Leadership may propose a new department.
- A Department Head may propose new positions within an existing department.
- HR validates workforce necessity, employment classification and lifecycle implications for a position.
- SuperAdmin activates the position in the governed organisational catalogue.
- Positions are organisational jobs, not permission bundles.

### Role governance
- Roles are centrally governed platform/security objects.
- Department Heads may request or recommend roles needed for their work.
- SuperAdmin or an authorised Platform/Security governance function creates or changes permission-bearing roles.
- Department Heads cannot freely invent new permission bundles.
- A role may be reused across departments where the permission meaning is genuinely the same; otherwise separate role definitions are preferred.
- Permissions remain fine-grained and domain-specific.

### Multiple department assignments
- A Person may hold multiple simultaneous department memberships.
- Each department membership has its own position, role assignment, effective dates and permission context.
- Removing one assignment must not silently remove unrelated assignments.

### Acting Department Head
The department leadership lifecycle supports:
Current Head → Acting Head → Permanent Head.

An Acting Head assignment:
- is explicit;
- has an effective date;
- has an expiry/review date;
- receives only the delegated permissions;
- does not automatically become the permanent Head.

### Employee lifecycle
Recommended employee lifecycle:

Candidate → Applicant → Selected → Offer → Pre-boarding → Active → Leave → Suspended → Offboarding → Exited

The platform separates:
- HR/employment status;
- platform access status;
- departmental membership;
- professional activation status.

A change in one does not silently overwrite the others.

### Suspension model
When an employee is suspended:
- the employment/suspension record is preserved;
- platform access may be revoked or restricted immediately based on the configured event;
- specialist and departmental access is re-evaluated;
- HR retains only the access necessary for the employment process;
- audit evidence remains preserved;
- restoration requires explicit reactivation.

### Professional verification lifecycle
Recommended professional lifecycle:

Application
→ Identity verification
→ Qualification verification
→ Licence/registration verification
→ Experience verification
→ Background checks where applicable
→ Professional Quality review
→ HR review
→ Activation
→ Renewal
→ Restriction/Suspension
→ Revocation

Professional activation requires the required HR and Professional Quality/Verification checks to pass.

### Expiry state machine
For expiring professional credentials and similar governed requirements:

Current → Warning → Restricted → Suspended

- Warning gives advance notice.
- Restricted limits selected professional functions.
- Suspended removes professional service functionality where required.
- Reinstatement requires successful re-verification according to the governing rule.
- The system should show the reason and effective date for each transition.

### Person and participant model
A single canonical Person may simultaneously have:
- Employee
- Customer
- Client
- Member
- Service Recipient
- Professional
- Institution Contact
- Partner
- Vendor
- Student
- Parent/Guardian

Each is a separate relationship/participant context, not a separate human identity.

### Institution model
Each Institution receives a dedicated institution identity/account context.

Multiple people can be linked to an Institution through explicit relationships, for example:
- Principal/Executive contact
- Academic contact
- Counselling contact
- HR contact
- Accounts contact
- Operations contact
- Administrator

Each institutional contact has an independently permissioned relationship. One contact does not inherit another contact's authority.

### Parent/guardian relationship
A parent/guardian may be connected to multiple children, and a child may have multiple authorised guardians where legally and operationally appropriate.

Each guardian-child relationship records:
- authority type;
- scope;
- start/end;
- consent status;
- jurisdiction;
- verification status where required;
- service-specific permissions.

## 28. Founder requirement — free Institution Timetable Management Software

Secret Sharz will include a free Institution Timetable Management Software module.

It is an institution-facing product capability and is not limited to any single institution.

The initial product name may be **Secret Sharz Institution Timetable Manager**.

### Core scheduling
The module must include:
- automatic timetable generation;
- constraint-based scheduling;
- teacher conflict detection;
- student-group conflict detection;
- room/classroom conflict detection;
- rule-based constraints;
- subject sequencing;
- double-period configuration;
- laboratory/special-room rules;
- teacher workload balancing;
- capacity and availability constraints.

### Daily operations
The module must include:
- substitution/proxy management;
- absence-aware teacher reassignment;
- exam timetable generation;
- exam room allocation;
- seating-plan generation;
- room/resource booking;
- shared-resource conflict prevention;
- attendance linkage;
- lesson-topic/register linkage.

### Access
Institution staff receive role-based access for:
- Timetable Administrator
- Institution Administrator
- Academic Leadership
- Department/Grade Coordinator
- Teacher
- Student
- Parent/Guardian

Users only see the scheduling information permitted by their institution relationship and role.

### Notifications
The module should support:
- timetable publication;
- timetable changes;
- substitute assignment;
- room changes;
- exam schedule publication;
- relevant reminders.

Channels should be configurable for email, SMS, push notifications and in-platform notifications where enabled.

### Integration
The module should support:
- REST/API integration;
- CSV import/export;
- calendar export;
- Google Calendar integration where authorised;
- Microsoft 365/Outlook calendar integration where authorised;
- SIS/LMS integration through controlled connectors.

### Scheduling engine
The timetable generator should model:
- hard constraints that must never be broken;
- soft constraints that the optimiser should satisfy where possible;
- weighted preferences;
- teacher availability;
- room availability;
- student group availability;
- subject periods per week;
- maximum consecutive teaching periods;
- required breaks;
- room/resource requirements;
- fixed periods;
- double periods;
- sequencing rules;
- department/grade-specific rules.

The generator must produce an explanation of unresolved constraints rather than silently generating an invalid timetable.

### Workload management
For each teacher, the system should calculate:
- assigned periods;
- free periods;
- consecutive periods;
- subject distribution;
- room/resource use;
- substitution load;
- workload against configured capacity.

### Versioning
Timetables must be versioned:
- Draft
- Review
- Approved
- Published
- Archived

Published timetables must remain auditable. Changes create a new version rather than destroying the previous published schedule.

### Free product principle
The base timetable management capability is intended to be free for institutions.

Paid services, where later introduced, must be separate optional services and must not make the core timetable generation unavailable merely because an institution does not purchase additional products.

## 29. Parent paid content ecosystem

Parent/guardian dashboards may include a separate paid content area containing:
- positive parenting guides;
- age/stage parenting resources;
- parenting books;
- recommended reading;
- family routine tools;
- child timetable/household routine tools;
- parent education resources.

The paid content catalogue is separate from a child's private service records.

Purchasing a parenting resource does not grant additional authority over:
- counselling records;
- SEN records;
- safeguarding records;
- professional records;
- unrelated child data.

Access to paid content is a commercial entitlement, while access to a child is an authorisation/relationship decision.

## 30. Minor-protection architecture

Secret Sharz will implement a jurisdiction-aware child/minor protection engine.

The engine evaluates at minimum:
- age;
- country/jurisdiction;
- service type;
- legal basis;
- parental/guardian authority;
- consent requirements;
- age-assurance requirements;
- safeguarding state;
- data sensitivity;
- cross-border transfer requirements.

The product will not use one universal minor rule worldwide.

Examples of requirements that must be represented in the engine include:
- EU GDPR child-consent rules, where applicable;
- UK Children's Code / Age Appropriate Design requirements;
- US COPPA requirements, where applicable;
- India's DPDP child-data requirements;
- Australia's Children's Online Privacy Code and related privacy obligations as applicable.

The system should default to the more protective configuration where applicability is uncertain, then require governance review before reducing protection.

For example:
- EU GDPR Article 8 sets a default 16-year threshold for consent to certain information-society processing, subject to member-state lowering to not below 13, with parental-authority consent below the applicable age. citeturn949872search1
- UK ICO Children's Code applies to online services likely to be accessed by children and emphasises children's best interests and DPIAs. citeturn949872search0turn949872search5
- US COPPA generally requires verifiable parental consent before collecting personal information from children under 13 when covered by the rule, with specific exceptions. citeturn949872search4turn949872search13
- India's 2025 DPDP Rules include verifiable parental-consent mechanisms for processing children's personal data, subject to the Act and applicable rules/exemptions. citeturn754391search5turn754391search7
- Australia's Children's Online Privacy Code is being developed for covered online services likely to be accessed by children, with the final Code required by 10 December 2026; its scope and timing must therefore be tracked as a versioned jurisdictional rule rather than hard-coded as current final law today. citeturn825118search0turn825118search8

The child/minor engine must be policy-driven and versioned because laws and regulatory requirements change.

## 31. International localisation
The platform treats these as separate dimensions:
- language;
- country;
- currency;
- timezone;
- date/number format;
- legal jurisdiction;
- data residency;
- communication preferences.

Changing one does not automatically change the others.

A person may live in one country, use another language, have a different nationality/identity context, receive services in another jurisdiction and have data stored in a permitted regional environment. The system must model these independently.

## 32. External/Vendor Access
Vendors, contractors, auditors and external service providers may receive controlled access through a dedicated External/Vendor Access model.

Vendor accounts are not employee accounts.

Every external assignment requires:
- organisation/vendor relationship;
- named human or service identity;
- purpose;
- scope;
- start date;
- expiry/review date;
- approved data domains;
- access restrictions;
- sponsor/owner;
- contract/agreement reference where applicable;
- audit trail.

External access must default to least privilege and should expire automatically unless renewed.
