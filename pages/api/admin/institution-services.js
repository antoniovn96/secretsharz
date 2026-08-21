import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { INSTITUTION_SERVICE_IDS, normaliseInstitutionServices } from '../../../src/institution/institutionServices.js';

export default async function handler(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  try {
    const db = getAdminFirestore();
    if (req.method === 'GET') {
      const snapshot = await db.collection('institutions').orderBy('createdAt', 'desc').limit(1000).get();
      const institutions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          institutionCode: data.institutionCode || data.tenantCode || '',
          status: data.status || 'pending',
          services: normaliseInstitutionServices(data.licenses?.services || data.services),
          licenses: data.licenses || {},
          coordinator: data.coordinator || null,
        };
      });
      return res.status(200).json({ institutions, serviceIds: INSTITUTION_SERVICE_IDS, generatedAt: new Date().toISOString() });
    }

    const body = req.body || {};
    const institutionId = String(body.institutionId || '').trim();
    if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });
    const ref = db.collection('institutions').doc(institutionId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Institution not found.' });
    const services = normaliseInstitutionServices(body.services);
    await ref.update({ 'licenses.services': services, updatedAt: new Date().toISOString() });
    const updated = await ref.get();
    const data = updated.data();
    return res.status(200).json({ institution: { id: updated.id, name: data.name || '', institutionCode: data.institutionCode || data.tenantCode || '', status: data.status || 'pending', services: normaliseInstitutionServices(data.licenses?.services || data.services), licenses: data.licenses || {}, coordinator: data.coordinator || null } });
  } catch (error) {
    console.error('[admin institution-services] failed:', error);
    return res.status(500).json({ error: 'Unable to manage institutional services.' });
  }
}
