// Secret Sharz — parent-to-subject authorization (SERVER-ONLY).
// A parent role never grants access to a child by itself.
import { hasActiveRelationship } from './relationshipStore.js';
import { resolveServiceConsent } from './consentResolver.js';
import { decideAccess } from './accessDecision.js';

const SERVICE_BY_DOMAIN = Object.freeze({ counselling: 'counselling', sen: 'sen', career: 'career' });

export async function authorizeParentAccess({
  db,
  parentId,
  studentId,
  dataDomain,
  serviceDomain = SERVICE_BY_DOMAIN[dataDomain] || dataDomain,
  purpose = 'parent_view',
  consentType = serviceDomain,
  safeguarding = 'normal',
}) {
  if (!db || !parentId || !studentId || !dataDomain) {
    return { allowed: false, reason: 'missing_parent_access_context' };
  }

  const relationshipActive = await hasActiveRelationship({
    db,
    subjectPersonId: studentId,
    relatedPersonId: parentId,
    types: ['parent', 'guardian'],
  });

  if (!relationshipActive) {
    return { allowed: false, reason: 'parent_relationship_not_active' };
  }

  const consent = await resolveServiceConsent({
    db,
    userId: parentId,
    serviceType: consentType,
  });

  const decision = decideAccess({
    role: 'parent',
    relationship: 'active',
    dataDomain,
    purpose,
    consent: consent.allowed ? 'active' : 'unknown',
    safeguarding,
    timeStatus: 'active',
    serviceDomain,
  });

  if (!decision.allowed) return { ...decision, consent: consent.consent || null };

  return { allowed: true, reason: 'parent_relationship_consent_policy_satisfied', consent: consent.consent || null, context: decision.context };
}
