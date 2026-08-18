// Privileged Super Admin endpoint for assigning a professional to institutions.
// Institution membership is distinct from professional account creation and
// is also constrained by the institution's purchased service entitlements.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isRequesterAdmin } from '../../../src/security/roleAssignment.js';

const ROLE_SERVICE = Object.freeze({
  career_counsellor: 'career',
  psychologist: 'wellbeing',
  counsellor: 'wellbeing',
  educator: 'sen'
});

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function cleanIds(value) {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))];
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let requester;
  try {
    requester = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  if (!isRequesterAdmin(requester)) {
    return res.status(403).json({ error: 'Only an administrator may assign professional institutions.' });
  }

  const professionalUid = typeof req.body?.professionalUid === 'string' ? req.body.professionalUid.trim() : '';
  const institutionIds = cleanIds(req.body?.institutionIds);
  if (!professionalUid || !institutionIds) {
    return res.status(400).json({ error: 'professionalUid and institutionIds are required.' });
  }

  const firestore = getAdminFirestore();
  try {
    const professionalRef = firestore.collection('users').doc(professionalUid);
    const professionalSnap = await professionalRef.get();
    if (!professionalSnap.exists) return res.status(404).json({ error: 'Professional account not found.' });

    const professional = professionalSnap.data() || {};
    const role = professional.role || professional.professionalRole;
    const service = ROLE_SERVICE[role];
    if (!service) return res.status(400).json({ error: 'This account is not an assignable professional.' });

    const institutionDocs = await Promise.all(institutionIds.map(id => firestore.collection('institutions').doc(id).get()));
    const missing = institutionDocs.filter(snapshot => !snapshot.exists).map(snapshot => snapshot.id);
    if (missing.length) return res.status(404).json({ error: `Institution not found: ${missing.join(', ')}` });

    const withoutEntitlement = institutionDocs.filter(snapshot => {
      const data = snapshot.data() || {};
      const services = Array.isArray(data.services) ? data.services : [];
      return !services.includes(service);
    }).map(snapshot => snapshot.id);

    if (withoutEntitlement.length) {
      return res.status(409).json({
        error: `Professional cannot be assigned to institutions without the ${service} service entitlement.`,
        institutionIds: withoutEntitlement
      });
    }

    await professionalRef.update({
      institutionIds,
      professionalService: service,
      updatedAt: new Date()
    });

    await firestore.collection('auditEvents').add({
      actorUid: requester.uid || null,
      actorEmail: requester.email || null,
      targetUid: professionalUid,
      action: 'assign_professional_institutions',
      service,
      institutionIds,
      timestamp: new Date()
    });

    return res.status(200).json({ success: true, professionalUid, service, institutionIds });
  } catch (error) {
    console.error('[assign-professional-institutions] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to assign professional institutions.' });
  }
}
