import { getAdminAuth, getAdminFirestore } from './firebaseAdmin.js';
import normalizeStudentRecord from '../platform/studentRecordNormalizer.js';

const SERVICE_ROLES = Object.freeze({
  career: new Set(['career_counsellor', 'career_counselor']),
  psychology: new Set(['psychologist', 'clinical_psychologist', 'counsellor', 'counselor', 'counselling_psychologist']),
  sen: new Set(['sen_educator', 'educator']),
});

/** Server-side authorization for professional access to a student. Canonical assignments are authoritative; legacy assignments are migration fallback only. */
export async function authorizeProfessionalStudent({ req, studentId, service }) {
  if (!studentId) return { authorized: false, reason: 'missing_student_id' };
  if (!SERVICE_ROLES[service]) return { authorized: false, reason: 'invalid_service' };
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) return { authorized: false, reason: 'missing_auth' };
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7)); } catch { return { authorized: false, reason: 'invalid_auth' }; }

  // Administrative identity is not professional case authorization.
  // Super Admin operations must use explicit administrative endpoints/scopes.
  const role = String(decoded.role || '').toLowerCase();
  if (!SERVICE_ROLES[service].has(role)) return { authorized: false, reason: 'professional_role_required' };

  const db = getAdminFirestore();
  let studentSnap = await db.collection('students').doc(studentId).get();
  if (!studentSnap.exists) studentSnap = await db.collection('users').doc(studentId).get();
  if (!studentSnap.exists) return { authorized: false, reason: 'student_not_found' };
  const student = studentSnap.data() || {};

  const canonical = normalizeStudentRecord(student, studentId);
  const assignmentKey = service === 'psychology' ? 'wellbeing' : service;
  const canonicalAssignment = canonical.relationships?.assignments?.[assignmentKey];
  const canonicalService = canonical.services?.[assignmentKey];

  // Canonical assignment/service state is authoritative. A stale legacy assignment must never restore access.
  if (canonicalAssignment || canonicalService?.status === 'active') {
    if (canonicalService?.status !== 'active') return { authorized: false, reason: 'service_inactive' };
    if (canonicalAssignment !== decoded.uid) return { authorized: false, reason: 'not_assigned' };
    return { authorized: true, viewerId: decoded.uid, studentId, student, isAdmin: false };
  }

  const assignedStaff = student.assignedStaff || student.assignedProfessionals || {};
  const assignmentKeys = {
    career: ['careerId', 'careerCounsellorId', 'careerCounselorId'],
    psychology: ['psychologistId', 'psychologyId', 'counsellorId', 'counselorId'],
    sen: ['senId', 'senEducatorId', 'specialEducatorId'],
  }[service];
  if (!assignmentKeys.some(key => assignedStaff[key] === decoded.uid)) return { authorized: false, reason: 'not_assigned' };
  return { authorized: true, viewerId: decoded.uid, studentId, student, isAdmin: false };
}
