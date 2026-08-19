// Secret Sharz — consent eligibility decision layer (SERVER-ONLY).
// Distinguishes platform policy from final legal determination.
import { CONSENT_TYPES, isKnownConsentType } from './consentPolicy.js';

export const AGE_BANDS = Object.freeze({ UNDER_13: 'under_13', ADOLESCENT: '13_17', ADULT: '18_plus', UNKNOWN: 'unknown' });

export function getAgeBand(dob, now = new Date()) {
  if (!dob) return AGE_BANDS.UNKNOWN;
  const birth = dob?.toDate ? dob.toDate() : new Date(dob);
  if (Number.isNaN(birth.getTime())) return AGE_BANDS.UNKNOWN;
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const month = now.getUTCMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && now.getUTCDate() < birth.getUTCDate())) age -= 1;
  if (age < 13) return AGE_BANDS.UNDER_13;
  if (age < 18) return AGE_BANDS.ADOLESCENT;
  return AGE_BANDS.ADULT;
}

export function evaluateConsentEligibility({ consentType, actorType, ageBand }) {
  if (!isKnownConsentType(consentType)) return { allowed: false, reason: 'unknown_consent_type' };
  if (!Object.values(AGE_BANDS).includes(ageBand) || ageBand === AGE_BANDS.UNKNOWN) return { allowed: false, reason: 'age_band_unknown' };
  if (!['self', 'guardian'].includes(actorType)) return { allowed: false, reason: 'unsupported_actor' };
  if (ageBand === AGE_BANDS.ADULT && actorType === 'self') return { allowed: true, mode: 'self' };
  if ((ageBand === AGE_BANDS.UNDER_13 || ageBand === AGE_BANDS.ADOLESCENT) && actorType === 'guardian') return { allowed: true, mode: 'guardian_review_required' };
  return { allowed: false, reason: 'service_policy_review_required' };
}

export { CONSENT_TYPES };
