import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { INSTITUTION_SERVICE_IDS, normaliseInstitutionServices } from '../../../src/institution/institutionServices.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function requireAdmin(req) {
  const token = bearerToken(req);
  if (!token) throw Object.assign(new Error('Authentication required.'), { statusCode: 401 });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { throw Object.assign(new Error('Invalid or expired authentication token.'), { statusCode: 401 }); }
  const founder = decoded.email_verified === true && decoded.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';
  if (!founder && decoded.role !== 'super_admin') throw Object.assign(new Error('Super Admin access required.'), { statusCode: 403 });
  return decoded;
}

function institutionRef(db, id) {
  const cleanId = String(id || '').trim();
  if (!cleanId) throw Object.assign(new Error('Institution ID is required.'), { statusCode: 400 });
  return db.collection('institutions').doc(cleanId);
}

export default async function handler(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    await requireAdmin(req);
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
    const ref = institutionRef(db, body.institutionId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Institution not found.' });
    const services = normaliseInstitutionServices(body.services);
    await ref.update({ 'licenses.services': services, updatedAt: new Date().toISOString() });
    const updated = await ref.get();
    const data = updated.data();
    return res.status(200).json({
      institution: {
        id: updated.id,
        name: data.name || '',
        institutionCode: data.institutionCode || data.tenantCode || '',
        status: data.status || 'pending',
        services: normaliseInstitutionServices(data.licenses?.services || data.services),
        licenses: data.licenses || {},
        coordinator: data.coordinator || null,
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Unable to manage institutional services.' });
  }
}
