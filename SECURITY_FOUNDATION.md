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

## Server-managed custom claims (Phase 1D)

Privileged role assignment is now performed **only server-side**. Clients can never assign custom claims.

- **Endpoint:** `pages/api/admin/assign-role.js` (Next.js server API route; the only place `firebase-admin` is imported). The Admin SDK is initialized from the runtime environment only — no service-account credentials are committed (see `.env.example`).
- **Claim model:** a single `role` custom claim (`src/security/claimRoles.js`, `CLAIM_ROLE_KEY = 'role'`). Assignable claim roles are the privileged + parent roles: `super_admin`, `counsellor`, `psychologist`, `educator`, `parent`. `student` is the default represented by the **absence** of a privileged claim (removing a claim reverts to student).
- **Requester authorization:** the calling administrator is authenticated by verifying their Firebase ID token (`verifyIdToken`) and authorized **only from the verified token** — founder email (verified) or a `super_admin` claim. Request body fields, client-side roles, and `users/{uid}.role` are never trusted for authorization (`src/security/roleAssignment.js`).
- **Request validation:** only `{ targetUid, action, role }` are accepted; any other field is rejected (anti mass-assignment / arbitrary-claim injection). `action` is `set` or `remove`; `role` must be on the allowlist.
- **Claim preservation:** existing unrelated custom claims are preserved on every change (`buildNewClaims`).
- **Token refresh:** assigning a claim does not edit an already-issued ID token. The endpoint revokes the target's refresh tokens and the response carries `tokenRefreshRequired: true`; the UI is never told the claim is immediately live.
- **Audit:** every change is written to the protected `auditEvents` collection via the Admin SDK (which bypasses Firestore rules; ordinary clients cannot write there because the rules deny `auditEvents`). The audit record stores actor, target, action, role, previous/new role state and a timestamp — no secrets.

### Firestore rules — claims primary, legacy fallback migration-only

`firestore.rules` now documents that `request.auth.token.role` is the **primary** runtime authority for privileged access. The `users/{uid}.role` profile field remains as a **migration-only legacy fallback** so existing staff/admins whose claims have not yet been provisioned keep access. This fallback is not a new authorization path:

- ordinary users **cannot** set a privileged `users.role` value (create forces `role == 'student'`; update forbids touching `role`/`admin`/`permissions` for non-admins);
- the fallback reads the **existing** document (`resource.data`), never the request body.

**Migration path to remove the legacy fallback:** provision `super_admin`/staff/parent claims for all existing privileged users via `pages/api/admin/assign-role.js`, then remove the `profileRole(...)` fallback terms from `isAdmin()`/`isParent()`/`isStaff()` in a follow-up phase. Until then, a user whose only privileged attribute is a legacy profile-role field still gets privileged data access — this is intentional compatibility, documented as migration-only, and covered by a regression test.

### Consent namespace reservation (defense-in-depth, Phase 1D)

The deterministic `consentEvents/account_{uid}` document id is now **reserved** for `account_privacy` consent. An `account_privacy` consent must use that id, and a non-account consent type must not occupy it. The content-validating `hasAccountConsent()` gate already rejects wrong-typed records at the authorization boundary; reserving the namespace at create time is defense-in-depth, not the sole protection.

### Test coverage

- **Firestore rules tests** (`test/security-rules/`, Jest + emulator): GROUP 9 (claim-based authorization: claim grants admin/staff access without a profile role; self-escalation blocked; migration-only fallback documented) and GROUP 10 (consent namespace reservation). 87 tests total, all passing.
- **Server authorization unit tests** (`test/server/roleAssignment.test.mjs`, Node `node:test`): the pure decision logic for the role-management endpoint — requester authorization, role allowlist, mass-assignment rejection, claim preservation, role removal, safe response/audit shaping. 26 tests, all passing. No credentials, no emulator.

The thin API handler wiring (`verifyIdToken` / `getUser` / `setCustomUserClaims` / audit write) is intentionally **not** covered by CI automated tests because it requires the Firebase Auth emulator + Admin SDK credentials not present in CI. All security-critical decisions are isolated in the tested pure module; the handler only wires those decisions to the Admin SDK. A real integration test against the Auth emulator is a recommended follow-up before production enforcement.

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
- Claims-aware role helpers: implemented; claims are the primary authority, with a migration-only legacy user-role fallback.
- Self-assigned privileged roles blocked: implemented.
- Central role vocabulary: implemented.
- Versioned consent policy model: implemented.
- Immutable self-consent event rules: implemented.
- Authenticated account-consent gate: implemented; validates consent record contents (not mere document existence).
- Account-consent namespace reservation (`account_{uid}` reserved for `account_privacy`): implemented (defense-in-depth).
- Server-managed custom claims: implemented (`pages/api/admin/assign-role.js` + `src/security/claimRoles.js` + `src/security/roleAssignment.js` + `src/security/firebaseAdmin.js`). Audit events written to the protected `auditEvents` collection via the Admin SDK.
- App Check client foundation: implemented but not enforced until configured and monitored.
- Pre-profile consent transaction: next onboarding milestone.
- Dedicated domain schemas/rules: next security milestone.
- Remove legacy `users.role` privileged fallback: next security milestone (after claims provisioned for all existing privileged users).
- Role-management endpoint integration test against the Auth emulator: recommended follow-up before production enforcement.
- Automated security tests: implemented (Firestore Emulator rules tests + server authorization unit tests); see `test/security-rules/` and `test/server/`. Passing tests do not constitute production security approval.
