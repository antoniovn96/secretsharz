// Secret Sharz — guardian-authorized consent service (SERVER-ONLY).
// This layer verifies the relationship only; it does not invent age/legal rules.
import { getActiveRelationship } from './relationshipStore.js';
import { recordConsentEvent } from './consentService.js';

const ALLOWED_GUARDIAN_TYPES = new Set(['guardian', 'parent']);

export async function recordGuardianConsent({ db, guardianId, studentId, consentType, action, relationshipId = null, serviceContext = null }) {
  if (!db || !guardianId || !studentId) throw new Error('Guardian and student are required.');
  const relationships = await db.collection('relationships')
    .where('subjectPersonId', '==', studentId)
    .where('relatedPersonId', '==', guardianId)
    .limit(20)
    .get();
  const relationship = relationships.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    .find(item => ALLOWED_GUARDIAN_TYPES.has(item.type) && item.status === 'active');
  if (!relationship) {
    const error = new Error('Active guardian relationship is required.');
    error.code = 'GUARDIAN_RELATIONSHIP_REQUIRED';
    throw error;
  }

  // The caller must supply any applicable policy/age decision before this function
  // is invoked. This service only establishes that the actor is an active guardian.
  return recordConsentEvent({
    db,
    userId: studentId,
    type: consentType,
    action,
    actorType: 'guardian',
    relationshipId: relationshipId || relationship.id,
    serviceContext: serviceContext || { guardianId, studentId },
  });
}
