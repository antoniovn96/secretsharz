# Secret Sharz — Platform Alignment Audit

**Date:** 2026-08-13  
**Baseline:** `main` branch  
**Master Blueprint:** `SECRET_SHARZ_MASTER_PLATFORM_BLUEPRINT.md`  
**Status:** Initial architecture audit — implementation alignment phase

## Executive finding

Secret Sharz has a meaningful working foundation, but the current repository is still organised primarily around features and specialist dashboards rather than a fully unified person-centric platform. The codebase should therefore enter an alignment/refactoring phase before broad expansion of sensitive functionality.

This is not a recommendation to discard the existing application. The correct approach is to preserve working capabilities while moving them behind shared platform services and protected domain boundaries.

## Evidence reviewed

- `SECRET_SHARZ_MASTER_PLATFORM_BLUEPRINT.md`
- `SECURITY_FOUNDATION.md`
- `SECURITY_AUDIT_1D5.md`
- `DASHBOARD_AUDIT_REPORT.md`
- `docs/SECURITY_PRIVACY_CONSENT_ARCHITECTURE_V1.md`
- `firestore.rules`
- `package.json`
- root repository structure
- `src/` application structure
- existing career/counsellor/professional/admin implementations

## Status legend

- **GREEN** — aligned enough to continue using; monitor/refine.
- **YELLOW** — useful implementation exists but requires architectural alignment.
- **RED** — must be addressed before major expansion of the affected area.
- **MISSING** — required capability is not sufficiently represented in the current implementation.

---

## 1. Identity & Authentication

**Status: YELLOW**

### Existing

- Firebase Authentication is the identity layer.
- Server-side Firebase Admin tooling exists.
- Custom claims architecture exists.
- Privileged role assignment is server-managed.
- Client-side route checks are correctly treated as UX controls.

### Gap

The platform still needs a canonical person/account/relationship architecture that can support lifelong identity across counselling, SEN, career, community, professional and opportunity contexts without creating disconnected identities.

### Required direction

Create an explicit canonical model:

`person → account → roles → relationships → service memberships → specialist domains`

Do not create product-specific identities.

---

## 2. Minor / Guardian Architecture

**Status: RED**

### Required by founder decision

- minors cannot independently create accounts;
- parent/guardian supervises the account;
- under-18 access is relationship and consent controlled;
- at 18, adult autonomy is established.

### Current gap

The repository has age/guardian architecture documented, but the complete supervised onboarding and adult-transition experience is not yet the canonical application flow.

### Priority

Implement before treating self-registration as the final student architecture.

---

## 3. Consent

**Status: YELLOW**

### Existing

- versioned consent policy
- immutable consent events
- account privacy consent gate
- security tests
- guardian/service-specific consent concepts

### Gap

The security foundation identifies consent-before-profile creation as a next milestone.

### Priority

Move consent transaction fully in front of profile creation and implement service-specific consent flows as specialist products become active.

---

## 4. Role & Relationship Authorisation

**Status: YELLOW/GREEN**

### Existing

The repository has the correct foundational principle:

`Role + Relationship + Data Domain + Purpose + Consent + Safeguarding + Time/Status`

It also has claims-aware role helpers and server-managed privileged claims.

### Gaps

- production claim migration is incomplete;
- legacy `users.role` fallback remains;
- relationship-aware domain policies need to become the consistent pattern across all specialist features.

### Priority

Complete controlled claim migration, then remove the migration-only privileged fallback.

---

## 5. Firestore Domain Architecture

**Status: RED/YELLOW**

### Existing direction

The repository explicitly documents dedicated domains for:

- counselling
- SEN
- career
- safeguarding
- audit
- consent
- professional
- institution
- community
- employer

### Current issue

Legacy `students` and `caseFiles` remain in active application use. They are transitional and must not become the location for new sensitive data.

### Required direction

New sensitive features must use dedicated protected domains with relationship-aware rules and tests.

---

## 6. Career Ecosystem

**Status: YELLOW**

### Existing

The repository has substantial career functionality including:

- Career Assessment
- Career Explorer
- Career Paths
- College Database
- Career Coach Dashboard
- Career case management
- roadmaps

### Gap

Career has been developed more deeply than the shared platform foundation. It must now be aligned as one specialist ecosystem built on common identity, relationships, assessment, consent, opportunity and Human Journey services.

### Decision

Do not keep expanding career-only features until the shared foundation alignment is complete.

---

## 7. Counselling Psychology

**Status: YELLOW**

A substantial counsellor dashboard exists. It should be audited against the canonical counselling domain and the professional confidentiality model before adding further sensitive workflows.

Required future structure:

`client relationship → consent → professional assignment → session → private clinical/professional record → safeguarding → controlled reporting`

Counselling records must never become generic user profile data.

---

## 8. SEN & Inclusive Learning

**Status: YELLOW**

SEN capability exists conceptually and in application structures, but the canonical SEN domain, IEP/support-plan model, relationship model and privacy boundary need a complete implementation audit.

Required direction:

`student/person → SEN relationship → support plan/IEP → professional/teacher/parent relationships → interventions → progress → transition`

---

## 9. Professional Ecosystem

**Status: YELLOW**

### Existing

- Professional Directory
- professional-specific creation flow
- professional role categories
- server-side account provisioning work
- custom claims architecture

### Required next state

Professional lifecycle must become:

`Application → identity → qualifications → registration → experience → background check → scope review → approval → agreement → professional profile → workspace`

Credential evidence must remain separate from public profile data.

---

## 10. Dashboard Architecture

**Status: RED/YELLOW**

The existing dashboard audit documents competing dashboard layouts and orphaned components in the Student Dashboard. This is a clear example of feature-level development creating architectural drift.

### Required direction

Stop treating dashboards as independent products.

Build:

`Shared platform shell → person context → role context → relationship context → specialist workspace`

Specialist dashboards remain distinct where the workflow requires it, but they share identity, navigation, notifications, profile, journey and permission infrastructure.

---

## 11. Human Journey

**Status: MISSING/PARTIAL**

The Human Journey exists strongly in the institutional documents but is not yet clearly implemented as a canonical shared service in the repository.

### Required direction

Build a platform-level Human Journey model for non-sensitive continuity:

- goals
- milestones
- reflection
- achievements
- learning/progress
- participation
- opportunities
- contribution

Do not merge private counselling/SEN records into the journey.

---

## 12. Relationships

**Status: MISSING/PARTIAL**

Relationships are fundamental to the approved security model but need to become a first-class shared platform service.

Required relationship types include:

- guardian ↔ child
- professional ↔ person
- counsellor ↔ client
- SEN professional ↔ learner
- career counsellor ↔ participant
- supervisor ↔ professional
- institution ↔ person
- employer ↔ candidate
- mentor ↔ participant

Relationships must be time-bound and auditable.

---

## 13. Accessibility

**Status: RED**

Accessibility is defined strongly in the product architecture but is not yet represented as a first-class platform engine.

### Required direction

Create the Accessibility & Communication Engine with:

- accessibility preferences
- speech/text services
- captions
- translation
- assistive communication
- future gesture/sign recognition
- camera/microphone permission controls

The planned camera gesture capability belongs here.

---

## 14. AI

**Status: YELLOW/RED**

### Existing

- Anthropic integration exists.
- AI chat infrastructure exists.
- AI is considered in security architecture.

### Gap

The repository still contains a documented `/api/chat.js` security issue: unauthenticated wildcard CORS and no rate limiting.

### Required direction

Before sensitive AI workflows:

- authentication
- rate limiting
- origin controls
- model/data boundary
- explicit invocation
- sensitive-domain isolation
- disclosure
- retention controls
- human escalation

must be enforced.

---

## 15. Trust & Safety

**Status: YELLOW**

Security foundation is strong conceptually and has meaningful automated tests.

Remaining major work:

- App Check enforcement
- privileged-role migration
- safeguarding domain implementation
- break-glass workflow
- sensitive-domain tests
- production privacy/legal review

---

## 16. Community

**Status: PARTIAL**

Mind Space and community-oriented components exist, but they need alignment with the canonical community domain, moderation, pseudonymity, safeguarding and identity separation model.

---

## 17. Knowledge

**Status: PARTIAL**

Blog/video/resource capabilities exist. They should eventually become part of a shared Knowledge service rather than remain disconnected content features.

---

## 18. Opportunities

**Status: PARTIAL**

College/career discovery exists, but the broader opportunity ecosystem — internships, jobs, projects, volunteering, mentorship and employer workflows — is not yet the canonical platform service.

---

## 19. Institutions

**Status: PARTIAL**

Institution-related functionality exists but requires a dedicated institution relationship model, aggregate reporting model and privacy boundary.

Institution membership must never imply unrestricted access to sensitive individual records.

---

## 20. Research

**Status: MISSING/PARTIAL**

Research is an institutional requirement but is not yet a mature platform capability.

Future work must include:

- study registry
- participation
- consent
- ethics controls
- anonymisation
- research data separation
- publication/knowledge workflow

---

# Priority Matrix

| Priority | Area | Reason |
|---|---|---|
| P0 | Canonical person/account/relationship model | Everything else depends on it |
| P0 | Minor/guardian architecture | Founder decision + safeguarding |
| P0 | Consent-before-profile | Privacy/security boundary |
| P0 | Dedicated sensitive domains | Prevents data leakage/architecture drift |
| P0 | AI endpoint security | Existing documented security gap |
| P0 | App Check / privileged migration | Production security gates |
| P1 | Human Journey | Core differentiator/shared experience |
| P1 | Shared dashboard shell | Prevents further UI fragmentation |
| P1 | Professional relationship model | Required for counselling/SEN/career |
| P1 | Counselling domain audit | Sensitive service |
| P1 | SEN domain audit | Sensitive learner service |
| P1 | Career domain refactor | Existing large feature area |
| P1 | Accessibility foundation | Core institutional pillar |
| P2 | Community | Ecosystem expansion |
| P2 | Knowledge | Shared content capability |
| P2 | Opportunities | Career/lifelong ecosystem |
| P2 | Institutions | B2B/institutional ecosystem |
| P2 | Research | Future institutional capability |

---

# Immediate Engineering Rule

**No new major specialist feature should be started until P0 alignment work is completed.**

Existing production bugs and security issues may still be fixed immediately.

The next engineering branch should therefore focus on:

1. canonical identity/relationship model;
2. supervised minor/guardian model;
3. consent-before-profile;
4. dedicated domain schema plan;
5. AI endpoint security;
6. App Check/claim migration gates;
7. shared dashboard shell architecture.

After P0, implementation can resume across Counselling, SEN, Career, Accessibility, Community, Knowledge, Opportunities, Professional and Institutional ecosystems in dependency order.
