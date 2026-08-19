import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { getActiveRelationship } from '../../../../src/security/relationshipStore.js';
import { normalizeCanonicalStudent } from '../../../../src/platform/canonicalStudentContract.js';
import { normalizeRelease, releaseMatches } from '../../../../src/security/releaseAuthority.js';

function bearer(req) { const h = req.headers.authorization || ''; const m = h.match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function authenticate(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }
async function loadStudent(db, studentId) { for (const collection of ['students', 'users']) { const snap = await db.collection(collection).doc(studentId).get(); if (snap.exists) return snap.data() || {}; } return null; }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const decoded = await authenticate(req, res); if (!decoded) return;
  const studentId = String(req.query.studentId || '').trim(); if (!studentId) return res.status(400).json({ error: 'studentId is required.' });
  try {
    const db = getAdminFirestore();
    const relationship = await getActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: decoded.uid, type: 'guardian', domain: 'family' }) || await getActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: decoded.uid, type: 'parent', domain: 'family' });
    if (!relationship) return res.status(403).json({ error: 'Active guardian relationship required.' });
    const raw = await loadStudent(db, studentId); if (!raw) return res.status(404).json({ error: 'Student not found.' });
    const student = normalizeCanonicalStudent(raw, raw.authUid || raw.uid || studentId);
    const snap = await db.collection('sharing_releases').where('studentAuthUid', '==', student.authUid).where('audience', '==', 'PARENT').limit(100).get();
    const releases = snap.docs.map((doc) => normalizeRelease({ id: doc.id, ...doc.data() }));
    const projection = {
      student: {
        authUid: student.authUid,
        ssStudentId: student.ssStudentId,
        name: student.identity.preferredName || student.identity.legalName,
        grade: student.academic.current.grade,
        section: student.academic.current.section,
        institutions: student.institutionMemberships.filter((m) => m.status === 'active').map((m) => ({ institutionId: m.institutionId, institutionName: m.institutionName })),
      },
      career: null,
      sen: null,
      wellbeing: null,
    };
    for (const release of releases) {
      if (!releaseMatches({ release, studentAuthUid: student.authUid, ssStudentId: student.ssStudentId, audience: 'PARENT' })) continue;
      if (release.service === 'career_guidance') projection.career = { released: true, scope: release.scope };
      if (release.service === 'sen') projection.sen = { released: true, scope: release.scope };
      if (release.service === 'wellbeing') projection.wellbeing = { released: true, scope: release.scope };
    }
    return res.status(200).json(projection);
  } catch (error) { console.error('[parent/student] failed:', error?.message || error); return res.status(500).json({ error: 'Unable to load parent student projection.' }); }
}
