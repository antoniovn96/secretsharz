import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getConsentState, recordConsentEvent } from '../../../src/security/consentService.js';

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();
    if (req.method === 'GET') {
      const type = String(req.query.type || '');
      if (!type) return res.status(400).json({ error: 'type is required' });
      const state = await getConsentState({ db, userId: decoded.uid, type });
      return res.status(200).json(state);
    }
    if (req.method === 'POST') {
      const { type, action, actorType = 'self', relationshipId = null, serviceContext = null } = req.body || {};
      // The authenticated user can record self-consent only. Guardian/professional
      // actors will be enabled through a separate relationship-authorized flow.
      if (actorType !== 'self') return res.status(403).json({ error: 'Non-self consent requires an authorized relationship flow' });
      const event = await recordConsentEvent({ db, userId: decoded.uid, type, action, actorType, relationshipId, serviceContext });
      return res.status(201).json({ id: event.id, policyVersion: event.policyVersion });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consent API error:', error);
    return res.status(400).json({ error: error.message || 'Unable to process consent' });
  }
}
