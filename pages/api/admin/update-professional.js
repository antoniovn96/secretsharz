import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';

const ALLOWED_ROLES = new Set(['counsellor', 'career_counsellor', 'psychologist', 'educator']);

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;
  const requester = authorization.decodedToken;

  const professionalUid = typeof req.body?.professionalUid === 'string' ? req.body.professionalUid.trim() : '';
  if (!professionalUid) return res.status(400).json({ error: 'Professional ID is required.' });
  const body = req.body || {};
  const role = String(body.role || '').trim();
  if (!ALLOWED_ROLES.has(role)) return res.status(400).json({ error: 'Invalid professional role.' });
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address.' });

  const db = getAdminFirestore();
  try {
    const ref = db.collection('users').doc(professionalUid);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Professional account not found.' });
    const existing = snap.data() || {};
    const updates = {
      name,
      email,
      phone: String(body.phone || '').trim() || null,
      role,
      professionalRole: role,
      specialization: String(body.specialization || '').trim() || null,
      qualification: String(body.qualification || '').trim() || null,
      institutionName: String(body.institutionName || '').trim() || null,
      registrationNumber: String(body.registrationNumber || '').trim() || null,
      status: body.status === 'inactive' ? 'inactive' : 'active',
      updatedAt: new Date(),
    };
    if (role !== existing.role && role !== existing.professionalRole) {
      updates.institutionIds = [];
      updates.professionalService = null;
    }
    await ref.update(updates);
    await db.collection('auditEvents').add({
      actorUid: requester.uid || null,
      actorEmail: requester.email || null,
      actorRole: 'super_admin',
      authorizationSource: authorization.authorizationSource || 'claim',
      targetUid: professionalUid,
      action: 'update_professional',
      changedFields: Object.keys(updates),
      timestamp: new Date()
    });
    return res.status(200).json({ success: true, professional: { id: professionalUid, ...existing, ...updates } });
  } catch (error) {
    console.error('[update-professional] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to update professional.' });
  }
}
