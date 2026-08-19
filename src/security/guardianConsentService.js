// Secret Sharz — guardian-authorized consent service (SERVER-ONLY).
// Verifies relationship and age-band eligibility; it does not invent legal rules.
import { evaluateConsentEligibility, getStudentAgeBand } from './consentEligibility.js';
import { recordConsentEvent } from './consentService.js';

const ALLOWED_GUARDIAN_TYPES = new Set(['guardian', 'parent']);

export async function recordGuardianConsent({ db, guardianId, studentId, consentType, action, relationshipId = null, serviceContext = null }) {
  if (!db || !guardianId || !studentId) throw new Error('Guardian and student are required.');
  const relationships = await db.collection('relationships').where('subjectPersonId', '==', studentId).where('relatedPersonId', '==', guardianId).limit(20).get();
  const relationship = relationships.docs.map(doc => ({ id: doc.id, ...doc.data() })).find(item => ALLOWED_GUARDIAN_TYPES.has(item.type) && item.status === 'active');
  if (!relationship) { const error = new Error('Active guardian relationship is required.'); error.code = 'GUARDIAN_RELATIONSHIP_REQUIRED'; throw error; }

  const student = await db.collection('users').doc(studentId).get();
  if (!student.exists) { const error = new Error('Consent subject not found.'); error.code = 'CONSENT_SUBJECT_NOT_FOUND'; throw error; }
  const data = student.data() || {};
  const ageBand = getStudentAgeBand(data);
  const eligibility = evaluateConsentEligibility({ consentType, actorType: 'guardian', ageBand });
  if (!eligibility.allowed) { const error = new Error('Guardian consent is not eligible under the current service policy.'); error.code = 'CONSENT_NOT_ELIGIBLE'; error.reason = eligibility.reason; throw error; }

  return recordConsentEvent({ db, userId: studentId, type: consentType, action, actorType: 'guardian', relationshipId: relationshipId || relationship.id, serviceContext: serviceContext || { guardianId, studentId } });
}
