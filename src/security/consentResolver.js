// Secret Sharz — server-side consent resolver (SERVER-ONLY).
// Consent is an authorization input, not a UI-only checkbox.
import { CONSENT_TYPES } from './consentPolicy.js';
import { getSubjectConsentState } from './consentService.js';

export async function resolveServiceConsent({ db, userId, serviceType = CONSENT_TYPES.COUNSELLING }) {
  if (!db || !userId) return { allowed: false, source: 'none', consent: null };
  const snapshot = await db.collection('consents').where('userId', '==', userId).where('type', '==', serviceType).orderBy('createdAt', 'desc').limit(20).get();
  if (snapshot.empty) return { allowed: false, source: 'none', consent: null };
  const latest = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
  const allowed = latest.action === 'granted' || latest.action === 'updated';
  return { allowed, source: 'canonical', consent: latest };
}

export async function resolveSubjectServiceConsent({ db, userId, subjectId, serviceType = CONSENT_TYPES.COUNSELLING, relationshipId = null }) {
  const result = await getSubjectConsentState({ db, userId, subjectId, type: serviceType, relationshipId });
  return { allowed: result.state === 'active', source: result.event ? 'canonical_subject' : 'none', consent: result.event };
}

export async function requireServiceConsent(args) {
  const result = await resolveServiceConsent(args);
  if (!result.allowed) { const error = new Error('Required service consent is not active.'); error.code = 'CONSENT_REQUIRED'; throw error; }
  return result;
}

export async function requireSubjectServiceConsent(args) {
  const result = await resolveSubjectServiceConsent(args);
  if (!result.allowed) { const error = new Error('Required subject-scoped service consent is not active.'); error.code = 'CONSENT_REQUIRED'; throw error; }
  return result;
}

export { CONSENT_TYPES };
