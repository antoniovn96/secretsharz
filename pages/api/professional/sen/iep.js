import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { normalizeCanonicalStudent } from '../../../../src/platform/canonicalStudentContract.js';
import { normalizeServiceAssignment } from '../../../../src/platform/serviceAssignmentContract.js';
import { getActiveRelationship } from '../../../../src/security/relationshipStore.js';
import { requireProfessional, sendProfessionalAuthorizationFailure } from '../../../../src/security/professionalAuthorization.js';

function safeString(value, max = 5000) { return String(value || '').trim().slice(0, max); }

async function resolveStudent(db, studentId) {
  const candidates = [db.collection('students').doc(studentId), db.collection('users').doc(studentId)];
  for (const ref of candidates) {
    const snap = await ref.get();
    if (snap.exists) return { ref, data: snap.data() || {} };
  }
  return null;
}

async function isAssignedToSen(db, studentId, student, professionalId) {
  const canonical = await getActiveRelationship({
    db,
    subjectPersonId: studentId,
    relatedPersonId: professionalId,
    type: 'sen_professional',
    domain: 'sen',
  });
  if (canonical) return { allowed: true, source: 'canonical', relationship: canonical };

  // If a canonical SEN relationship exists but is ended, do not resurrect access
  // from legacy fields. This is the critical migration security invariant.
  const canonicalSnapshot = await db.collection('relationships')
    .where('subjectPersonId', '==', studentId)
    .where('relatedPersonId', '==', professionalId)
    .where('type', '==', 'sen_professional')
    .limit(20)
    .get();
  if (!canonicalSnapshot.empty) return { allowed: false, source: 'canonical', relationship: null };

  const raw = student?.relationships?.assignments?.sen;
  const assignment = normalizeServiceAssignment(typeof raw === 'string' ? { primaryProfessionalId: raw } : (raw || {}), 'sen');
  if (assignment.primaryProfessionalId === professionalId || assignment.backupProfessionalId === professionalId || assignment.team.some((member) => member.professionalId === professionalId && member.status === 'active')) {
    return { allowed: true, source: 'legacy-assignment', relationship: null };
  }

  const legacy = student?.assignedStaff || {};
  if (legacy.senId === professionalId || legacy.educatorId === professionalId || student?.assignedSENEducatorId === professionalId) {
    return { allowed: true, source: 'legacy', relationship: null };
  }
  return { allowed: false, source: 'none', relationship: null };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const authorization = await requireProfessional(req, ['educator', 'sen_educator']);
  if (sendProfessionalAuthorizationFailure(res, authorization)) return;
  const decoded = authorization.decodedToken;
  const studentId = String(req.query?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  try {
    const db = getAdminFirestore();
    const resolved = await resolveStudent(db, studentId);
    if (!resolved) return res.status(404).json({ error: 'Student record not found.' });
    const student = resolved.data;
    const isAdmin = decoded.role === 'super_admin';
    const access = isAdmin ? { allowed: true, source: 'admin', relationship: null } : await isAssignedToSen(db, studentId, student, decoded.uid);
    if (!access.allowed) return res.status(403).json({ error: 'This student is not assigned to your SEN professional account.' });

    const canonicalStudent = normalizeCanonicalStudent(student, studentId);
    const responseBase = {
      student: {
        authUid: canonicalStudent.authUid,
        ssStudentId: canonicalStudent.ssStudentId,
        name: canonicalStudent.identity.preferredName || canonicalStudent.identity.legalName || 'Unknown Student',
        schoolName: canonicalStudent.institutionMemberships.find((m) => m.status === 'active')?.institutionName || 'N/A',
        grade: canonicalStudent.academic.current.grade || 'N/A',
        section: canonicalStudent.academic.current.section || '',
      },
    };

    if (req.method === 'GET') {
      const snapshot = await db.collection('sen').doc(studentId).collection('iep_records').orderBy('createdAt', 'desc').limit(20).get();
      return res.status(200).json({ ...responseBase, ieps: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    }

    const body = req.body || {};
    const plop = safeString(body.plop, 10000);
    const goals = Array.isArray(body.goals) ? body.goals.map((goal) => safeString(goal, 1000)).filter(Boolean).slice(0, 30) : [];
    const accommodations = Array.isArray(body.accommodations) ? body.accommodations.map((item) => safeString(item, 300)).filter(Boolean).slice(0, 30) : [];
    if (!plop && !goals.length && !accommodations.length) return res.status(400).json({ error: 'Cannot save an empty IEP.' });

    const relationshipId = access.relationship?.relationshipId || access.relationship?.id || null;
    if (!relationshipId && access.source !== 'admin') return res.status(403).json({ error: 'A canonical SEN professional relationship is required for new IEP records.' });

    const existingSnapshot = await db.collection('sen').doc(studentId).collection('iep_records').where('status', '==', 'active').limit(50).get();
    const nextVersion = existingSnapshot.size + 1;
    const now = new Date().toISOString();
    const recordRef = db.collection('sen').doc(studentId).collection('iep_records').doc();
    const record = {
      iepId: recordRef.id,
      authUid: canonicalStudent.authUid,
      ssStudentId: canonicalStudent.ssStudentId,
      providerId: decoded.uid,
      providerRole: decoded.role,
      relationshipId,
      service: 'sen',
      status: 'active',
      version: nextVersion,
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
