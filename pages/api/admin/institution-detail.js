import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function requireAdmin(req) {
  const token = bearerToken(req);
  if (!token) throw Object.assign(new Error('Authentication required.'), { statusCode: 401 });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { throw Object.assign(new Error('Invalid or expired authentication token.'), { statusCode: 401 }); }
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';
  if (!isFounder && decoded.role !== 'super_admin') throw Object.assign(new Error('Super Admin access required.'), { statusCode: 403 });
  return decoded;
}

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
    assignedStaff: data.assignedStaff || null,
    phone: data.phone || data.contactNumber || '',
  };
}

function unique(values) { return [...new Set(values.filter(Boolean).map(String))]; }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  try {
    await requireAdmin(req);
    const institutionId = String(req.query?.id || '').trim();
    if (!institutionId) return res.status(400).json({ error: 'Institution id is required.' });

    const db = getAdminFirestore();
    const institutionSnap = await db.collection('institutions').doc(institutionId).get();
    if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });

    const institution = institutionSnap.data() || {};
    const usersSnapshot = await db.collection('users').where('institutionId', '==', institutionId).limit(5000).get();
    const users = usersSnapshot.docs.map(publicUser);
    const students = users.filter(user => isStudentProfile(usersSnapshot.docs.find(doc => doc.id === user.id)?.data() || {}));

    const parentIds = unique(students.flatMap(student => [student.parentUid]));
    const professionalIds = unique(students.flatMap(student => {
      const staff = student.assignedStaff || {};
      return [staff.careerId, staff.psychologistId, staff.psychologyId, staff.senId, staff.educatorId];
    }));

    const parentDocs = parentIds.length ? await Promise.all(parentIds.map(id => db.collection('users').doc(id).get())) : [];
    const professionalDocs = professionalIds.length ? await Promise.all(professionalIds.map(id => db.collection('users').doc(id).get())) : [];
    const parents = parentDocs.filter(doc => doc.exists).map(publicUser);
    const professionals = professionalDocs.filter(doc => doc.exists).map(publicUser);

    const services = institution.licenses?.services || institution.services || {};
    const serviceFlags = Array.isArray(services)
      ? Object.fromEntries(services.map(service => [String(service).toLowerCase(), true]))
      : Object.fromEntries(Object.entries(services).map(([key, value]) => [String(key).toLowerCase(), Boolean(value)]));

    const serviceBreakdown = ['career', 'wellbeing', 'sen'].map(service => {
      const serviceStudents = students.filter(student => String(student.primary_path || '').toLowerCase() === service || String(student.path || '').toLowerCase() === service);
      const serviceProfessionalIds = unique(serviceStudents.flatMap(student => {
        const staff = student.assignedStaff || {};
        if (service === 'career') return [staff.careerId];
        if (service === 'wellbeing') return [staff.psychologistId || staff.psychologyId];
        return [staff.senId || staff.educatorId];
      }));
      const serviceParents = unique(serviceStudents.map(student => student.parentUid));
      return { service, students: serviceStudents.length, parents: serviceParents.length, professionals: serviceProfessionalIds.length, entitled: Boolean(serviceFlags[service]) };
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
    return res.status(error.statusCode || 500).json({ error: error.message || 'Unable to load institution details.' });
  }
}
