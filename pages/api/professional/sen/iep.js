import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { normalizeServiceAssignment } from '../../../../src/platform/serviceAssignmentContract.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeString(value, max = 5000) { return String(value || '').trim().slice(0, max); }
function isProfessionalRole(role) { return ['educator', 'sen_educator', 'super_admin'].includes(String(role || '').toLowerCase()); }

function isAssignedToSen(student, professionalId) {
  const raw = student?.relationships?.assignments?.sen;
  const assignment = normalizeServiceAssignment(
    typeof raw === 'string' ? { primaryProfessionalId: raw } : (raw || {}),
    'sen'
  );
  if (assignment.primaryProfessionalId === professionalId || assignment.backupProfessionalId === professionalId) return true;
  if (assignment.team.some((member) => member.professionalId === professionalId && member.status === 'active')) return true;

  const legacy = student?.assignedStaff || {};
  return legacy.senId === professionalId || legacy.educatorId === professionalId || student?.assignedSENEducatorId === professionalId;
}

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
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  try {
    const db = getAdminFirestore();
    const studentRef = db.collection('users').doc(studentId);
    const studentSnap = await studentRef.get();
    if (!studentSnap.exists) return res.status(404).json({ error: 'Student record not found.' });

    const student = studentSnap.data() || {};
    const isAdmin = decoded.role === 'super_admin';
    if (!isAdmin && !isAssignedToSen(student, decoded.uid)) {
      return res.status(403).json({ error: 'This student is not assigned to your SEN professional account.' });
    }

    const identity = student.identity || {};
    const academic = student.academic?.current || {};
    const responseBase = {
      student: {
        authUid: studentId,
        ssStudentId: student.ssStudentId || student.identity?.ssStudentId || student.studentId || '',
        name: identity.fullName || student.name || 'Unknown Student',
        schoolName: academic.institutionName || student.institutionName || student.schoolName || 'N/A',
        grade: academic.grade || student.grade || 'N/A',
        section: academic.section || student.section || '',
      },
    };

    if (req.method === 'GET') {
      const snapshot = await db.collection('sen').doc(studentId).collection('iep_records').orderBy('createdAt', 'desc').limit(20).get();
      return res.status(200).json({
        ...responseBase,
        ieps: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      });
    }

    const body = req.body || {};
    const plop = safeString(body.plop, 10000);
    const goals = Array.isArray(body.goals) ? body.goals.map((goal) => safeString(goal, 1000)).filter(Boolean).slice(0, 30) : [];
    const accommodations = Array.isArray(body.accommodations) ? body.accommodations.map((item) => safeString(item, 300)).filter(Boolean).slice(0, 30) : [];
    if (!plop && !goals.length && !accommodations.length) return res.status(400).json({ error: 'Cannot save an empty IEP.' });

    const now = new Date().toISOString();
    const recordRef = db.collection('sen').doc(studentId).collection('iep_records').doc();
    const record = {
      iepId: recordRef.id,
      authUid: studentId,
      ssStudentId: responseBase.student.ssStudentId,
      providerId: decoded.uid,
      providerRole: decoded.role,
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
    return res.status(500).json({ error: 'Unable to complete the SEN IEP request.' });
  }
}
