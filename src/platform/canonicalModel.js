// Secret Sharz — Canonical Platform Model
// Shared vocabulary for the person/account/relationship/domain architecture.
// This module is intentionally pure: it does not perform Firestore writes.
// Database migration and authorization remain separate, tested steps.

export const LIFE_STAGES = Object.freeze([
  'under_13',
  '13_17',
  '18_plus',
]);

export const PLATFORM_ROLES = Object.freeze([
  'student',
  'parent',
  'counsellor',
  'psychologist',
  'educator',
  'super_admin',
  'professional',
  'mentor',
  'volunteer',
  'researcher',
  'institution_member',
  'employer',
]);

export const SERVICE_DOMAINS = Object.freeze([
  'counselling',
  'sen',
  'career',
  'community',
  'professional',
  'institution',
  'employer',
  'opportunities',
  'research',
  'accessibility',
]);

export const RELATIONSHIP_TYPES = Object.freeze([
  'guardian',
  'parent',
  'primary_counsellor',
  'supervising_professional',
  'sen_professional',
  'career_counsellor',
  'mentor',
  'teacher',
  'institution_member',
  'employer_candidate',
  'research_participant',
  'professional_supervisor',
]);

export const RELATIONSHIP_STATUSES = Object.freeze([
  'pending',
  'active',
  'suspended',
  'ended',
  'revoked',
]);

export const DATA_DOMAINS = Object.freeze([
  'account',
  'profile',
  'relationships',
  'humanJourney',
  'counselling',
  'sen',
  'career',
  'community',
  'professional',
  'institution',
  'employer',
  'opportunities',
  'safeguarding',
  'consent',
  'audit',
  'notifications',
  'messages',
  'files',
  'assessments',
  'knowledge',
  'accessibility',
  'ai',
]);

export const ACCESS_DECISION_FIELDS = Object.freeze([
  'role',
  'relationship',
  'dataDomain',
  'purpose',
  'consent',
  'safeguarding',
  'timeStatus',
]);

export function isKnownValue(value, allowedValues) {
  return typeof value === 'string' && allowedValues.includes(value);
}

export function deriveLifeStage(age) {
  if (!Number.isFinite(age) || age < 0) return null;
  if (age < 13) return 'under_13';
  if (age < 18) return '13_17';
  return '18_plus';
}

export function isMinorLifeStage(lifeStage) {
  return lifeStage === 'under_13' || lifeStage === '13_17';
}

export function createRelationshipRecord({
  subjectPersonId,
  relatedPersonId,
  type,
  domain,
  status = 'pending',
  startsAt = null,
  endsAt = null,
  consentRequired = true,
}) {
  if (!subjectPersonId || !relatedPersonId) throw new Error('Both person IDs are required.');
  if (subjectPersonId === relatedPersonId) throw new Error('A relationship cannot target the same person.');
  if (!isKnownValue(type, RELATIONSHIP_TYPES)) throw new Error('Unknown relationship type.');
  if (domain !== null && !isKnownValue(domain, SERVICE_DOMAINS)) throw new Error('Unknown service domain.');
  if (!isKnownValue(status, RELATIONSHIP_STATUSES)) throw new Error('Unknown relationship status.');

  return {
    subjectPersonId,
    relatedPersonId,
    type,
    domain: domain || null,
    status,
    startsAt,
    endsAt,
    consentRequired: Boolean(consentRequired),
  };
}

export function buildPersonIdentity({ uid, displayName = '', lifeStage = null }) {
  if (!uid) throw new Error('Firebase UID is required.');
  if (lifeStage !== null && !isKnownValue(lifeStage, LIFE_STAGES)) {
    throw new Error('Unknown life stage.');
  }

  return {
    personId: uid,
    displayName,
    lifeStage,
    // Legal/verified identity belongs in a protected identity record.
    // It must never be added to this shared profile object by default.
  };
}
