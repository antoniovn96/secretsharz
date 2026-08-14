// Secret Sharz — canonical service membership model
// Pure domain helpers only. Persistence, authorization and consent enforcement
// belong to server/domain services and Firestore rules.

import { isKnownValue, SERVICE_DOMAINS } from './canonicalModel';

export const SERVICE_MEMBERSHIP_STATUSES = Object.freeze([
  'pending',
  'active',
  'suspended',
  'ended',
  'revoked',
]);

export const SERVICE_SELECTION_SOURCES = Object.freeze([
  'student',
  'parent',
  'institution',
  'professional',
  'programme',
  'admin',
  'system',
]);

export const PRIMARY_STUDENT_SERVICES = Object.freeze([
  'counselling',
  'sen',
  'career',
]);

export function createServiceMembership({
  personId,
  institutionId = null,
  domain,
  status = 'pending',
  source = 'system',
  isPrimary = false,
  startedAt = null,
  endedAt = null,
}) {
  if (!personId) throw new Error('personId is required.');
  if (!isKnownValue(domain, SERVICE_DOMAINS)) throw new Error('Unknown service domain.');
  if (!isKnownValue(status, SERVICE_MEMBERSHIP_STATUSES)) throw new Error('Unknown membership status.');
  if (!isKnownValue(source, SERVICE_SELECTION_SOURCES)) throw new Error('Unknown selection source.');
  if (startedAt && endedAt && startedAt > endedAt) {
    throw new Error('endedAt cannot be before startedAt.');
  }

  return {
    personId,
    institutionId,
    domain,
    status,
    source,
    isPrimary: Boolean(isPrimary),
    startedAt,
    endedAt,
  };
}

export function choosePrimaryStudentService(memberships = []) {
  return memberships.find(
    (membership) =>
      membership?.status === 'active' &&
      membership?.isPrimary &&
      PRIMARY_STUDENT_SERVICES.includes(membership.domain),
  )?.domain || null;
}

export function shouldAskForInitialServiceSelection({
  onboardingComplete = false,
  memberships = [],
}) {
  if (onboardingComplete) return false;
  return !choosePrimaryStudentService(memberships);
}
