import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { getExistingStudentId } from '../../../src/platform/studentIdentity.js';
import { getAssessmentCode } from '../../../src/platform/adminStudentDirectory.js';

const SERVICE_PATHS = new Set(['career', 'wellbeing', 'sen']);

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

function toIso(value) {
  const millis = toMillis(value);
  return millis == null ? null : new Date(millis).toISOString();
}

function safeAuthError(error) {
  return { code: error?.code || null, message: error?.message || 'Unknown Firebase Auth verification error', expectedProjectId: getAdminApp()?.options?.projectId || null };
}

function serviceIsActive(profile, service) { return profile.services?.[service]?.status === 'active'; }
function isArchived(raw = {}) { return raw.status === 'archived' || raw.lifecycleStatus === 'archived' || Boolean(raw.archivedAt); }

function coreProfileStatus(profile, authUser) {
  const name = String(profile.identity?.fullName || profile.identity?.preferredName || authUser?.displayName || '').trim();
  const email = String(profile.contact?.email || authUser?.email || '').trim();
  const institution = String(profile.institution?.name || profile.academic?.current?.institutionName || '').trim();
  const grade = String(profile.academic?.current?.grade || '').trim();
  const missing = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (!institution) missing.push('institution');
  if (!grade) missing.push('grade');
  return { status: missing.length ? 'incomplete' : 'complete', missing };
}

function publicStudentRecord(doc, profile, service, authUser = null, directoryUsers = new Map()) {
  const raw = doc.data() || {};
  const identity = profile.identity || {};
  const contact = profile.contact || {};
  const academic = profile.academic?.current || {};
  const institution = profile.institution || {};
  const assignments = profile.relationships?.assignments || {};
  const assignedProfessionalId = assignments[service] || null;
  const assignedProfessional = assignedProfessionalId ? directoryUsers.get(assignedProfessionalId) : null;
  const governance = profile.governance || {};
  const profileState = coreProfileStatus(profile, authUser);
  const assessmentCode = getAssessmentCode({ riasecCode: profile.career?.riasec?.code, careerDNA: profile.career?.profile });
  const assessmentStatus = assessmentCode ? 'complete' : 'pending';
  const createdAtMs = toMillis(raw.createdAt);
  const updatedAtMs = toMillis(raw.updatedAt);
  const assignmentStatus = assignedProfessionalId ? 'assigned' : 'unassigned';
  const enrollmentStatus = institution.enrollmentStatus || raw.enrollmentStatus || (isArchived(raw) ? 'inactive' : 'active');
  const needsAttention = Boolean(profileState.status === 'incomplete' || assessmentStatus === 'pending' || assignmentStatus === 'unassigned' || enrollmentStatus === 'inactive');

  return {
    id: doc.id,
    ssStudentId: getExistingStudentId(raw),
    name: identity.fullName || identity.legalName || authUser?.displayName || '',
    preferredName: identity.preferredName || '',
    email: contact.email || authUser?.email || '',
    photoURL: identity.photoURL || '',
    grade: academic.grade || '',
    section: academic.section || '',
    schoolName: academic.institutionName || institution.name || '',
    institutionName: institution.name || academic.institutionName || '',
    institutionId: academic.institutionId || institution.id || '',
    academicYear: academic.academicYear || institution.academicYear || '',
    primary_path: service,
    studentTrack: service,
    path: service,
    profileStatus: profileState.status,
    profileMissing: profileState.missing,
    profileComplete: profileState.status === 'complete',
    onboardingCompleted: profile.onboarding?.completed === true,
    assignmentStatus,
    assignedProfessionalId,
    assignedProfessionalName: assignedProfessional?.name || assignedProfessional?.fullName || '',
    assignedCareerCoachId: assignments.career || null,
    assignedCounsellorId: assignments.wellbeing || null,
    assignedSENEducatorId: assignments.sen || null,
    enrollmentStatus,
    assessmentStatus,
    assessmentCode,
    riasecCode: assessmentCode,
    consentStatus: governance.consent || null,
    createdAt: toIso(raw.createdAt),
    createdAtMs,
    updatedAt: toIso(raw.updatedAt),
    updatedAtMs,
    lastActivityAt: toIso(raw.updatedAt || raw.createdAt),
    lastActivityMs: updatedAtMs || createdAtMs || null,
    needsAttention,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const service = String(req.query?.service || '').trim().toLowerCase();
  if (!SERVICE_PATHS.has(service)) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decodedToken;
  try { decodedToken = await getAdminAuth().verifyIdToken(idToken); }
  catch (error) { console.error('[admin service students auth] Firebase ID token verification failed:', safeAuthError(error)); return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const isFounder = decodedToken.email_verified === true && decodedToken.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decodedToken.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('users').get();
    const directoryUsers = new Map();
    snapshot.docs.forEach(doc => {
      const raw = doc.data() || {};
      const role = String(raw.role || raw.profileType || raw.userRole || '').toLowerCase();
      if (raw.professionalProfile || role.includes('professional') || role.includes('counsellor') || role.includes('psychologist') || role.includes('educator')) {
        directoryUsers.set(doc.id, { id: doc.id, name: raw.name || raw.fullName || raw.professionalProfile?.displayName || '' });
      }
    });

    const studentRecords = snapshot.docs
      .filter(doc => !isArchived(doc.data() || {}))
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(doc => ({ doc, profile: normalizeStudentRecord(doc.data() || {}, doc.id) }))
      .filter(({ profile }) => serviceIsActive(profile, service));

    const students = await Promise.all(studentRecords.map(async ({ doc, profile }) => {
      const needsAuthIdentity = !profile.identity?.fullName || !profile.contact?.email;
      let authUser = null;
      if (needsAuthIdentity) {
        try { authUser = await getAdminAuth().getUser(doc.id); }
        catch (error) { console.warn('[admin service students] auth identity lookup failed:', doc.id, error?.code || error?.message); }
      }
      return publicStudentRecord(doc, profile, service, authUser, directoryUsers);
    }));

    students.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    const institutions = [...new Set(students.map(student => student.institutionName).filter(Boolean))].sort();
    const grades = [...new Set(students.map(student => student.grade).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const counsellors = [...new Set(students.map(student => student.assignedProfessionalName).filter(Boolean))].sort();
    const academicYears = [...new Set(students.map(student => student.academicYear).filter(Boolean))].sort().reverse();

    return res.status(200).json({ generatedAt: new Date().toISOString(), service, students, count: students.length, filters: { institutions, grades, counsellors, academicYears } });
  } catch (error) {
    console.error('[admin service students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the service student directory.' });
  }
}
