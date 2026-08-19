import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { reconcileCounsellingConsent } from '../../../../src/security/consentReconciliation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    if (decoded.role !== 'super_admin') return res.status(403).json({ error: 'Super admin access required' });
    const ids = Array.isArray(req.body?.studentIds) ? req.body.studentIds.map(String).filter(Boolean) : [];
    if (!ids.length) return res.status(400).json({ error: 'studentIds must contain at least one student ID' });
    const result = await reconcileCounsellingConsent({ db: getAdminFirestore(), studentIds: ids });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Consent reconciliation error:', error);
    return res.status(500).json({ error: 'Unable to reconcile counselling consent' });
  }
}
