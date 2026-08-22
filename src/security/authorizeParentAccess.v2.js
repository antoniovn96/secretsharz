// Transitional parent authorization contract. Parent access requires a
// canonical active relationship and an independently verified subject-scoped
// consent decision. This module intentionally does not treat parent-level
// consent as child-level authorization.
import { hasActiveRelationship } from './relationshipStore.js';
import { decideAccess } from './accessDecision.js';

export async function authorizeParentSubject({ db, parentId, studentId, dataDomain, serviceDomain, purpose = 'parent_view', subjectConsentVerified = false, safeguarding = 'normal' }) {
  if (!db || !parentId || !studentId || !dataDomain) return { allowed: false, reason: 'missing_parent_access_context' };
  const relationshipActive = await hasActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: parentId, types: ['parent', 'guardian'] });
  if (!relationshipActive) return { allowed: false, reason: 'parent_relationship_not_active' };
  if (!subjectConsentVerified && safeguarding !== 'active') return { allowed: false, reason: 'subject_scoped_consent_required' };
  return decideAccess({ role: 'parent', relationship: 'active', dataDomain, purpose, consent: subjectConsentVerified ? 'active' : 'unknown', safeguarding, timeStatus: 'active', serviceDomain });
}
