// Secret Sharz — custom claim role model (shared, isomorphic-safe).
//
// This module defines the Firebase Authentication custom claim vocabulary used
// for privileged authorization. It contains ONLY declarative constants — no
// Firebase Admin SDK, no client SDK, no side effects — so it is safe to import
// from both server and client code.
//
// SECURITY MODEL
// --------------
// The `role` custom claim (CLAIM_ROLE_KEY) is the AUTHORITATIVE runtime source
// for privileged authorization in firestore.rules. Clients can NEVER set their
// own claims; only the server-side role-management endpoint
// (pages/api/admin/assign-role.js) may assign or remove them, and only after
// authenticating and authorizing the requesting administrator.
//
// `users/{uid}.role` remains as a TRANSITIONAL/LEGACY UX field. It is NOT
// trusted for privileged access decisions on the server, and in firestore.rules
// it is kept only as a migration-only fallback. See SECURITY_FOUNDATION.md.

// The single custom-claim key that carries a privileged role.
export const CLAIM_ROLE_KEY = 'role';

// Founder bootstrap administrator identity. Verified email match grants admin
// independently of any claim, so the founder can never be locked out before
// claims are provisioned. This is a transitional bootstrap mechanism; the
// migration path is to provision the founder a `super_admin` claim and then
// narrow the email-based path. Do NOT hard-code this into general-purpose
// assignment logic — it is used only for requester authorization.
export const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

// Roles that may be assigned as a custom claim via the server endpoint.
//
// These are the privileged / relationship-scoped roles. `student` is
// intentionally absent: it is the default state represented by the ABSENCE of a
// privileged role claim (removing a role claim returns the user to student).
//
// Mirrors src/security/roles.js (PRIVILEGED_ROLES + parent). Do not invent new
// roles here.
export const ASSIGNABLE_CLAIM_ROLES = Object.freeze([
  'super_admin',
  'counsellor',
  'psychologist',
  'educator',
  'parent'
]);

// Roles that grant administrative capability. Only these may authorize a
// role-assignment request. Founder email is handled separately (see
// isFounderRequester) so a not-yet-provisioned founder can bootstrap.
export const ADMIN_CLAIM_ROLES = Object.freeze(['super_admin']);

export const isAssignableClaimRole = (role) =>
  typeof role === 'string' && ASSIGNABLE_CLAIM_ROLES.includes(role);

// Actions supported by the role-management endpoint.
export const ROLE_ACTIONS = Object.freeze({ SET: 'set', REMOVE: 'remove' });

export const isKnownRoleAction = (action) =>
  typeof action === 'string' && Object.values(ROLE_ACTIONS).includes(action);
