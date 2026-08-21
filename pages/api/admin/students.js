import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
function toMillis(value) {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const parsed = Date.parse(value); return Number.isNaN(parsed) ? null : parsed; }
  return null;
}
function toIso(value) { const millis = toMillis(value); return millis == null ? null : new Date(millis).toISOString(); }
function toDisplayText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(item => toDisplayText(item)).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    for (const key of ['international', 'number', 'name', 'label', 'code', 'value']) if (value[key] != null) return toDisplayText(value[key], fallback);
    try { return JSON.stringify(value); } catch (_) { return fallback; }
  }
  return fallback;
}
function safeAuthError(error) { return { code: error?.code || null, message: error?.message || 'Unknown Firebase Auth verification error', expectedProjectId: getAdminApp()?.options?.projectId || null }; }
function publicStudentRecord(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: toDisplayText(data.name || data.fullName), email: toDisplayText(data.email), photoURL: toDisplayText(data.photoURL),
    role: toDisplayText(data.role), profileType: toDisplayText(data.profileType), age: data.age ?? null,
    dob: toDisplayText(data.dob || data.dateOfBirth), grade: toDisplayText(data.grade || data.gradeOrCourse), schoolName: toDisplayText(data.schoolName),
    institutionName: toDisplayText(data.institutionName), parentName: toDisplayText(data.parentName), parentContact: toDisplayText(data.parentContact),
    contactNumber: toDisplayText(data.contactNumber || data.phone), primary_path: toDisplayText(data.primary_path), studentTrack: toDisplayText(data.studentTrack),
    path: toDisplayText(getStudentPath(data), 'unassigned'), profileComplete: data.profileComplete === true, onboardingCompleted: data.onboardingCompleted === true,
    riasecCode: toDisplayText(data.riasecCode || data.careerDNA?.riasec?.code), riasecScores: data.riasecScores || data.careerDNA?.riasec?.scores || {},
    careerAssessment: data.careerAssessment || null, assessmentCompletedAt: toIso(data.assessmentCompletedAt || data.careerAssessment?.completedAt),
    careerReportAccess: data.careerReportAccess || null, createdAt: toIso(data.createdAt), createdAtMs: toMillis(data.createdAt), updatedAt: toIso(data.updatedAt),
  };
}
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const idToken = bearerToken(req); if (!idToken) return res.status(401).json({ error: 'Authentication required.' });
  let decodedToken;
  try { decodedToken = await getAdminAuth().verifyIdToken(idToken); }
  catch (error) { console.error('[admin students auth] Firebase ID token verification failed:', safeAuthError(error)); return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  const isFounder = decodedToken.email_verified === true && decodedToken.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decodedToken.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });
  try {
    const snapshot = await getAdminFirestore().collection('users').get();
    const students = snapshot.docs.filter(doc => isStudentProfile(doc.data() || {})).map(publicStudentRecord).sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
    return res.status(200).json({ generatedAt: new Date().toISOString(), students, count: students.length, partial: false });
  } catch (error) {
    console.error('[admin students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the student directory.', students: [], partial: false });
  }
}
