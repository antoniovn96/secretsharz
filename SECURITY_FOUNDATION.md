# Secret Sharz Security Foundation

## Security boundary

Secret Sharz uses three layers:

1. **Firebase Authentication** — establishes identity.
2. **Firestore Security Rules** — enforce client access to Firestore data.
3. **Trusted server/admin tooling** — provisions privileged roles, manages high-trust workflows and performs operations that must never depend on client-side authority.

Client-side role checks and route gates are UX controls only. They are never the final authorization boundary.

## Core access principle

> **Role + Relationship + Data Domain + Purpose + Consent + Safeguarding + Time/Status = Access decision.**

A role by itself never grants unrestricted access.

## Roles

- `student`
- `parent`
- `counsellor`
- `psychologist`
- `educator`
- `super_admin`

The central role vocabulary lives in `src/security/roles.js`.

## Privileged role policy

A self-registered user can create only a `student` profile. A user must not be able to grant themselves:

- `parent`
- `counsellor`
- `psychologist`
- `educator`
- `super_admin`

Role changes must be performed through trusted administrative tooling.

## Founder bootstrap

The founder account `antonio.antonio.noronha@gmail.com` remains recognised as the bootstrap administrator only when Firebase Authentication confirms the verified email. This is a transitional safeguard.

The long-term authority path is:

```text
Trusted admin tooling
        ↓
Firebase Admin SDK
        ↓
Firebase Auth custom claims
        ↓
Firebase ID token
        ↓
Firestore Security Rules
```

Custom claims are for authorization attributes only; profile and sensitive data do not belong in claims.

## Consent

Account privacy consent is represented as an immutable event in `consentEvents`.

- Clients may create their own self-consent events using the allowlisted schema.
- Historical consent events cannot be edited or deleted by clients.
- Guardian, professional, safeguarding and administrative consent events will use trusted workflows.
- Specialist consent is separate from account consent.

The current implementation includes an authenticated account-consent gate. The next onboarding milestone will move consent recording fully in front of profile creation so the profile is not created until the account consent transaction succeeds.

### Rule implementation note (security-rule test discovery)

The Firestore emulator security-rule tests (`test/security-rules/`) surfaced two genuine implementation defects in `firestore.rules` that prevented the consent-before-profile boundary from actually functioning:

1. `hasAccountConsent(uid)` used a partial path segment `account_$(uid)`. Firestore path interpolation cannot span a partial segment, so the rules file failed to compile — meaning the entire ruleset could not be deployed or enforced. Fixed to `exists(/databases/$(database)/documents/consentEvents/$('account_' + uid))`, preserving the deterministic `account_{uid}` document id defined by `src/security/consentPolicy.js`.
2. The `consentEvents` create rule compared `eventId == 'account_$(request.auth.uid)'` inside a single-quoted string literal, which never matches the real document id. Fixed to `eventId == 'account_' + request.auth.uid` (string concatenation).

Neither change weakens security; both restore the consent gate to its intended, architecture-defined behaviour. Regression tests cover both paths.

### Account-consent content validation (Phase 1c follow-up)

The account-consent authorization boundary validates the consent RECORD CONTENTS, not merely document existence. The existence of a document at `consentEvents/account_{uid}` is not sufficient; `hasAccountConsent(uid)` additionally requires, via `get()`, that the stored consent record:

- belongs to the same user (`userId == uid`);
- is an account privacy consent (`type == 'account_privacy'`);
- is currently granted (`action == 'granted'`);
- uses the approved policy version (`policyVersion == '1.0.0'`);
- carries the full valid consent schema (`keys().hasAll([...])`).

This means a wrong-typed (e.g. `counselling`), wrong-userId, withdrawn, wrong-policy-version, or malformed document placed at the deterministic path cannot satisfy the profile-creation boundary. `get()`/`exists()` results are cached within a single rule evaluation, so the repeated lookups incur a single document read. Regression tests in GROUP 8 prove each of these rejection paths. This enforces the existing consent model (the `account_privacy` type that `AccountConsentGate` already writes); it is not a new architectural decision.

## Sensitive data principles

- Deny by default.
- Separate sensitive domains into separate collections/documents.
- Give users access only to their own data unless an explicit relationship grants access.
- Staff access is limited to assigned cases and authorised domains.
- Parent/institution access is relationship- and service-specific.
- Admin access is broad only where necessary and remains auditable.
- Never rely on hidden buttons or client-side route guards as security controls.
- Never place service-account credentials in the browser or repository.

Firestore reads are document-level, so sensitive fields that need different access must be stored separately rather than relying on field hiding inside a shared document.

## Legacy compatibility boundary

`students` and `caseFiles` remain temporarily available for existing application functionality. New sensitive data must not be added to these records. Dedicated `counselling`, `sen`, `career`, `safeguarding` and `auditEvents` domains are explicitly protected until their relationship-aware schemas and tests are approved.

## App Check

The client App Check foundation exists. Production enforcement remains a deployment gate: configure the production reCAPTCHA Enterprise site key, monitor traffic, then enforce App Check for the appropriate Firebase services.

## Current implementation status

- Founder verification-aware admin rule: implemented.
- Claims-aware role helpers: implemented, with legacy user-role fallback.
- Self-assigned privileged roles blocked: implemented.
- Central role vocabulary: implemented.
- Versioned consent policy model: implemented.
- Immutable self-consent event rules: implemented.
- Authenticated account-consent gate: implemented; validates consent record contents (not mere document existence).
- App Check client foundation: implemented but not enforced until configured and monitored.
- Server-managed custom claims: next security milestone.
- Pre-profile consent transaction: next onboarding milestone.
- Dedicated domain schemas/rules: next security milestone.
- Automated security-rule tests: implemented (Firestore Emulator + `@firebase/rules-unit-testing`); see `test/security-rules/`. Passing tests do not constitute production security approval.
