// Secret Sharz — canonical server-side consent service.
// Consent is append-only. Never fabricate historical consent during migration.
import { FieldValue } from 'firebase-admin/firestore';
import { CONSENT_ACTIONS, CONSENT_POLICY_VERSION, CONSENT_TYPES, isKnownConsentAction, isKnownConsentType, buildConsentEvent } from './consentPolicy.js';

export const CONSENT_COLLECTION = 'consents';

export async function getConsentState({ db, userId, type }) {
  if (!db || !userId || !isKnownConsentType(type)) return { state: 'unknown', event: null };
  const snapshot = await db.collection(CONSENT_COLLECTION).where('userId', '==', userId).where('type', '==', type).orderBy('createdAt', 'desc').limit(1).get();
  if (snapshot.empty) return { state: 'unknown', event: null };
  const event = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  if (event.action === CONSENT_ACTIONS.GRANTED || event.action === CONSENT_ACTIONS.UPDATED) return { state: 'active', event };
  if (event.action === CONSENT_ACTIONS.WITHDRAWN) return { state: 'withdrawn', event };
  return { state: 'unknown', event };
}

export async function recordConsentEvent({ db, userId, type, action, actorType = 'self', relationshipId = null, serviceContext = null }) {
  if (!db || !userId) throw new Error('Consent subject is required.');
  if (!isKnownConsentType(type)) throw new Error('Unknown consent type.');
  if (!isKnownConsentAction(action)) throw new Error('Unknown consent action.');
  const event = buildConsentEvent({ userId, type, action, actorType, relationshipId, serviceContext });
  const ref = db.collection(CONSENT_COLLECTION).doc();
  await ref.set({ ...event, policyVersion: CONSENT_POLICY_VERSION, createdAt: FieldValue.serverTimestamp() });
  return { id: ref.id, ...event };
}

export { CONSENT_TYPES, CONSENT_ACTIONS };
