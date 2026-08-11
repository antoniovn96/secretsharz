# Security Audit — Phase 1D.5: Privilege-Path / Authorization Bypass

Scope: determine whether any part of the Secret Sharz application can bypass,
weaken, contradict, or circumvent the Phase 1D Firebase Custom Claims
authorization model. This is an audit record, not a redesign.

## A. Authorization surface inventory

Server-side privileged surface (the only place claims are consumed for an
authorization DECISION):

- `pages/api/admin/assign-role.js` — assigns/removes the `role` custom claim.
  Authoritative. Requester identified ONLY from the verified ID token
  (`verifyIdToken`); `users.role` and request body are never trusted for the
  requester's authorization (see `src/security/roleAssignment.js`). Audited and
  covered by 26 unit + 17 integration tests.

Client-side role checks (UI-only — NOT security boundaries):
- `src/App.js` — `isAdmin = userData.role === 'super_admin' || isMasterEmail`;
  route guards for `/dashboard/admin`, staff/parent views. UI routing only.
- `src/services/intakeService.js` — `adminUser.role !== 'super_admin'` guard on
  `assignStaffToStudent`. Redundant; the Firestore transaction it runs is
  gated by `isAdmin()` in `firestore.rules` (`students` write = admin only).
- `src/components/ChatWidget.jsx` — reads a `staff` collection. That collection
  has no rule and falls to the default-deny catch-all, so the read is DENIED
  (dead/broken client code, not a bypass).
- `src/dashboards/admin/*`, `src/components/admin/*` — admin UI; all Firestore
  writes (`addDoc` users, `deleteDoc` users) are gated by `isAdmin()` in rules.

Authorization boundary for all client Firestore access: `firestore.rules`
(audited in full below).

No `middleware.js`, no `app/` server actions, no Storage/RTDB rules. The only
other server endpoints are public/unauthenticated (`pages/api/colleges.js`,
`pages/api/youtube-videos.js`, `pages/api/chat.js`) — see Finding F.

## B. Current authority model

`firestore.rules` privileged helpers:
- `hasClaimRole(role)` → `request.auth.token.role == role` (PRIMARY).
- `isFounderAdmin()` → verified ID-token email == founder email (bootstrap).
- `profileRole(uid)` → `get(users/{uid}).data.role` (MIGRATION-ONLY FALLBACK).
- `isAdmin()` = founder OR `super_admin` claim OR existing `super_admin` profile.
- `isStaff()` = staff claim OR existing staff profile.
- `isParent()` = parent claim OR existing parent profile.

So the model is **mixed**: claims are primary, `users.role` is a read-only
migration fallback. The fallback reads the EXISTING document (`resource.data`),
never the request body. Self-created profiles are forced to `role == 'student'`
and cannot set `admin`/`permissions`; self-updates cannot touch
`role`/`admin`/`permissions`. Therefore a non-admin cannot populate the
fallback for themselves. Confirmed by the 87 Firestore rules tests.

The only server endpoint that consumes claims for a decision is
`assign-role.js`, which uses claims/founder only (not `users.role`).

## C. Potential privilege bypasses

None found that grant a NON-ADMIN any privilege. The rules enforce
admin/staff/parent via claims-or-legacy-profile, and the legacy profile can
only be populated by an admin (founder self-healing, or admin client write).
No self-escalation path exists (verified by GROUP 2 rules tests + integration
test 17).

## D. Potential IDORs

- `assign-role.js` accepts `body.targetUid` (user-controlled) and performs an
  Admin SDK operation on that target. This is INTENTIONAL and SAFE: the
  requester is independently authorized (admin claim/founder) from the verified
  token, and the target is merely the object of the admin action. A non-admin
  requester is rejected at 403 before any Admin SDK call. Covered by
  integration tests 3–6, 10.
- `students/{studentId}` read allows `request.auth.uid == studentId` (self),
  parent-by-linked-parent-uid, staff-by-assignedStaff, admin. No arbitrary-UID
  read for a plain authenticated user. `caseFiles` similarly scoped.
- No other server endpoint accepts a user-controlled UID for a privileged op.

## E. Firestore-rule weaknesses

- Default-deny catch-all `/{document=**}` and protected domains
  (`counselling`/`sen`/`career`/`safeguarding`/`auditEvents`) deny all. Good.
- `users/{userId}` create/update/delete: admin branch has no field restriction,
  so an admin CAN set `role`/`admin`/`permissions` on any user doc via direct
  client writes. See Finding B (legacy provisioning path). Not a non-admin
  bypass.
- Collections referenced by client code but absent from rules
  (`assessments`, `roadmaps`, `billing`, `staff`) fall to default-deny → safe
  (denied), though the corresponding features are non-functional under the
  current rules (product-completeness, not security).

## F. API authorization weaknesses

- `pages/api/chat.js` is an UNAUTHENTICATED Anthropic proxy (`Access-Control-
  Allow-Origin: *`, no auth, no rate limit). Any caller can trigger billed
  inference. This is a pre-existing cost/abuse vector, NOT a claims bypass and
  NOT in the Phase 1D claims scope (it touches no claims/users/Firestore). It is
  the AI feature; consent enforcement for `ai_feature` is a future milestone.
  Flagged for separate review; NOT modified (would touch live AI functionality).

## G. Client-only security checks

All client role checks are UI-only; the rules independently enforce. This is
correct by design. No place relies on client hiding for security.

## H. Risk ratings

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | Committed MongoDB Atlas credentials in `importData.js` (2 plaintext URIs) | CRITICAL | FIXED (scrubbed to env var); rotation REQUIRED (in git history) |
| 2 | Tracked `.env` with production Firebase config + API key | HIGH | FIXED (untracked + gitignored); restrict/rotate key REQUIRED (in git history) |
| 3 | Legacy `users.role` fallback lets an admin provision privilege via unaudited client Firestore writes, bypassing the claims endpoint | MEDIUM | DOCUMENTED (migration-only; removing would break founder bootstrap — architectural decision; do NOT remove per Phase 1D) |
| 4 | `pages/api/chat.js` unauthenticated AI proxy | LOW (abuse/cost) | DOCUMENTED (out of Phase 1D claims scope; AI governance milestone) |
| 5 | `school_admin` role label has no server authorization semantics | INFO | DOCUMENTED (grants nothing; client-only label) |
| 6 | `staff` collection reads denied by rules (dead client code) | INFO | DOCUMENTED (no bypass) |
| 7 | Root `refactor*.js` dead scratch scripts | INFO | DOCUMENTED (no secrets after Finding 1 fix) |

## I. Recommended remediation

- Findings 1 & 2: fixed in this audit; OWNERS MUST rotate the leaked MongoDB
  credentials and restrict/rotate the Firebase API key, because both remain in
  git history (removing from the working tree does not un-leak them).
- Finding 3: keep the fallback for now (Phase 1D mandate). Track the follow-up:
  once all privileged users have claims, remove the `profileRole(...)` terms from
  `isAdmin()`/`isStaff()`/`isParent()` AND restrict `users/{userId}` update to
  forbid `role`/`admin`/`permissions` for everyone (including admins) so role
  changes flow only through the audited `assign-role` endpoint. This is an
  architectural change requiring the founder bootstrap to move to a claim.
- Finding 4: separate review for the AI endpoint (auth + consent + rate limit).

## Conclusion

No NON-ADMIN privilege-escalation or authorization-bypass of the Phase 1D
claims model was found. The claims model is enforced at the Firestore rules
boundary and at the sole privileged server endpoint. The concrete defects
found during the audit are SECRET LEAKAGE (committed MongoDB credentials and a
tracked production `.env`), both fixed minimally here, with rotation required
by the owner because the secrets remain in git history.

Passing tests do not constitute production security approval.
