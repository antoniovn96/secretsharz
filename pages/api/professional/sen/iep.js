import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveStudentDocumentRef } from '../../../../src/security/studentDocumentRef.js';
import { resolveCanonicalProfessionalAssignment } from '../../../../src/security/canonicalProfessionalAssignment.js';
import { requireServiceConsent, CONSENT_TYPES } from '../../../../src/security/consentResolver.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeString(value, max = 5000) { return String(value || '').trim().slice(0, max); }
function isProfessionalRole(role) { return ['educator', 'sen_educator', 'super_admin'].includes(String(role || '').toLowerCase()); }

async function authenticate(req, res) {
  const token = bearerToken(req);
  if (!token) { res.status(401).json({ error: 'Authentication required.' }); return null; }
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); } catch (_) { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; }
  if (!isProfessionalRole(decoded.role)) { res.status(403).json({ error: 'SEN professional access required.' }); return null; }
  return decoded;
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const decoded = await authenticate(req, res);
  if (!decoded) return;

  const studentId = String(req.query?.studentId || '').trim();
  const institutionId = String(req.query?.institutionId || '').trim() || null;
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  try {
    const db = getAdminFirestore();
    const identityRef = await resolveStudentDocumentRef({ db, authUid: studentId, ssStudentId: studentId });
    const isAdmin = decoded.role === 'super_admin';
    const assignment = isAdmin ? { found: false, assignment: null } : await resolveCanonicalProfessionalAssignment({
      db,
      studentId: identityRef.authUid || identityRef.ssStudentId,
      professionalId: decoded.uid,
      service: 'sen',
      institutionId,
    });
    if (!isAdmin && !assignment.found) return res.status(403).json({ error: 'This student is not assigned to your SEN professional account.' });
    if (!isAdmin) await requireServiceConsent({ db, userId: identityRef.authUid || identityRef.ssStudentId, serviceType: CONSENT_TYPES.SEN });

    const studentSnap = await identityRef.ref.get();
    if (!studentSnap.exists) return res.status(404).json({ error: 'Student record not found.' });
    const student = studentSnap.data() || {};
    const identity = student.identity || {};
    const academic = student.academic?.current || {};
    const ssStudentId = identityRef.ssStudentId || student.ssStudentId || identity.ssStudentId || student.studentId || '';
    const responseBase = {
      student: {
        authUid: identityRef.authUid,
        studentDocumentId: identityRef.documentId,
        ssStudentId,
        name: identity.fullName || student.name || student.fullName || 'Unknown Student',
        schoolName: academic.institutionName || student.institutionName || student.schoolName || 'N/A',
        grade: academic.grade || student.grade || 'N/A',
        section: academic.section || student.section || '',
      },
      institution: { id: institutionId || academic.institutionId || student.institutionId || null },
      assignment: assignment.found ? assignment.assignment : null,
    };

    if (req.method === 'GET') {
      const snapshot = await identityRef.ref.collection('sen_iep_records').orderBy('createdAt', 'desc').limit(20).get();
      return res.status(200).json({ ...responseBase, ieps: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    }

    const body = req.body || {};
    const plop = safeString(body.plop, 10000);
    const goals = Array.isArray(body.goals) ? body.goals.map((goal) => safeString(goal, 1000)).filter(Boolean).slice(0, 30) : [];
    const accommodations = Array.isArray(body.accommodations) ? body.accommodations.map((item) => safeString(item, 300)).filter(Boolean).slice(0, 30) : [];
    if (!plop && !goals.length && !accommodations.length) return res.status(400).json({ error: 'Cannot save an empty IEP.' });

    const now = new Date().toISOString();
    const recordRef = identityRef.ref.collection('sen_iep_records').doc();
    const record = {
      iepId: recordRef.id,
      authUid: identityRef.authUid,
      ssStudentId,
      studentDocumentId: identityRef.documentId,
      providerId: decoded.uid,
      providerRole: decoded.role,
      institutionId: institutionId || academic.institutionId || student.institutionId || null,
      assignmentId: assignment.assignment?.id || null,
      assignmentSlot: assignment.assignment?.slot || null,
      status: 'active',
      version: 1,
      plop,
      goals,
      accommodations,
      createdAt: now,
      updatedAt: now,
    };

    await recordRef.set(record);
    return res.status(201).json({ saved: true, record });
  } catch (error) {
    console.error('[professional/sen/iep] failed:', error?.message || error);
    const status = /identity|assignment|consent|access|required|not assigned/i.test(error?.message || '') ? 403 : 500;
    return res.status(status).json({ error: error?.message || 'Unable to complete the SEN IEP request.' });
  }
}
