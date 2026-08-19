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

function publicStudentRecord(doc, profile, service) {
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
    name: identity.fullName || '',
    preferredName: identity.preferredName || '',
    email: contact.email || '',
    photoURL: identity.photoURL || '',
    dob: identity.dateOfBirth || '',
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
    assignedStaff: doc.data()?.assignedStaff || null,
    riasecCode: profile.career?.riasec?.code || '',
    riasecScores: profile.career?.riasec?.scores || {},
    careerAssessment: doc.data()?.careerAssessment || null,
    assessmentCompletedAt: toIso(doc.data()?.assessmentCompletedAt || doc.data()?.careerAssessment?.completedAt),
    careerReportAccess: doc.data()?.careerReportAccess || null,
    consentStatus: governance.consent || null,
    createdAt: toIso(doc.data()?.createdAt),
    createdAtMs: toMillis(doc.data()?.createdAt),
    updatedAt: toIso(doc.data()?.updatedAt),
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
    const students = snapshot.docs
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(doc => ({ doc, profile: normalizeStudentRecord(doc.data() || {}, doc.id) }))
      .filter(({ profile }) => serviceIsActive(profile, service))
      .map(({ doc, profile }) => publicStudentRecord(doc, profile, service))
      .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    return res.status(200).json({ generatedAt: new Date().toISOString(), service, students, count: students.length });
  } catch (error) {
    console.error('[admin service students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the service student directory.' });
  }
}
