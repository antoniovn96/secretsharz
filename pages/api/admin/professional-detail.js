// Super Admin endpoint for relationship-aware professional detail.
// Returns institution assignments and student/parent relationships from the
// canonical student assignment model, with a narrow legacy fallback only when
// no canonical student records are available for the service.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isRequesterAdmin } from '../../../src/security/roleAssignment.js';

const ROLE_SERVICE = Object.freeze({
  career_counsellor: 'career',
  psychologist: 'wellbeing',
  counsellor: 'wellbeing',
  educator: 'sen'
});

const SERVICE_LABELS = Object.freeze({
  career: 'Career Guidance',
  wellbeing: 'Wellbeing & Counselling',
  sen: 'SEN Support'
});

const SERVICE_LEGACY_FIELDS = Object.freeze({
  career: ['assignedStaff.careerId', 'assignedCareerCounsellorId', 'assignedCareerCoachId'],
  wellbeing: ['assignedStaff.psychologistId', 'assignedStaff.psychologyId', 'assignedPsychologistId', 'assignedCounsellorId'],
  sen: ['assignedStaff.senId', 'assignedStaff.educatorId', 'assignedSENEducatorId']
});

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function publicUser(doc) {
  const data = doc.data() || {};
  const academic = data.academic?.current || {};
  const institution = data.institution || {};
  const identity = data.identity || {};
  return {
    id: doc.id,
    name: identity.fullName || data.name || data.fullName || '',
    email: data.email || data.contact?.email || '',
    phone: data.phone || data.contactNumber || data.contact?.mobile?.number || '',
    photoURL: identity.photoURL || data.photoURL || '',
    role: data.role || '',
    grade: academic.grade || data.grade || data.gradeOrCourse || '',
    schoolName: institution.name || data.schoolName || data.institutionName || '',
    institutionId: academic.institutionId || institution.id || data.institutionId || data.institutionID || '',
    path: data.primary_path || data.studentTrack || data.services?.career?.status === 'active' && 'career' || '',
    status: data.status || 'active'
  };
}

function publicInstitution(doc) {
  const data = doc.data() || {};
  const coordinator = data.coordinator || {};
  return {
    id: doc.id,
    name: data.name || data.institutionName || '',
    institutionCode: data.institutionCode || data.code || '',
    status: data.status || 'active',
    city: data.city || data.location?.city || '',
    state: data.state || data.location?.state || '',
    coordinator: {
      name: coordinator.name || data.coordinatorName || '',
      email: coordinator.email || data.coordinatorEmail || ''
    }
  };
}

function canonicalAssignmentMatches(data, service, professionalUid) {
  const assignment = data?.relationships?.assignments?.[service];
  if (!assignment) return false;
  if (typeof assignment === 'string') return assignment === professionalUid;
  if (assignment.status === 'inactive') return false;
  return [assignment.professionalId, assignment.primaryProfessionalId]
    .filter(Boolean)
    .map(String)
    .includes(String(professionalUid));
}

async function loadCanonicalStudents(db, service, professionalUid) {
  // Firestore cannot query an arbitrary OR across the canonical assignment
  // compatibility shapes without additional indexes. Fetch active service
  // students and filter the assignment object server-side.
  const snapshot = await db.collection('users')
    .where(`services.${service}.status`, '==', 'active')
    .get();
  return snapshot.docs.filter(doc => canonicalAssignmentMatches(doc.data() || {}, service, professionalUid));
}

async function loadLegacyStudents(db, service, professionalUid) {
  const fields = SERVICE_LEGACY_FIELDS[service] || [];
  const byId = new Map();
  for (const field of fields) {
    try {
      const snapshot = await db.collection('users').where(field, '==', professionalUid).get();
      snapshot.docs.forEach(doc => byId.set(doc.id, doc));
    } catch (error) {
      console.warn(`[professional-detail] legacy query skipped for ${field}:`, error?.message || error);
    }
  }
  return [...byId.values()];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let requester;
  try {
    requester = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
  if (!isRequesterAdmin(requester)) return res.status(403).json({ error: 'Administrator access required.' });

  const professionalUid = typeof req.query?.uid === 'string' ? req.query.uid.trim() : '';
  if (!professionalUid) return res.status(400).json({ error: 'Professional uid is required.' });

  try {
    const db = getAdminFirestore();
    const professionalRef = db.collection('users').doc(professionalUid);
    const professionalSnap = await professionalRef.get();
    if (!professionalSnap.exists) return res.status(404).json({ error: 'Professional not found.' });

    const professional = professionalSnap.data() || {};
    const role = professional.role || professional.professionalRole || '';
    const service = professional.professionalService || ROLE_SERVICE[role] || null;
    if (!service || !SERVICE_LEGACY_FIELDS[service]) return res.status(400).json({ error: 'Professional service could not be determined.' });

    const institutionIds = Array.isArray(professional.institutionIds)
      ? [...new Set(professional.institutionIds.filter(Boolean))]
      : [];

    const institutionDocs = await Promise.all(institutionIds.map(id => db.collection('institutions').doc(id).get()));
    const institutions = institutionDocs.filter(doc => doc.exists).map(publicInstitution);

    let studentSnapshot = await loadCanonicalStudents(db, service, professionalUid);
    let source = 'canonical';

    // Legacy fallback is deliberately used only when the canonical query
    // produces no assigned students. Canonical records therefore always win.
    if (!studentSnapshot.length) {
      studentSnapshot = await loadLegacyStudents(db, service, professionalUid);
      source = studentSnapshot.length ? 'legacy_fallback' : 'canonical';
    }

    const students = studentSnapshot.map(publicUser);
    const parentIds = [...new Set(studentSnapshot.map(doc => {
      const data = doc.data() || {};
      const guardians = Array.isArray(data.family?.guardians) ? data.family.guardians : [];
      return [
        ...guardians.map(guardian => guardian?.accountId),
        data.parentUid,
        data.parentId,
        data.parent?.uid
      ].filter(Boolean);
    }).flat())];
    const parentDocs = await Promise.all(parentIds.map(id => db.collection('users').doc(id).get()));
    const parents = parentDocs.filter(doc => doc.exists).map(publicUser);

    const institutionBreakdown = institutions.map(institution => ({
      ...institution,
      students: students.filter(student => student.institutionId === institution.id).length
    }));

    return res.status(200).json({
      professional: {
        id: professionalSnap.id,
        name: professional.name || professional.fullName || '',
        email: professional.email || '',
        phone: professional.phone || professional.contactNumber || '',
        role,
        service,
        serviceLabel: SERVICE_LABELS[service] || service,
        institutionIds,
        status: professional.status || 'active'
      },
      institutions: institutionBreakdown,
      students,
      parents,
      counts: {
        institutions: institutions.length,
        students: students.length,
        parents: parents.length
      },
      assignmentSource: source
    });
  } catch (error) {
    console.error('[professional-detail] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load professional relationships.' });
  }
}
