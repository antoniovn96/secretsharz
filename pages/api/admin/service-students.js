import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';

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
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function toIso(value) {
  const millis = toMillis(value);
  return millis == null ? null : new Date(millis).toISOString();
}

function safeAuthError(error) {
  return { code: error?.code || null, message: error?.message || 'Unknown Firebase Auth verification error', expectedProjectId: getAdminApp()?.options?.projectId || null };
}

function serviceIsActive(profile, service) {
  return profile.services?.[service]?.status === 'active';
}

function existingStudentId(raw) {
  const candidates = [
    raw?.ssStudentId,
    raw?.studentId,
    raw?.studentProfile?.identity?.ssStudentId,
    raw?.studentProfile?.ssStudentId,
    raw?.identity?.ssStudentId,
  ];
  const value = candidates.find(candidate => typeof candidate === 'string' && /^SS-STD-\d{6,}$/.test(candidate.trim()));
  return value ? value.trim() : null;
}

function publicStudentRecord(doc, profile, service, authUser = null) {
  const raw = doc.data() || {};
  const identity = profile.identity || {};
  const contact = profile.contact || {};
  const academic = profile.academic?.current || {};
  const institution = profile.institution || {};
  const guardians = profile.family?.guardians || [];
  const primaryGuardian = guardians.find((guardian) => guardian?.accountId) || guardians[0] || {};
  const assignments = profile.relationships?.assignments || {};
  const assignedProfessionalId = assignments[service] || null;
  const governance = profile.governance || {};

  return {
    id: doc.id,
    ssStudentId: existingStudentId(raw),
    name: identity.fullName || identity.legalName || authUser?.displayName || '',
    preferredName: identity.preferredName || '',
    email: contact.email || authUser?.email || '',
    photoURL: identity.photoURL || '',
    dob: identity.dateOfBirth || '',
    gender: identity.gender || '',
    grade: academic.grade || '',
    section: academic.section || '',
    schoolName: academic.institutionName || institution.name || '',
    institutionName: institution.name || academic.institutionName || '',
    institutionId: academic.institutionId || institution.id || '',
    academicYear: academic.academicYear || institution.academicYear || '',
    parentName: primaryGuardian.name || '',
    parentContact: primaryGuardian.phone || '',
    parentEmail: primaryGuardian.email || '',
    parentUid: primaryGuardian.accountId || null,
    parentId: primaryGuardian.accountId || null,
    contactNumber: contact.mobile?.number || '',
    primary_path: profile.legacy?.primary_path || service,
    studentTrack: service,
    path: service,
    profileComplete: profile.onboarding?.profileComplete === true,
    onboardingCompleted: profile.onboarding?.completed === true,
    assignedProfessionalId,
    assignedCounsellorId: service === 'career' ? assignedProfessionalId : (assignments.wellbeing || null),
    assignedCareerCoachId: assignments.career || null,
    assignedSENEducatorId: assignments.sen || null,
    assignedStaff: raw?.assignedStaff || null,
    riasecCode: profile.career?.riasec?.code || '',
    riasecScores: profile.career?.riasec?.scores || {},
    careerAssessment: raw?.careerAssessment || null,
    assessmentCompletedAt: toIso(raw?.assessmentCompletedAt || raw?.careerAssessment?.completedAt),
    careerReportAccess: raw?.careerReportAccess || null,
    consentStatus: governance.consent || null,
    createdAt: toIso(raw?.createdAt),
    createdAtMs: toMillis(raw?.createdAt),
    updatedAt: toIso(raw?.updatedAt),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const service = String(req.query?.service || '').trim().toLowerCase();
  if (!SERVICE_PATHS.has(service)) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[admin service students auth] Firebase ID token verification failed:', safeAuthError(error));
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const isFounder = decodedToken.email_verified === true && decodedToken.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decodedToken.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  try {
    const snapshot = await getAdminFirestore().collection('users').get();
    const studentRecords = snapshot.docs
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(doc => ({ doc, profile: normalizeStudentRecord(doc.data() || {}, doc.id) }))
      .filter(({ profile }) => serviceIsActive(profile, service));

    const students = await Promise.all(studentRecords.map(async ({ doc, profile }) => {
      const raw = doc.data() || {};
      const needsAuthIdentity = !profile.identity?.fullName || !profile.contact?.email;
      let authUser = null;
      if (needsAuthIdentity) {
        try {
          authUser = await getAdminAuth().getUser(doc.id);
        } catch (error) {
          console.warn('[admin service students] auth identity lookup failed:', doc.id, error?.code || error?.message);
        }
      }
      return publicStudentRecord(doc, profile, service, authUser);
    }));

    students.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    return res.status(200).json({ generatedAt: new Date().toISOString(), service, students, count: students.length });
  } catch (error) {
    console.error('[admin service students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the service student directory.' });
  }
}
