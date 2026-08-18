import { getAdminAuth, getAdminDb } from './firebaseAdmin';

/**
 * Server-side authorization for professional access to a student.
 *
 * This is intentionally service-specific. A professional may be assigned to
 * one service while the same student has other protected service domains.
 */
export async function authorizeProfessionalStudent({ req, studentId, service }) {
  if (!studentId) return { authorized: false, reason: 'missing_student_id' };
  if (!['career', 'psychology', 'sen'].includes(service)) {
    return { authorized: false, reason: 'invalid_service' };
  }

  const authHeader = req?.headers?.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { authorized: false, reason: 'missing_auth' };
  }

  const token = authHeader.slice(7);
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch {
    return { authorized: false, reason: 'invalid_auth' };
  }

  const db = getAdminDb();
  const viewerSnap = await db.collection('users').doc(decoded.uid).get();
  const viewer = viewerSnap.exists ? viewerSnap.data() : {};
  const roles = Array.isArray(viewer.roles) ? viewer.roles : (viewer.role ? [viewer.role] : []);
  const isAdmin = roles.some(role => ['admin', 'super_admin', 'superadmin'].includes(String(role).toLowerCase()));

  const studentSnap = await db.collection('students').doc(studentId).get();
  if (!studentSnap.exists) return { authorized: false, reason: 'student_not_found' };
  const student = studentSnap.data() || {};

  if (isAdmin) {
    return { authorized: true, viewerId: decoded.uid, studentId, student, isAdmin: true };
  }

  const assignedStaff = student.assignedStaff || student.assignedProfessionals || {};
  const assignmentKeys = {
    career: ['careerId', 'careerCounsellorId', 'careerCounselorId'],
    psychology: ['psychologistId', 'psychologyId', 'counsellorId', 'counselorId'],
    sen: ['senId', 'senEducatorId', 'specialEducatorId'],
  }[service];

  const assigned = assignmentKeys.some(key => assignedStaff[key] === decoded.uid);
  if (!assigned) {
    return { authorized: false, reason: 'not_assigned' };
  }

  return { authorized: true, viewerId: decoded.uid, studentId, student, isAdmin: false };
}
