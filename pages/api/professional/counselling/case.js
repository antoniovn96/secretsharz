import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveDomainRelationship } from '../../../../src/security/relationshipResolver.js';

function buildStudentProjection(studentId, student = {}) {
  const identity = student.identity || {};
  const academic = student.academic || {};
  const current = academic.current || {};
  const phone = identity.phone || student.phone || null;

  return {
    id: studentId,
    authUid: student.authUid || student.uid || studentId,
    ssStudentId: student.ssStudentId || student.studentId || null,
    name: identity.preferredName || identity.legalName || student.name || null,
    grade: current.grade || student.grade || null,
    section: current.section || student.section || null,
    academicYear: current.academicYear || student.academicYear || null,
    phone: phone ? {
      countryCode: phone.countryCode || phone.country || '',
      number: phone.number || (typeof phone === 'string' ? phone : ''),
    } : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const studentId = String(req.query.studentId || '');
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const db = getAdminFirestore();
    const requesterId = decoded.uid;
    const isAdmin = decoded.role === 'super_admin';
    const relationship = await resolveDomainRelationship({
      db,
      subjectPersonId: studentId,
      relatedPersonId: requesterId,
      domain: 'counselling',
    });

    if (!isAdmin && !relationship.allowed) {
      return res.status(403).json({ error: 'Counselling relationship not authorised' });
    }

    const studentSnap = await db.collection('users').doc(studentId).get();
    if (!studentSnap.exists) return res.status(404).json({ error: 'Student not found' });

    return res.status(200).json({
      student: buildStudentProjection(studentId, studentSnap.data() || {}),
      authorization: {
        source: relationship.source,
        migrationFallback: Boolean(relationship.migrationFallback),
      },
    });
  } catch (error) {
    console.error('Counselling case access error:', error);
    return res.status(401).json({ error: 'Unable to authorise counselling case access' });
  }
}
