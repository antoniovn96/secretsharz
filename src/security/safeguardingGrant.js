// Secret Sharz — trusted safeguarding grant model (SERVER-ONLY).
// A safeguarding grant is a narrowly scoped, server-issued exception to
// ordinary consent-based access. A client supplied safeguarding flag is never
// sufficient authorization.

export const SAFEGUARDING_ROLE = 'safeguarding_officer';
export const SAFEGUARDING_PURPOSE = 'safeguarding';
export const SAFEGUARDING_GRANT_STATUS = Object.freeze(['active', 'expired', 'revoked']);
export const SAFEGUARDING_SCOPES = Object.freeze(['safeguarding', 'counselling', 'sen', 'career', 'profile', 'relationships', 'messages', 'files']);
const MAX_DURATION_MS = 60 * 60 * 1000;

function assertNonEmptyString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${field} is required.`);
}
export function isSafeguardingRole(role) { return role === SAFEGUARDING_ROLE; }

export function normalizeSafeguardingGrantInput(input = {}) {
  const { grantId, subjectPersonId, issuedByPersonId, reason, scope, issuedAt, expiresAt } = input;
  assertNonEmptyString(grantId, 'grantId');
  assertNonEmptyString(subjectPersonId, 'subjectPersonId');
  assertNonEmptyString(issuedByPersonId, 'issuedByPersonId');
  assertNonEmptyString(reason, 'reason');
  if (subjectPersonId === issuedByPersonId) throw new Error('A safeguarding officer cannot grant access to itself.');
  if (!Array.isArray(scope) || scope.length === 0 || scope.some((value) => !SAFEGUARDING_SCOPES.includes(value))) throw new Error('A valid safeguarding scope is required.');
  const start = new Date(issuedAt); const end = new Date(expiresAt);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) throw new Error('issuedAt and expiresAt must be valid timestamps.');
  if (end <= start) throw new Error('expiresAt must be after issuedAt.');
  if (end.getTime() - start.getTime() > MAX_DURATION_MS) throw new Error('Safeguarding grants cannot exceed one hour.');
  return Object.freeze({ grantId, subjectPersonId, issuedByPersonId, reason: reason.trim(), scope: Object.freeze([...new Set(scope)]), issuedAt: start.toISOString(), expiresAt: end.toISOString(), status: 'active' });
}

export function isSafeguardingGrantActive(grant, now = new Date()) {
  if (!grant || grant.status !== 'active') return false;
  const current = new Date(now).getTime(); const issued = new Date(grant.issuedAt).getTime(); const expires = new Date(grant.expiresAt).getTime();
  return Number.isFinite(current) && Number.isFinite(issued) && Number.isFinite(expires) && current >= issued && current < expires;
}
export function grantCoversScope(grant, requestedScope) { return isSafeguardingGrantActive(grant) && typeof requestedScope === 'string' && grant.scope.includes(requestedScope); }

export function canIssueSafeguardingGrant({ actorRole, actorPersonId, targetPersonId, reason, now = new Date(), durationMs = 15 * 60 * 1000, scope = ['safeguarding'] }) {
  if (!isSafeguardingRole(actorRole)) return { allowed: false, reason: 'safeguarding_role_required' };
  assertNonEmptyString(actorPersonId, 'actorPersonId'); assertNonEmptyString(targetPersonId, 'targetPersonId'); assertNonEmptyString(reason, 'reason');
  if (actorPersonId === targetPersonId) return { allowed: false, reason: 'self_grant_denied' };
  if (!Array.isArray(scope) || scope.length === 0 || scope.some((value) => !SAFEGUARDING_SCOPES.includes(value))) return { allowed: false, reason: 'invalid_scope' };
  if (!Number.isInteger(durationMs) || durationMs <= 0 || durationMs > MAX_DURATION_MS) return { allowed: false, reason: 'invalid_duration' };
  const issuedAt = new Date(now); const expiresAt = new Date(issuedAt.getTime() + durationMs);
  const grant = normalizeSafeguardingGrantInput({ grantId: `sg_${issuedAt.getTime()}_${targetPersonId}`, subjectPersonId: targetPersonId, issuedByPersonId: actorPersonId, reason, scope, issuedAt, expiresAt });
  return { allowed: true, grant };
}
export { MAX_DURATION_MS };
