import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import resolveStudentProfile from '../../../src/platform/studentProfileResolver.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { getExistingStudentId } from '../../../src/platform/studentIdentity.js';
import { getAssessmentCode } from '../../../src/platform/adminStudentDirectory.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isCareerDirectoryRequest(req) {
  return String(req.query?.service || '').trim().toLowerCase() === 'career';
}

async function getReferencedDocument(db, collectionName, id) {
  if (!id) return null;
  const snapshot = await db.collection(collectionName).doc(String(id)).get();
  return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
}

function buildCareerDetail(rawStudent, studentId, professional = null, institution = null) {
  const profile = normalizeStudentRecord(rawStudent, studentId);
  const identity = profile.identity || {};
  const academic = profile.academic?.current || {};
  const assignments = profile.relationships?.assignments || {};
  const assignedProfessionalId = typeof assignments.career === 'string' ? assignments.career : null;
  const assessmentCode = getAssessmentCode({
    careerAssessment: rawStudent.careerAssessment,
    riasecCode: profile.career?.riasec?.code,
    careerDNA: profile.career?.profile,
  });
  const missing = [];
  if (!String(identity.fullName || '').trim()) missing.push('name');
  if (!String(profile.contact?.email || '').trim()) missing.push('email');
  if (!String(academic.institutionName || profile.institution?.name || '').trim() && !institution?.name) missing.push('institution');
  if (!String(academic.grade || '').trim()) missing.push('grade');

  return {
    id: studentId,
    authUid: studentId,
    ssStudentId: getExistingStudentId(rawStudent),
    name: identity.fullName || '',
    email: profile.contact?.email || '',
    identity: {
      fullName: identity.fullName || '',
      preferredName: identity.preferredName || '',
      photoURL: identity.photoURL || '',
      city: identity.city || '',
    },
    contact: { email: profile.contact?.email || '' },
    institution: {
      id: institution?.id || profile.institution?.id || academic.institutionId || '',
      name: institution?.name || profile.institution?.name || academic.institutionName || '',
      academicYear: institution?.academicYear || profile.institution?.academicYear || academic.academicYear || '',
      enrollmentStatus: institution?.enrollmentStatus || profile.institution?.enrollmentStatus || rawStudent.enrollmentStatus || 'active',
    },
    academic: {
      grade: academic.grade || '',
      section: academic.section || '',
      curriculum: academic.curriculum || '',
      stream: academic.stream || '',
      subjects: Array.isArray(academic.subjects) ? academic.subjects : [],
    },
    service: 'career',
    assignment: {
      status: assignedProfessionalId ? 'assigned' : 'unassigned',
      professionalId: assignedProfessionalId,
      professionalName: professional?.name || professional?.fullName || professional?.displayName || '',
    },
    guardians: {
      count: profile.family?.guardians?.length || 0,
      relationships: (profile.family?.guardians || []).map(guardian => ({
        relationship: guardian.relationship || 'guardian',
        name: guardian.name || '',
        consentStatus: guardian.consentStatus || null,
      })),
    },
    assessment: {
      status: assessmentCode ? 'complete' : 'pending',
      riasecCode: assessmentCode,
      riasecScores: profile.career?.riasec?.scores || {},
      completedAt: rawStudent.assessmentCompletedAt || rawStudent.careerAssessment?.completedAt || null,
      reportAccess: rawStudent.careerReportAccess || null,
    },
    profile: {
      status: missing.length ? 'incomplete' : 'complete',
      missing,
      onboardingCompleted: profile.onboarding?.completed === true,
    },
    governance: {
      consent: profile.governance?.consent || null,
      createdAt: profile.governance?.createdAt || null,
      updatedAt: profile.governance?.updatedAt || null,
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const studentId = String(req.query?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let viewer;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    viewer = {
      id: decoded.uid,
      uid: decoded.uid,
      role: decoded.role || decoded.userRole || decoded.profileType,
      profileType: decoded.profileType,
      institutionId: decoded.institutionId || decoded.institutionID,
      isFounder: decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com',
    };
  } catch (error) {
    console.error('[student-detail] token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('users').doc(studentId).get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });
    const rawStudent = { id: snapshot.id, ...snapshot.data() };

    if (isCareerDirectoryRequest(req)) {
      if (viewer.role !== 'super_admin' && !viewer.isFounder) return res.status(403).json({ error: 'Super Admin access required for the career directory detail.' });

      const normalized = normalizeStudentRecord(rawStudent, studentId);
      const assignedProfessionalId = typeof normalized.relationships?.assignments?.career === 'string' ? normalized.relationships.assignments.career : null;
      const institutionId = normalized.academic?.current?.institutionId || normalized.institution?.id || null;
      const [professionalUser, professionalProfile, institution] = await Promise.all([
        getReferencedDocument(db, 'users', assignedProfessionalId),
        getReferencedDocument(db, 'professionals', assignedProfessionalId),
        getReferencedDocument(db, 'institutions', institutionId),
      ]);

      const professional = {
        ...(professionalProfile || {}),
        ...(professionalUser || {}),
        name: professionalUser?.name || professionalUser?.fullName || professionalProfile?.displayName || professionalProfile?.name || '',
      };
      return res.status(200).json({
        studentId,
        profile: buildCareerDetail(rawStudent, studentId, assignedProfessionalId ? professional : null, institution),
      });
    }

    const resolved = resolveStudentProfile(rawStudent, viewer);
    if (!resolved.allowed) return res.status(403).json({ error: 'You do not have an authorized relationship with this student.' });
    return res.status(200).json({ studentId, ...resolved });
  } catch (error) {
    console.error('[student-detail] failed:', error);
    return res.status(500).json({ error: 'Unable to load the student profile.' });
  }
}
