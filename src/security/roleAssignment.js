// Secret Sharz — server-side role-assignment authorization logic.
//
// PURE & TESTABLE: this module contains NO Firebase Admin SDK code and NO I/O.
// Every security-critical decision for the role-management endpoint lives here
// so it can be unit-tested deterministically without credentials or emulators.
// The thin API handler (pages/api/admin/assign-role.js) wires these decisions
// to firebase-admin (verifyIdToken / getUser / setCustomUserClaims / audit).
//
// SECURITY INVARIANTS
// -------------------
// 1. The requesting administrator is identified ONLY from the verified ID
//    token (decodedToken). Request body fields, client-side roles, and
//    users/{uid}.role are NEVER trusted for authorization.
// 2. Only the exact request fields { targetUid, action, role } are accepted;
//    any extra field is rejected (anti mass-assignment / arbitrary-claim
//    injection).
// 3. The requested role must be on the assignable allowlist.
// 4. Existing unrelated custom claims are preserved on every change.
import {
  CLAIM_ROLE_KEY,
  FOUNDER_EMAIL,
  ADMIN_CLAIM_ROLES,
  ASSIGNABLE_CLAIM_ROLES,
  ROLE_ACTIONS,
  isAssignableClaimRole,
  isKnownRoleAction
} from './claimRoles.js';

// Allow only these top-level body keys. Anything else → 400 (mass assignment).
const ALLOWED_BODY_KEYS = Object.freeze(['targetUid', 'action', 'role']);

// ---- Requester authorization ----------------------------------------------

// Founder bootstrap: verified email match. Uses the email + email_verified
// claims present on a verified ID token. Does not consult the request body.
export function isFounderRequester(decodedToken) {
  return Boolean(
    decodedToken &&
      decodedToken.email_verified === true &&
      decodedToken.email === FOUNDER_EMAIL
  );
}

// A requester may administer roles if they hold an admin claim OR are the
// verified founder. The claim comes from the verified token, never the body.
export function isRequesterAdmin(decodedToken) {
  if (!decodedToken) return false;
  if (isFounderRequester(decodedToken)) return true;
  const claimRole = decodedToken[CLAIM_ROLE_KEY];
  return typeof claimRole === 'string' && ADMIN_CLAIM_ROLES.includes(claimRole);
}

// ---- Request validation (anti-injection) ---------------------------------

// Strictly validate the request body. Returns { ok, value } or { ok:false, error }.
// Rejects unknown fields, missing fields, and invalid action/role.
export function validateAssignRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body.', status: 400 };
  }
  const keys = Object.keys(body);
  const unexpected = keys.filter((k) => !ALLOWED_BODY_KEYS.includes(k));
  if (unexpected.length > 0) {
    return { ok: false, error: 'Unexpected fields in request body.', status: 400 };
  }

  const targetUid = body.targetUid;
  if (typeof targetUid !== 'string' || targetUid.length < 1 || targetUid.length > 128) {
    return { ok: false, error: 'A valid targetUid is required.', status: 400 };
  }

  const action = body.action;
  if (!isKnownRoleAction(action)) {
    return { ok: false, error: 'action must be "set" or "remove".', status: 400 };
  }

  if (action === ROLE_ACTIONS.SET) {
    if (!isAssignableClaimRole(body.role)) {
      return { ok: false, error: 'role is not assignable.', status: 400 };
    }
  } else {
    // remove: role field must be a currently-assignable role (the one being
    // removed) and nothing else sneaks through. Reject arbitrary role strings.
    if (!isAssignableClaimRole(body.role)) {
      return { ok: false, error: 'role is not assignable.', status: 400 };
    }
  }

  return { ok: true, value: { targetUid, action, role: body.role } };
}

// ---- Authorization decision ---------------------------------------------

// Decide whether a verified requester may perform the (already-validated)
// assignment against a target. Pure; does not consult Firestore.
//
// `requester` is the decoded ID token of the calling administrator.
// Returns { allowed: true } or { allowed: false, reason, status }.
export function decideAssignment({ requester, targetUid, action, role }) {
  if (!isRequesterAdmin(requester)) {
    return {
      allowed: false,
      reason: 'Requester is not authorised to administer roles.',
      status: 403
    };
  }
  // targetUid/role/action are assumed pre-validated by validateAssignRequest.
  if (typeof targetUid !== 'string' || !isKnownRoleAction(action) || !isAssignableClaimRole(role)) {
    return { allowed: false, reason: 'Invalid assignment parameters.', status: 400 };
  }
  return { allowed: true };
}

// ---- Claim mutation (preserves unrelated claims) -------------------------

// Build the new custom-claims object for a target user, preserving every
// existing claim that is unrelated to the role. Pure & idempotent.
//
// - action 'set'    → sets CLAIM_ROLE_KEY to `role`.
// - action 'remove'  → removes CLAIM_ROLE_KEY (user reverts to default/student).
//
// `existingClaims` is the target's current custom claims (from getUser).
// Returns the full new claims object to write via setCustomUserClaims.
export function buildNewClaims(existingClaims, action, role) {
  const base = existingClaims && typeof existingClaims === 'object' ? { ...existingClaims } : {};
  if (action === ROLE_ACTIONS.SET) {
    if (!isAssignableClaimRole(role)) {
      throw new Error('buildNewClaims: role is not assignable.');
    }
    base[CLAIM_ROLE_KEY] = role;
  } else if (action === ROLE_ACTIONS.REMOVE) {
    if (!isAssignableClaimRole(role)) {
      throw new Error('buildNewClaims: role is not assignable.');
    }
    delete base[CLAIM_ROLE_KEY];
  } else {
    throw new Error('buildNewClaims: action must be "set" or "remove".');
  }
  return base;
}

// ---- Safe response shaping ----------------------------------------------

// Produce a safe response body that does NOT leak secrets, the full claim set,
// or any internal identifier beyond what the caller needs. The target's
// existing/other claims are never echoed back.
export function buildSafeResponse({ targetUid, action, role, tokenRefreshRequired }) {
  return {
    targetUid,
    action,
    role,
    tokenRefreshRequired: tokenRefreshRequired === true
  };
}

// Build the audit record for a privileged role change. No secrets. The claim
// snapshots record ONLY the role-relevant state (was the role present / what it
// became), not the entire claim set, to avoid persisting unrelated claims.
export function buildAuditRecord({ actorUid, actorEmail, targetUid, action, role, previousRole, newRole }) {
  return {
    actorUid: typeof actorUid === 'string' ? actorUid : null,
    actorEmail: typeof actorEmail === 'string' ? actorEmail : null,
    targetUid,
    action,
    role,
    previousRole: previousRole === undefined ? null : previousRole,
    newRole: newRole === undefined ? null : newRole,
    kind: 'role_assignment',
    timestamp: new Date().toISOString()
  };
}

// Read the current role-relevant state from a claims object (for audit).
export function roleFromClaims(claims) {
  if (!claims || typeof claims !== 'object') return null;
  const r = claims[CLAIM_ROLE_KEY];
  return typeof r === 'string' ? r : null;
}

export {
  CLAIM_ROLE_KEY,
  FOUNDER_EMAIL,
  ADMIN_CLAIM_ROLES,
  ASSIGNABLE_CLAIM_ROLES,
  ROLE_ACTIONS
};
