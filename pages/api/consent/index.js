import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getConsentState, recordConsentEvent } from '../../../src/security/consentService.js';
import { evaluateConsentEligibility, getStudentAgeBand } from '../../../src/security/consentEligibility.js';

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();
    if (req.method === 'GET') {
      const type = String(req.query.type || '');
      if (!type) return res.status(400).json({ error: 'type is required' });
      return res.status(200).json(await getConsentState({ db, userId: decoded.uid, type }));
    }
    if (req.method === 'POST') {
      const { type, action, actorType = 'self', relationshipId = null, serviceContext = null } = req.body || {};
      if (actorType !== 'self') return res.status(403).json({ error: 'Non-self consent requires an authorized relationship flow' });
      const subject = await db.collection('users').doc(decoded.uid).get();
      if (!subject.exists) return res.status(404).json({ error: 'Consent subject not found' });
      const data = subject.data() || {};
      const ageBand = getStudentAgeBand(data);
      const eligibility = evaluateConsentEligibility({ consentType: type, actorType, ageBand });
      if (!eligibility.allowed) return res.status(403).json({ error: 'Consent actor is not eligible for this service policy', code: 'CONSENT_NOT_ELIGIBLE', ageBand, reason: eligibility.reason });
      const event = await recordConsentEvent({ db, userId: decoded.uid, type, action, actorType, relationshipId, serviceContext });
      return res.status(201).json({ id: event.id, policyVersion: event.policyVersion });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consent API error:', error);
    return res.status(400).json({ error: error.message || 'Unable to process consent' });
  }
}
