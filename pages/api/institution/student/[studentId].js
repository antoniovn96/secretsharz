import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { getActiveInstitutionMembership } from '../../../../src/security/institutionMembershipAuthority.js';
import { normalizeCanonicalStudent } from '../../../../src/platform/canonicalStudentContract.js';
import { normalizeRelease, releaseMatches } from '../../../../src/security/releaseAuthority.js';

function bearer(req) { const h = req.headers.authorization || ''; const m = h.match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function authenticate(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }
async function loadStudent(db, studentId) { for (const collection of ['students', 'users']) { const snap = await db.collection(collection).doc(studentId).get(); if (snap.exists) return snap.data() || {}; } return null; }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const decoded = await authenticate(req, res); if (!decoded) return;
  const studentId = String(req.query.studentId || '').trim();
  const institutionId = String(req.query.institutionId || decoded.institutionId || decoded.institution?.id || '').trim();
  if (!studentId || !institutionId) return res.status(400).json({ error: 'studentId and institutionId are required.' });
  try {
    const db = getAdminFirestore();
    const membership = decoded.role === 'super_admin' ? { institutionId, role: 'super_admin', status: 'active' } : await getActiveInstitutionMembership({ db, studentAuthUid: studentId, institutionUserUid: decoded.uid, institutionId });
    if (!membership) return res.status(403).json({ error: 'Active institution membership required.' });
    const raw = await loadStudent(db, studentId); if (!raw) return res.status(404).json({ error: 'Student not found.' });
    const student = normalizeCanonicalStudent(raw, raw.authUid || raw.uid || studentId);
    const snap = await db.collection('sharing_releases').where('studentAuthUid', '==', student.authUid).where('audience', '==', 'INSTITUTION').limit(100).get();
    const releases = snap.docs.map(doc => normalizeRelease({ id: doc.id, ...doc.data() }));
    const projection = {
      student: {
        authUid: student.authUid,
        ssStudentId: student.ssStudentId,
        name: student.identity.preferredName || student.identity.legalName,
        grade: student.academic.current.grade,
        section: student.academic.current.section,
        institutionId,
      },
      career: null,
      sen: null,
      wellbeing: null,
    };
    for (const release of releases) {
      if (!releaseMatches({ release, studentAuthUid: student.authUid, ssStudentId: student.ssStudentId, audience: 'INSTITUTION', institutionId })) continue;
      if (release.service === 'career_guidance') projection.career = { released: true, scope: release.scope };
      if (release.service === 'sen') projection.sen = { released: true, scope: release.scope };
      if (release.service === 'wellbeing') projection.wellbeing = { released: true, scope: release.scope };
    }
    return res.status(200).json(projection);
  } catch (error) { console.error('[institution/student] failed:', error?.message || error); return res.status(500).json({ error: 'Unable to load institution student projection.' }); }
}
