// Secret Sharz — custom claim role model (shared, isomorphic-safe).
//
// This module defines the Firebase Authentication custom claim vocabulary used
// for privileged authorization. It contains ONLY declarative constants — no
// Firebase Admin SDK, no client SDK, no side effects — so it is safe to import
// from both server and client code.

export const CLAIM_ROLE_KEY = 'role';
export const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

// Roles that may be assigned as a custom claim via the server endpoint.
// `student` is intentionally absent: absence of a privileged claim is the
// default student state.
export const ASSIGNABLE_CLAIM_ROLES = Object.freeze([
  'super_admin',
  'counsellor',
  'career_counsellor',
  'psychologist',
  'educator',
  'parent',
  'institution'
]);

export const ADMIN_CLAIM_ROLES = Object.freeze(['super_admin']);

export const isAssignableClaimRole = (role) =>
  typeof role === 'string' && ASSIGNABLE_CLAIM_ROLES.includes(role);

export const ROLE_ACTIONS = Object.freeze({ SET: 'set', REMOVE: 'remove' });

export const isKnownRoleAction = (action) =>
  typeof action === 'string' && Object.values(ROLE_ACTIONS).includes(action);
