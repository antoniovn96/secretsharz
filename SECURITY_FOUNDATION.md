# Secret Sharz Security Foundation

## Security boundary

Secret Sharz uses three layers:

1. **Firebase Authentication** — establishes identity.
2. **Firestore Security Rules** — enforce access to Firestore data.
3. **Trusted server/admin tooling** — provisions privileged roles and performs operations that should never depend on client-side authority.

Client-side role checks are for navigation and user experience only.

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

The founder bootstrap rule currently recognises the verified founder email in `firestore.rules`. This is a transitional safeguard while server-managed custom claims are introduced.

The long-term target is:

```text
Trusted admin tooling
        ↓
Firebase Admin SDK
        ↓
Custom claims
        ↓
Firebase ID token
        ↓
Firestore Security Rules
```

## Sensitive data principles

- Deny by default.
- Give users access only to their own data unless an explicit relationship grants access.
- Staff access should be limited to assigned cases.
- Admin access is broader but still auditable.
- Never rely on hidden buttons or client-side route guards as security controls.
- Do not place service-account credentials in the browser or repository.

## Current implementation status

- Founder verification-aware admin rule: implemented.
- Self-assigned privileged roles blocked: implemented.
- Central role vocabulary: implemented.
- App Check client foundation: implemented but not enforced until configured and monitored.
- Server-managed custom claims: next security milestone.
- Automated security-rule tests: required before production enforcement.
