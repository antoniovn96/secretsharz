import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

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
  return {
    code: error?.code || null,
    message: error?.message || 'Unknown Firebase Auth verification error',
    expectedProjectId: getAdminApp()?.options?.projectId || null,
  };
}

function getAssignedProfessionalId(data, service) {
  const assignedStaff = data?.assignedStaff || {};
  const serviceKey = String(service || '').trim().toLowerCase();
  if (serviceKey === 'career') return assignedStaff.careerId || data.assignedCounsellorId || data.assignedProfessionalId || null;
  if (serviceKey === 'wellbeing') return assignedStaff.psychologistId || assignedStaff.psychologyId || data.assignedCounsellorId || data.assignedProfessionalId || null;
  if (serviceKey === 'sen') return assignedStaff.senId || assignedStaff.educatorId || data.assignedCounsellorId || data.assignedProfessionalId || null;
  return data.assignedProfessionalId || data.assignedCounsellorId || null;
}

function publicStudentRecord(doc) {
  const data = doc.data() || {};
  const path = getStudentPath(data);
  const assignedProfessionalId = getAssignedProfessionalId(data, path);
  const parentUid = data.parentUid || data.parentId || data.parent?.uid || null;

  return {
    id: doc.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    photoURL: data.photoURL || '',
    role: data.role || '',
    profileType: data.profileType || '',
    age: data.age ?? null,
    dob: data.dob || data.dateOfBirth || '',
    grade: data.grade || data.gradeOrCourse || '',
    schoolName: data.schoolName || '',
    institutionName: data.institutionName || '',
    institutionId: data.institutionId || data.institutionID || '',
    parentName: data.parentName || '',
    parentContact: data.parentContact || '',
    parentUid,
    parentId: parentUid,
    contactNumber: data.contactNumber || data.phone || '',
    primary_path: data.primary_path || '',
    studentTrack: data.studentTrack || '',
    path,
    profileComplete: data.profileComplete === true,
    onboardingCompleted: data.onboardingCompleted === true,
    assignedProfessionalId,
    assignedCounsellorId: String(path || '').toLowerCase() === 'career' ? assignedProfessionalId : (data.assignedCounsellorId || null),
    assignedStaff: data.assignedStaff || null,
    riasecCode: data.riasecCode || data.careerDNA?.riasec?.code || '',
    riasecScores: data.riasecScores || data.careerDNA?.riasec?.scores || {},
    careerAssessment: data.careerAssessment || null,
    assessmentCompletedAt: toIso(data.assessmentCompletedAt || data.careerAssessment?.completedAt),
    careerReportAccess: data.careerReportAccess || null,
    createdAt: toIso(data.createdAt),
    createdAtMs: toMillis(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const service = String(req.query?.service || '').trim().toLowerCase();
  if (!SERVICE_PATHS.has(service)) {
    return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });
  }

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
      .filter(doc => {
        const data = doc.data() || {};
        return isStudentProfile(data) && String(getStudentPath(data) || '').toLowerCase() === service;
      })
      .map(publicStudentRecord)
      .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    return res.status(200).json({ generatedAt: new Date().toISOString(), service, students, count: students.length });
  } catch (error) {
    console.error('[admin service students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the service student directory.' });
  }
}
