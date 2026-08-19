// Secret Sharz — purpose-specific consent resolver (SERVER-ONLY).
import { CONSENT_TYPES, CONSENT_PURPOSES, isKnownConsentPurpose } from './consentPolicy.js';

export async function resolvePurposeConsent({ db, userId, serviceType, purpose }) {
  if (!db || !userId || !serviceType) return { allowed: false, source: 'none', consent: null };
  if (!isKnownConsentPurpose(purpose)) return { allowed: false, source: 'none', consent: null, code: 'UNKNOWN_PURPOSE' };

  const snapshot = await db.collection('consents')
    .where('userId', '==', userId)
    .where('type', '==', serviceType)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const matching = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(item => (item.purpose || CONSENT_PURPOSES.SERVICE_DELIVERY) === purpose);

  if (!matching.length) return { allowed: false, source: 'none', consent: null };
  const latest = matching[0];
  return {
    allowed: latest.action === 'granted' || latest.action === 'updated',
    source: 'canonical',
    consent: latest,
    purpose,
  };
}

export { CONSENT_TYPES, CONSENT_PURPOSES };
