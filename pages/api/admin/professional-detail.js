// Super Admin endpoint for relationship-aware professional detail.
// Returns the professional's institution assignments and student/parent
// relationships derived from canonical student assignment fields.
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

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function publicUser(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    phone: data.phone || data.contactNumber || '',
    photoURL: data.photoURL || '',
    role: data.role || '',
    grade: data.grade || data.gradeOrCourse || '',
    schoolName: data.schoolName || data.institutionName || '',
    institutionId: data.institutionId || data.institutionID || '',
    path: data.primary_path || data.studentTrack || '',
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
    if (!service) return res.status(400).json({ error: 'Professional service could not be determined.' });

    const institutionIds = Array.isArray(professional.institutionIds)
      ? [...new Set(professional.institutionIds.filter(Boolean))]
      : [];

    const institutionDocs = await Promise.all(institutionIds.map(id => db.collection('institutions').doc(id).get()));
    const institutions = institutionDocs.filter(doc => doc.exists).map(publicInstitution);

    const assignedField = service === 'career'
      ? 'assignedStaff.careerId'
      : service === 'wellbeing'
        ? 'assignedStaff.psychologistId'
        : 'assignedStaff.senId';

    let studentSnapshot;
    try {
      studentSnapshot = await db.collection('users').where(assignedField, '==', professionalUid).get();
    } catch (queryError) {
      // Legacy records may use assignedCounsellorId instead of assignedStaff.
      console.warn('[professional-detail] canonical student query failed:', queryError?.message || queryError);
      studentSnapshot = await db.collection('users').where('assignedCounsellorId', '==', professionalUid).get();
    }

    const students = studentSnapshot.docs.map(publicUser);
    const parentIds = [...new Set(studentSnapshot.docs.map(doc => {
      const data = doc.data() || {};
      return data.parentUid || data.parentId || data.parent?.uid || null;
    }).filter(Boolean))];
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
      }
    });
  } catch (error) {
    console.error('[professional-detail] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load professional relationships.' });
  }
}
