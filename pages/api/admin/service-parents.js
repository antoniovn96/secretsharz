import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

const SERVICES = new Set(['career', 'wellbeing', 'sen']);
const PATHS = { career: 'Career', wellbeing: 'Wellbeing', sen: 'SEN' };

function studentRecord(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    grade: data.grade || data.gradeOrCourse || '',
    institutionName: data.institutionName || data.schoolName || '',
    path: getStudentPath(data),
    parentUid: data.parentUid || data.parentId || '',
  };
}

function publicParentRecord(doc, children) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    phone: data.phone || data.contactNumber || '',
    role: data.role || 'parent',
    parentType: data.parentType || data.relationship || '',
    institutionName: data.institutionName || data.schoolName || '',
    linkedStudentIds: Array.isArray(data.linkedStudentIds) ? data.linkedStudentIds : [],
    children,
    childrenCount: children.length,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const service = String(req.query?.service || '').toLowerCase();
  if (!SERVICES.has(service)) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  try {
    const snapshot = await getAdminFirestore().collection('users').get();
    const students = snapshot.docs
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(studentRecord)
      .filter(student => String(student.path || '').toLowerCase() === PATHS[service].toLowerCase());

    const studentById = new Map(students.map(student => [student.id, student]));
    const childrenByParent = new Map();
    students.forEach(student => {
      if (!student.parentUid) return;
      const children = childrenByParent.get(student.parentUid) || [];
      children.push(student);
      childrenByParent.set(student.parentUid, children);
    });

    const parents = snapshot.docs
      .filter(doc => (doc.data() || {}).role === 'parent')
      .map(doc => {
        const data = doc.data() || {};
        const children = [...(childrenByParent.get(doc.id) || [])];
        const linkedIds = Array.isArray(data.linkedStudentIds) ? data.linkedStudentIds : [];
        linkedIds.forEach(id => {
          const student = studentById.get(id);
          if (student && !children.some(child => child.id === id)) children.push(student);
        });
        return publicParentRecord(doc, children);
      })
      .filter(parent => parent.children.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({ generatedAt: new Date().toISOString(), service, parents, count: parents.length });
  } catch (error) {
    console.error('[admin service parents] failed:', error);
    return res.status(500).json({ error: 'Unable to load the service parent directory.' });
  }
}
