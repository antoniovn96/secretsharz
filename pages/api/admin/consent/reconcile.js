import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { reconcileCounsellingConsent } from '../../../../src/security/consentReconciliation.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../../src/security/adminAuthorization.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  const ids = Array.isArray(req.body?.studentIds) ? req.body.studentIds.map(String).filter(Boolean) : [];
  if (!ids.length) return res.status(400).json({ error: 'studentIds must contain at least one student ID' });

  try {
    const result = await reconcileCounsellingConsent({ db: getAdminFirestore(), studentIds: ids });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Consent reconciliation error:', error);
    return res.status(500).json({ error: 'Unable to reconcile counselling consent' });
  }
}
