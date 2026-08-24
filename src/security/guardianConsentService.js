// Secret Sharz — guardian-authorized consent service (SERVER-ONLY).
// Verifies relationship, authorization basis and age-band eligibility.
import { evaluateConsentEligibility, getStudentAgeBand } from './consentEligibility.js';
import { recordConsentEvent } from './consentService.js';

const ALLOWED_GUARDIAN_TYPES = new Set(['guardian', 'parent']);
const MINOR_BASIS = 'minor_guardian_acceptance';
const ADULT_BASIS = 'adult_explicit_relationship';

export async function recordGuardianConsent({ db, guardianId, studentId, consentType, action, relationshipId = null, serviceContext = null }) {
  if (!db || !guardianId || !studentId) throw new Error('Guardian and student are required.');
  const relationships = await db.collection('relationships').where('subjectPersonId', '==', studentId).where('relatedPersonId', '==', guardianId).limit(20).get();
  const candidates = relationships.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(item => ALLOWED_GUARDIAN_TYPES.has(item.type) && item.status === 'active');
  const relationship = relationshipId ? candidates.find(item => item.id === relationshipId) : candidates[0];
  if (!relationship) { const error = new Error('Active guardian relationship is required.'); error.code = 'GUARDIAN_RELATIONSHIP_REQUIRED'; throw error; }

  const student = await db.collection('users').doc(studentId).get();
  if (!student.exists) { const error = new Error('Consent subject not found.'); error.code = 'CONSENT_SUBJECT_NOT_FOUND'; throw error; }
  const data = student.data() || {};
  const ageBand = getStudentAgeBand(data);
  if (ageBand === 'unknown') { const error = new Error('Student age band cannot be established.'); error.code = 'CONSENT_AGE_UNKNOWN'; throw error; }

  const expectedBasis = ageBand === '18_plus' ? ADULT_BASIS : MINOR_BASIS;
  if (relationship.authorizationBasis !== expectedBasis) {
    const error = new Error('Guardian relationship authorization basis is not valid for the current life stage.');
    error.code = 'GUARDIAN_AUTHORIZATION_BASIS_INVALID';
    throw error;
  }

  const eligibility = evaluateConsentEligibility({ consentType, actorType: 'guardian', ageBand });
  if (!eligibility.allowed) { const error = new Error('Guardian consent is not eligible under the current service policy.'); error.code = 'CONSENT_NOT_ELIGIBLE'; error.reason = eligibility.reason; throw error; }

  return recordConsentEvent({ db, userId: guardianId, subjectId: studentId, type: consentType, action, actorType: 'guardian', relationshipId: relationship.id, serviceContext: serviceContext || { guardianId, studentId } });
}
