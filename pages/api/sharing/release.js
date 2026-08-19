import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeRelease, assertReleaseScope } from '../../../src/security/releaseAuthority.js';
import { canCreateRelease, canRevokeRelease, isClinicalScope } from '../../../src/security/releaseCreatorPolicy.js';
import { getActiveRelationship } from '../../../src/security/relationshipStore.js';

function token(req) { const h = req.headers.authorization || ''; const m = h.match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function auth(req, res) { const t = token(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }

function roleService(role) { return ({ career_counsellor: 'career_guidance', sen_educator: 'sen', psychologist: 'wellbeing' })[role] || null; }

async function resolveStudent(db, studentId) {
  for (const collection of ['students', 'users']) { const snap = await db.collection(collection).doc(studentId).get(); if (snap.exists) return { ref: snap.ref, data: snap.data() || {} }; }
  return null;
}

async function authorizeServiceRelationship(db, decoded, studentId, service) {
  const type = service === 'career_guidance' ? 'career_professional' : service === 'sen' ? 'sen_professional' : 'wellbeing_professional';
  return getActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: decoded.uid, type, domain: service === 'career_guidance' ? 'career' : service });
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) { res.setHeader('Allow', 'GET, POST, DELETE'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const decoded = await auth(req, res); if (!decoded) return;
  const db = getAdminFirestore();
  const studentId = String(req.query?.studentId || req.body?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  try {
    const student = await resolveStudent(db, studentId);
    if (!student) return res.status(404).json({ error: 'Student record not found.' });

    if (req.method === 'GET') {
      const audience = String(req.query?.audience || '').toUpperCase();
      const service = String(req.query?.service || '').toLowerCase();
      const purpose = String(req.query?.purpose || '').toLowerCase();
      const snap = await db.collection('sharing_releases').where('studentAuthUid', '==', student.data.authUid || studentId).limit(100).get();
      const releases = snap.docs.map((d) => normalizeRelease({ id: d.id, ...d.data() })).filter((r) => (!audience || r.audience === audience) && (!service || r.service === service) && (!purpose || r.purpose === purpose));
      return res.status(200).json({ releases });
    }

    if (req.method === 'DELETE') {
      const releaseId = String(req.query?.releaseId || req.body?.releaseId || '').trim();
      if (!releaseId) return res.status(400).json({ error: 'releaseId is required.' });
      const ref = db.collection('sharing_releases').doc(releaseId);
      const snap = await ref.get(); if (!snap.exists) return res.status(404).json({ error: 'Release not found.' });
      const release = normalizeRelease({ id: snap.id, ...snap.data() });
      if (release.studentAuthUid !== String(student.data.authUid || studentId)) return res.status(403).json({ error: 'Release does not belong to this student.' });
      const relationship = decoded.role === 'super_admin' ? true : await authorizeServiceRelationship(db, decoded, studentId, release.service);
      if (!canRevokeRelease({ role: decoded.role, release, relationshipAuthorized: Boolean(relationship), institutionId: decoded.institutionId || decoded.institution?.id })) return res.status(403).json({ error: 'Not authorized to revoke this release.' });
      await ref.update({ status: 'REVOKED', revokedAt: new Date().toISOString(), revokedBy: decoded.uid });
      return res.status(200).json({ revoked: true, releaseId });
    }

    const body = req.body || {};
    const service = String(body.service || '').toLowerCase();
    const purpose = String(body.purpose || '').toLowerCase();
    const audience = String(body.audience || '').toUpperCase();
    const scope = String(body.scope || '').trim();
    const institutionId = body.institutionId ? String(body.institutionId) : null;
    assertReleaseScope({ service, purpose, audience });
    if (isClinicalScope(scope)) return res.status(403).json({ error: 'Clinical/private scopes cannot be released through this API.' });

    const relationship = await authorizeServiceRelationship(db, decoded, studentId, service);
    const allowed = canCreateRelease({ role: decoded.role, service, purpose, audience, scope, relationshipAuthorized: Boolean(relationship), institutionId: decoded.institutionId || decoded.institution?.id, targetInstitutionId: institutionId });
    if (!allowed) return res.status(403).json({ error: 'Not authorized to create this service release.' });

    const releaseRef = db.collection('sharing_releases').doc();
    const release = {
      releaseId: releaseRef.id,
      studentAuthUid: student.data.authUid || studentId,
      ssStudentId: student.data.ssStudentId || student.data.studentId || studentId,
      service, purpose, audience, scope, institutionId,
      releasedBy: decoded.uid,
      relationshipId: relationship?.relationshipId || relationship?.id || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    await releaseRef.set(release);
    return res.status(201).json({ release: normalizeRelease(release) });
  } catch (error) {
    const status = /required|unsupported/i.test(error?.message || '') ? 400 : 500;
    return res.status(status).json({ error: status === 400 ? error.message : 'Unable to complete release request.' });
  }
}
