// Secret Sharz — supervised minor / guardian relationship model.
// Pure domain logic. Verification and persistence must use trusted server/domain services.

export const GUARDIAN_RELATIONSHIP_TYPES = Object.freeze([
  'guardian',
  'parent',
]);

export const GUARDIAN_RELATIONSHIP_STATUSES = Object.freeze([
  'pending',
  'active',
  'revoked',
  'ended',
]);

export function requiresGuardianForLifeStage(lifeStage) {
  return lifeStage === 'under_13' || lifeStage === '13_17';
}

export function createGuardianRelationship({
  subjectPersonId,
  guardianPersonId,
  type = 'guardian',
  status = 'pending',
  verified = false,
  verifiedAt = null,
}) {
  if (!subjectPersonId || !guardianPersonId) {
    throw new Error('Both subject and guardian person IDs are required.');
  }
  if (subjectPersonId === guardianPersonId) {
    throw new Error('A person cannot be their own guardian.');
  }
  if (!GUARDIAN_RELATIONSHIP_TYPES.includes(type)) {
    throw new Error('Unknown guardian relationship type.');
  }
  if (!GUARDIAN_RELATIONSHIP_STATUSES.includes(status)) {
    throw new Error('Unknown guardian relationship status.');
  }
  if (verified && !verifiedAt) {
    throw new Error('verifiedAt is required for a verified guardian relationship.');
  }

  return {
    subjectPersonId,
    guardianPersonId,
    type,
    status,
    verified: Boolean(verified),
    verifiedAt,
  };
}

export function hasApprovedGuardianRelationship(relationships = []) {
  return relationships.some(
    (relationship) =>
      relationship?.status === 'active' &&
      relationship?.verified === true &&
      GUARDIAN_RELATIONSHIP_TYPES.includes(relationship?.type),
  );
}
