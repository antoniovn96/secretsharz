import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';
import { normaliseInstitutionServices } from '../../../src/institution/institutionServices.js';

function publicUser(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    role: data.role || '',
    profileType: data.profileType || '',
    primary_path: data.primary_path || data.studentTrack || '',
    path: isStudentProfile(data) ? getStudentPath(data) : '',
    grade: data.grade || data.gradeOrCourse || '',
    institutionId: data.institutionId || data.institutionID || '',
    institutionName: data.institutionName || '',
    parentUid: data.parentUid || data.parentId || data.parent?.uid || null,
    parentUids: Array.isArray(data.parentUids) ? data.parentUids : [],
    parentIds: Array.isArray(data.parentIds) ? data.parentIds : [],
    linkedParentIds: Array.isArray(data.linkedParentIds) ? data.linkedParentIds : [],
    assignedStaff: data.assignedStaff || null,
    phone: data.phone || data.contactNumber || '',
  };
}

function unique(values) { return [...new Set(values.filter(Boolean).map(String))]; }

function getStudentParentIds(student) {
  return unique([
    student.parentUid,
    ...(Array.isArray(student.parentUids) ? student.parentUids : []),
    ...(Array.isArray(student.parentIds) ? student.parentIds : []),
    ...(Array.isArray(student.linkedParentIds) ? student.linkedParentIds : []),
  ]);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  try {
    const institutionId = String(req.query?.id || '').trim();
    if (!institutionId) return res.status(400).json({ error: 'Institution id is required.' });

    const db = getAdminFirestore();
    const institutionSnap = await db.collection('institutions').doc(institutionId).get();
    if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });

    const institution = institutionSnap.data() || {};
    const usersSnapshot = await db.collection('users').where('institutionId', '==', institutionId).limit(5000).get();
    const rawUsers = usersSnapshot.docs.map(doc => ({ doc, data: doc.data() || {} }));
    const users = rawUsers.map(({ doc }) => publicUser(doc));
    const students = rawUsers.filter(({ data }) => isStudentProfile(data)).map(({ doc }) => publicUser(doc));

    const parentIds = unique(students.flatMap(getStudentParentIds));
    const professionalIds = unique(students.flatMap(student => {
      const staff = student.assignedStaff || {};
      return [staff.careerId, staff.psychologistId, staff.psychologyId, staff.senId, staff.educatorId];
    }));

    const parentDocs = parentIds.length ? await Promise.all(parentIds.map(id => db.collection('users').doc(id).get())) : [];
    const professionalDocs = professionalIds.length ? await Promise.all(professionalIds.map(id => db.collection('users').doc(id).get())) : [];
    const parents = parentDocs.filter(doc => doc.exists).map(publicUser);
    const professionals = professionalDocs.filter(doc => doc.exists).map(publicUser);

    const entitledServices = normaliseInstitutionServices(institution.licenses?.services || institution.services);
    const serviceFlags = Object.fromEntries(['career', 'wellbeing', 'sen'].map(service => [service, entitledServices.includes(service)]));

    const serviceBreakdown = ['career', 'wellbeing', 'sen'].map(service => {
      const serviceStudents = students.filter(student => String(student.primary_path || '').toLowerCase() === service || String(student.path || '').toLowerCase() === service);
      const serviceProfessionalIds = unique(serviceStudents.flatMap(student => {
        const staff = student.assignedStaff || {};
        if (service === 'career') return [staff.careerId];
        if (service === 'wellbeing') return [staff.psychologistId || staff.psychologyId];
        return [staff.senId || staff.educatorId];
      }));
      const serviceParents = unique(serviceStudents.flatMap(getStudentParentIds));
      return { service, students: serviceStudents.length, parents: serviceParents.length, professionals: serviceProfessionalIds.length, entitled: serviceFlags[service] };
    });

    return res.status(200).json({
      institution: {
        id: institutionSnap.id,
        name: institution.name || '',
        institutionCode: institution.institutionCode || institution.tenantCode || '',
        status: institution.status || 'pending',
        address: institution.address || '',
        contactPerson: institution.contactPerson || institution.coordinator?.name || '',
        contactEmail: institution.contactEmail || institution.coordinator?.email || '',
        contactPhone: institution.contactPhone || '',
        coordinator: institution.coordinator || null,
        licenses: institution.licenses || {},
        services: serviceFlags,
        createdAt: institution.createdAt || null,
        updatedAt: institution.updatedAt || null,
      },
      students,
      parents,
      professionals,
      serviceBreakdown,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[admin institution-detail] failed:', error);
    return res.status(500).json({ error: 'Unable to load institution details.' });
  }
}
