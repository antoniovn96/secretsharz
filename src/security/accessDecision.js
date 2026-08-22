// Secret Sharz — Purpose-based access decision helper (SERVER-ONLY).
//
// Deny-by-default. A role by itself never grants access to participant data.
// Safeguarding is never authorized by a client-supplied boolean/string. A
// safeguarding exception requires a trusted, server-issued grant tied to the
// requested subject and scope.
import { ACCESS_DECISION_FIELDS, isKnownValue, DATA_DOMAINS, PLATFORM_ROLES, SERVICE_DOMAINS } from '../platform/canonicalModel.js';
import { grantCoversScope, isSafeguardingGrantActive, SAFEGUARDING_PURPOSE } from './safeguardingGrant.js';

const PURPOSES = Object.freeze([
  'service_delivery', 'care_coordination', 'safeguarding', 'participant_view',
  'parent_view', 'institution_view', 'administration', 'audit',
]);

const SERVICE_DOMAIN_BY_DATA_DOMAIN = Object.freeze({ counselling: 'counselling', sen: 'sen', career: 'career' });

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
    subjectPersonId: input.subjectPersonId || null,
    safeguardingGrant: input.safeguardingGrant || null,
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
    if (context[field] == null || context[field] === '') return { allowed: false, reason: `missing_${field}`, context };
  }

  // Safeguarding must be derived from a trusted grant, never from the caller.
  if (context.purpose === SAFEGUARDING_PURPOSE || context.safeguarding === 'active') {
    if (context.purpose !== SAFEGUARDING_PURPOSE) return { allowed: false, reason: 'safeguarding_requires_safeguarding_purpose', context };
    if (!context.subjectPersonId) return { allowed: false, reason: 'safeguarding_subject_required', context };
    if (!isSafeguardingGrantActive(context.safeguardingGrant)) return { allowed: false, reason: 'safeguarding_grant_required_or_expired', context };
    if (context.safeguardingGrant.subjectPersonId !== context.subjectPersonId) return { allowed: false, reason: 'safeguarding_grant_subject_mismatch', context };
    if (!grantCoversScope(context.safeguardingGrant, context.dataDomain)) return { allowed: false, reason: 'safeguarding_grant_scope_denied', context };
    if (context.safeguardingGrant.issuedByPersonId === context.subjectPersonId) return { allowed: false, reason: 'safeguarding_self_grant_denied', context };
  }

  // Consent remains mandatory for ordinary access. Only a trusted safeguarding
  // grant can authorize the explicitly scoped safeguarding exception.
  if (context.purpose !== SAFEGUARDING_PURPOSE && context.consent !== 'active') {
    return { allowed: false, reason: context.consent === 'unknown' ? 'consent_unknown' : 'consent_not_available', context };
  }

  if (context.timeStatus !== 'active') return { allowed: false, reason: 'relationship_or_access_not_active', context };
  if (context.relationship === 'ended' || context.relationship === 'revoked' || context.relationship === 'suspended') {
    return { allowed: false, reason: 'relationship_not_active', context };
  }

  const expectedService = SERVICE_DOMAIN_BY_DATA_DOMAIN[context.dataDomain];
  if (expectedService && context.serviceDomain !== expectedService && context.purpose !== SAFEGUARDING_PURPOSE) {
    return { allowed: false, reason: 'service_domain_mismatch', context };
  }

  const allowedPurposes = ALLOWED_PURPOSES_BY_SERVICE[context.serviceDomain];
  if (allowedPurposes && !allowedPurposes.has(context.purpose)) {
    return { allowed: false, reason: 'purpose_not_allowed_for_service', context };
  }

  return { allowed: true, reason: context.purpose === SAFEGUARDING_PURPOSE ? 'trusted_safeguarding_grant' : 'policy_requirements_satisfied', context };
}

export { PURPOSES };
