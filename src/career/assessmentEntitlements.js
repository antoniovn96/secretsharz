// Trusted entitlement helpers for career assessment access.
// A client must never be allowed to promote an assessment from partial to full.

export const ENTITLEMENT_TYPES = Object.freeze({ CAREER_ASSESSMENT_FULL: 'career_assessment_full' });
export const ENTITLEMENT_STATUSES = Object.freeze(['active', 'revoked', 'expired']);

export function buildEntitlement({ personId, assessmentAttemptId, provider = 'stripe', providerReference }) {
  if (!personId || !assessmentAttemptId || !providerReference) {
    throw new Error('personId, assessmentAttemptId and providerReference are required.');
  }
  return {
    personId,
    type: ENTITLEMENT_TYPES.CAREER_ASSESSMENT_FULL,
    resourceId: assessmentAttemptId,
    status: 'active',
    provider,
    providerReference,
    grantedAt: null,
    revokedAt: null,
    expiresAt: null,
  };
}

export function hasActiveFullEntitlement(entitlement, { personId, assessmentAttemptId } = {}) {
  return Boolean(
    entitlement
      && entitlement.type === ENTITLEMENT_TYPES.CAREER_ASSESSMENT_FULL
      && entitlement.status === 'active'
      && entitlement.personId === personId
      && entitlement.resourceId === assessmentAttemptId,
  );
}

export function resultAccessFromEntitlement(entitlement, context) {
  return hasActiveFullEntitlement(entitlement, context) ? 'full' : 'partial';
}
