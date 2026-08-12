# Secret Sharz — Privacy, Consent & Security Architecture v1

**Status:** Implementation baseline — product/legal review required before production processing of sensitive data.
**Scope:** Identity, consent, privacy, domain boundaries, professional access, safeguarding, AI boundaries and security controls.

## 1. Foundational rule

No one receives access merely because they belong to a role. Access is granted only when the following conditions are satisfied:

`Role + Relationship + Data Domain + Purpose + Consent + Safeguarding + Time/Status = Access decision`

Security is enforced server-side. Client-side navigation is never an authorization boundary.

## 2. Person model

Secret Sharz maintains one person identity across specialist divisions. Counselling, SEN and Career remain professionally distinct domains while continuity is preserved across the person's journey.

### Identity separation

- Verified/legal identity is private.
- Display identity may be different from legal identity.
- Community identity may be anonymous or pseudonymous.
- Professionals use a verified professional identity for professional profiles.

## 3. Data domains

Sensitive domains must be separated into independently protected records. Firestore security rules cannot hide individual fields inside a readable document; sensitive fields therefore belong in separate documents/collections.

Core domains:

- `account` — authentication and minimum account metadata.
- `profile` — user-provided profile information.
- `counselling` — counselling relationships, professional records and service data.
- `sen` — SEN/learning support records.
- `career` — assessments, career plans, roadmaps and career relationships.
- `community` — posts, moderation and public/pseudonymous participation.
- `professional` — professional identity, verification and published content.
- `institution` — school/organisation relationships and aggregate reporting.
- `employer` — candidate-controlled opportunity data.
- `safeguarding` — restricted safeguarding events and case management.
- `consent` — immutable consent events and current consent status.
- `audit` — protected audit events.

## 4. Consent model

Consent is granular, versioned and service-specific. The platform must not treat general account consent as permission to process every specialist domain.

Initial consent categories:

- account/privacy notice
- counselling
- SEN
- career guidance
- community participation
- AI-enabled feature use
- professional publishing/content licence
- guardian permissions where applicable

Withdrawal means future processing stops for the relevant service, while records may be retained only where a legitimate/legal/service retention basis requires it. Account deletion is separate from consent withdrawal.

### Consent event design

Consent events are append-only. They must include:

- subject/user ID
- consent type
- action (`granted`, `withdrawn`, `updated`)
- policy/notice version
- timestamp
- collection method
- actor/guardian relationship where applicable
- optional service context

The current consent state is derived from trusted events or maintained by trusted server code; clients must not be trusted to grant themselves permissions.

## 5. Age and guardian model

The platform supports age-aware experiences:

- under 13
- 13–17
- 18+

Exact DOB is collected only where necessary.

Parent/guardian and emergency-contact relationships are separate. A guardian relationship does not automatically grant unrestricted access to a child's counselling, SEN or career records.

When a user reaches 18:

- guardian access is revoked;
- the user establishes/confirm their adult permissions;
- historical disclosures remain recorded but do not create continuing access.

Safeguarding decisions involving minors follow the approved professional safeguarding protocol and are not reduced to a blanket automatic-parent-notification rule.

## 6. Domain access

A student may simultaneously have:

- primary counsellor
- secondary/supervising professional
- SEN professional
- career counsellor

Each professional receives only the domain and case scope necessary for the active relationship.

Professional relationships are time-bound. When a relationship ends, access is revoked immediately; controlled archival access may exist where operationally or legally appropriate.

## 7. Parent and institution access

Parents/guardians receive only information permitted by the applicable relationship, service, consent and safeguarding context.

Institutions receive aggregate information by default. Individual information may be shared only where explicitly authorised and appropriate.

Institution membership never grants automatic access to counselling notes, private journals, psychological records or private SEN records.

## 8. Employer access

Employers do not search the entire Secret Sharz population. Candidate visibility is opt-in.

Employers may see only the career/job-seeking profile the candidate chooses to expose. Counselling and SEN information are never included by default.

For minors, opportunity access is restricted to age-appropriate opportunities and safeguarding requirements.

## 9. Professional governance

Professionals must pass a controlled onboarding process:

`Application → identity verification → qualification/registration verification → scope review → approval → professional agreement → profile publication`

Professional profiles may contain verified professional information, articles, videos and other approved contributions. The professional retains ownership of original content; Secret Sharz receives a limited licence necessary to host/display/distribute the content through agreed Secret Sharz channels.

Initially all professional content requires review before publication. A future trusted-professional publishing model may be introduced.

Moderation actions are logged and, where safe, the author receives the reason and appeal route.

## 10. Safeguarding

Secret Sharz has a restricted Safeguarding Team. Safeguarding access is not equivalent to ordinary administrator access.

Community safety and professional safeguarding may use limited safety triage under professionally approved protocols.

### Break-glass access

Exceptional emergency access requires:

- authorised identity
- mandatory reason
- limited scope
- temporary access
- immutable audit event
- post-event review

Break-glass access must never become a normal workflow.

## 11. Professional supervision

A supervisor may access only the professionals/cases within their explicitly assigned supervisory scope. Supervision does not grant organisation-wide access.

## 12. AI boundaries

AI is an assistant, not an authority.

User-facing AI:

- must disclose that AI is being used;
- must explain what information the feature will use;
- may access a user's own data only when the user intentionally invokes the relevant feature;
- must not silently ingest unrelated domains;
- must not use sensitive service data for model training;
- must defer to human professionals for clinical, safeguarding, ethical or legal judgement.

AI conversations should be retained only when the user explicitly chooses to save them, unless a specific service has a separately approved retention basis.

## 13. AI engineering governance

OpenHands is an approved engineering implementation agent. Odysseus is the approved architecture/institutional reasoning agent. AI agents may assist with implementation, analysis, documentation and testing, but human engineers retain authority over architecture, security, governance, production approval and institutional ethics.

No AI agent may independently approve production deployments, redefine governance, bypass security review or replace accountable human judgement.

## 14. Authentication and account security

Required architecture:

- role-aware MFA, with stronger requirements for sensitive-data roles;
- device/session management;
- new-login notifications, especially for professionals/admins;
- role-sensitive inactivity timeouts;
- verified professional email/phone;
- periodic credential/registration review;
- controlled account recovery by user type.

## 15. Authorization

Long-term role authority must use Firebase Authentication custom claims managed by trusted server-side tooling. Claims should contain authorization attributes only, not profile or sensitive data.

Firestore rules remain the final client-access boundary. Admin SDK/server operations bypass Firestore rules and therefore require explicit IAM/server authorization.

## 16. Data minimisation and document separation

Sensitive fields must not be co-located with broadly readable profile documents. A client who can read a Firestore document receives the entire document; rules cannot hide individual fields.

Examples:

- public profile ≠ private identity
- profile ≠ counselling notes
- career profile ≠ counselling record
- institution summary ≠ individual counselling record
- professional public profile ≠ credential evidence

## 17. Auditability

Sensitive actions are auditable, including:

- privilege changes
- professional verification changes
- access grants/revocations
- consent events
- safeguarding events
- break-glass access
- moderation actions
- sensitive administrative changes

Audit records are protected from ordinary administrator deletion and follow controlled retention procedures.

## 18. User transparency

The platform will provide:

- Privacy & Consent Centre
- security/device management
- data export request
- deletion request
- correction request
- consent withdrawal
- relationship/access explanations (`Why can this person see this?`)
- understandable restricted-access explanations

## 19. Accessibility baseline

The security and consent experience must be accessible, including:

- keyboard operation
- visible focus indicators
- skip links
- semantic headings/labels
- accessible errors and instructions
- text alternatives for meaningful images
- captions/transcripts for media
- text resizing without layout failure
- reduced-motion support
- predictable layouts and plain language

Accessibility is part of the security/consent experience, not a later visual polish step.

## 20. India-first, internationally expandable

The architecture is India-first while remaining capable of supporting international privacy, localisation and data-residency requirements later. Data processors and third-party integrations must be documented with the location and purpose of processing.

## 21. Production gates

Sensitive production features are not considered complete until:

1. Firestore rules are tested with the Emulator.
2. App Check is monitored and then enforced for the appropriate services.
3. Privileged roles are server-managed.
4. Sensitive data is separated into protected domains.
5. Consent events are auditable.
6. Safeguarding and break-glass workflows are tested.
7. Accessibility checks pass for the relevant user journeys.
8. Human review approves production deployment.

## 22. Legal/product review marker

This architecture is a product and engineering specification. User-facing consent notices, privacy notices, professional agreements and safeguarding procedures require appropriate legal/privacy/professional review before production use.