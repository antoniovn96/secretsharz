// Secret Sharz — canonical person/account model
// Pure helpers only. This is the shared identity vocabulary that specialist
// domains build on; it intentionally does not perform persistence.

import { deriveLifeStage, isMinorLifeStage, isKnownValue, LIFE_STAGES } from './canonicalModel';

export const ACCOUNT_STATUSES = Object.freeze([
  'pending_consent',
  'pending_guardian',
  'active',
  'suspended',
  'deactivated',
]);

export const PROFILE_STATUSES = Object.freeze([
  'not_created',
  'incomplete',
  'complete',
]);

export function buildPersonAccountState({
  uid,
  age,
  accountStatus = 'pending_consent',
  profileStatus = 'not_created',
  guardianRequired = null,
}) {
  if (!uid) throw new Error('Firebase UID is required.');
  if (!Number.isFinite(age) || age < 0) throw new Error('A valid age is required.');
  if (!isKnownValue(accountStatus, ACCOUNT_STATUSES)) throw new Error('Unknown account status.');
  if (!isKnownValue(profileStatus, PROFILE_STATUSES)) throw new Error('Unknown profile status.');

  const lifeStage = deriveLifeStage(age);
  const requiresGuardian =
    guardianRequired === null ? isMinorLifeStage(lifeStage) : Boolean(guardianRequired);

  return {
    personId: uid,
    accountStatus,
    profileStatus,
    age,
    lifeStage,
    guardianRequired: requiresGuardian,
    adultAutonomyEligible: lifeStage === LIFE_STAGES[2],
  };
}

export function canCreateSelfServiceProfile({
  accountStatus,
  consentGranted,
  guardianApproved,
  guardianRequired,
}) {
  if (accountStatus !== 'pending_consent') return false;
  if (!consentGranted) return false;
  if (guardianRequired && !guardianApproved) return false;
  return true;
}

export function deriveAdultTransitionState({ age, guardianRequired = true }) {
  const lifeStage = deriveLifeStage(age);
  if (lifeStage !== '18_plus') {
    return { eligible: false, reason: 'person_is_not_yet_18' };
  }

  return {
    eligible: true,
    guardianRelationshipReviewRequired: Boolean(guardianRequired),
    adultAutonomy: true,
  };
}
