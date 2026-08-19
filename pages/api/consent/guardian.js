import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { recordGuardianConsent } from '../../../src/security/guardianConsentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const { studentId, consentType, action, relationshipId, serviceContext } = req.body || {};
    if (!studentId || !consentType || !action) return res.status(400).json({ error: 'studentId, consentType and action are required' });
    const event = await recordGuardianConsent({ db: getAdminFirestore(), guardianId: decoded.uid, studentId, consentType, action, relationshipId, serviceContext });
    return res.status(201).json({ id: event.id, policyVersion: event.policyVersion, relationshipId: event.relationshipId });
  } catch (error) {
    console.error('Guardian consent API error:', error);
    const status = error.code === 'GUARDIAN_RELATIONSHIP_REQUIRED' ? 403 : 400;
    return res.status(status).json({ error: error.message || 'Unable to process guardian consent', code: error.code || 'CONSENT_ERROR' });
  }
}
