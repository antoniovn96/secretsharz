// Secret Sharz — Purpose-based access decision helper (SERVER-ONLY).
//
// Deny-by-default. A role by itself never grants access to participant data.
// Callers must supply relationship, data domain, purpose, consent,
// safeguarding state, time/status and service domain.
import { ACCESS_DECISION_FIELDS, isKnownValue, DATA_DOMAINS, PLATFORM_ROLES, SERVICE_DOMAINS } from '../platform/canonicalModel.js';

const PURPOSES = Object.freeze([
  'service_delivery',
  'care_coordination',
  'safeguarding',
  'participant_view',
  'parent_view',
  'institution_view',
  'administration',
  'audit',
]);

const SERVICE_DOMAIN_BY_DATA_DOMAIN = Object.freeze({
  counselling: 'counselling',
  sen: 'sen',
  career: 'career',
});

const ALLOWED_PURPOSES_BY_SERVICE = Object.freeze({
  counselling: new Set(['service_delivery', 'care_coordination', 'participant_view', 'parent_view', 'safeguarding', 'audit']),
  sen: new Set(['service_delivery', 'care_coordination', 'participant_view', 'parent_view', 'institution_view', 'safeguarding', 'audit']),
  career: new Set(['service_delivery', 'care_coordination', 'participant_view', 'parent_view', 'institution_view', 'administration', 'audit']),
});

export function createAccessContext(input = {}) {
  const context = {
    role: input.role || null,
    relationship: input.relationship || null,
    dataDomain: input.dataDomain || null,
    purpose: input.purpose || null,
    consent: input.consent || 'unknown',
    safeguarding: input.safeguarding || 'normal',
    timeStatus: input.timeStatus || 'active',
    serviceDomain: input.serviceDomain || null,
  };

  if (context.role && !isKnownValue(context.role, PLATFORM_ROLES)) throw new Error('Unknown platform role.');
  if (context.dataDomain && !isKnownValue(context.dataDomain, DATA_DOMAINS)) throw new Error('Unknown data domain.');
  if (context.serviceDomain && !isKnownValue(context.serviceDomain, SERVICE_DOMAINS)) throw new Error('Unknown service domain.');
  if (context.purpose && !PURPOSES.includes(context.purpose)) throw new Error('Unknown access purpose.');
  return context;
}

export function decideAccess(input = {}) {
  const context = createAccessContext(input);

  for (const field of ACCESS_DECISION_FIELDS) {
    if (context[field] == null || context[field] === '') {
      return { allowed: false, reason: `missing_${field}`, context };
    }
  }

  // Consent is an explicit authorization input. Unknown is never a grant.
  if (!['active'].includes(context.consent)) {
    if (context.safeguarding !== 'active') {
      return { allowed: false, reason: context.consent === 'unknown' ? 'consent_unknown' : 'consent_not_available', context };
    }
  }

  if (context.timeStatus !== 'active') {
    return { allowed: false, reason: 'relationship_or_access_not_active', context };
  }

  if (context.relationship === 'ended' || context.relationship === 'revoked' || context.relationship === 'suspended') {
    return { allowed: false, reason: 'relationship_not_active', context };
  }

  // Specialist data domains may only be accessed through the matching
  // specialist service domain. This prevents a valid relationship in one
  // service from becoming a cross-domain grant.
  const expectedService = SERVICE_DOMAIN_BY_DATA_DOMAIN[context.dataDomain];
  if (expectedService && context.serviceDomain !== expectedService && context.purpose !== 'safeguarding') {
    return { allowed: false, reason: 'service_domain_mismatch', context };
  }

  const allowedPurposes = ALLOWED_PURPOSES_BY_SERVICE[context.serviceDomain];
  if (allowedPurposes && !allowedPurposes.has(context.purpose)) {
    return { allowed: false, reason: 'purpose_not_allowed_for_service', context };
  }

  return { allowed: true, reason: 'policy_requirements_satisfied', context };
}

export { PURPOSES };
