/** Platform access is independent of institution membership. */
export const PLATFORM_TIERS = Object.freeze({ FREE: 'free', PREMIUM: 'premium' });

export function normalizePlatformEntitlement(raw = {}) {
  const tier = String(raw.tier || PLATFORM_TIERS.FREE).toLowerCase();
  if (![PLATFORM_TIERS.FREE, PLATFORM_TIERS.PREMIUM].includes(tier)) throw new Error('Invalid platform tier.');
  return { tier, active: raw.active !== false, source: raw.source || 'platform', startsAt: raw.startsAt || null, endsAt: raw.endsAt || null };
}

export function resolvePlatformAccess({ platformEntitlement, activeInstitutionCount }) {
  const entitlement = normalizePlatformEntitlement(platformEntitlement);
  if (!entitlement.active) return { tier: PLATFORM_TIERS.FREE, institutionAccess: false };
  return { tier: entitlement.tier, institutionAccess: Number(activeInstitutionCount) > 0 };
}

export function shouldReturnToFreeTier({ activeInstitutionCount, currentTier }) {
  return Number(activeInstitutionCount) === 0 && String(currentTier || '').toLowerCase() !== PLATFORM_TIERS.PREMIUM;
}
