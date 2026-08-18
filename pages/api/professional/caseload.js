import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const CONFIG = Object.freeze({
  career: { role: 'career_counsellor', collection: 'students', assignmentFields: ['assignedStaff.careerId'], path: 'Career' },
  wellbeing: { role: 'psychologist', collection: 'users', assignmentFields: ['assignedStaff.psychologistId', 'assignedStaff.psychologyId'], path: 'wellbeing' },
  sen: { role: 'educator', collection: 'users', assignmentFields: ['assignedStaff.senId', 'assignedStaff.educatorId'], path: 'sen' },
});

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function valueAt(data, path) {
  return path.split('.').reduce((value, key) => value?.[key], data);
}

function assigned(data, uid, fields) {
  return fields.some(field => valueAt(data, field) === uid);
}

function cleanStudent(id, data, service) {
  return {
    uid: id,
    name: data.name || data.studentName || data.profile?.name || 'Unknown Student',
    grade: data.grade || data.class || data.school?.grade || 'N/A',
    school: data.schoolName || data.school?.name || data.school || 'N/A',
    institutionName: data.institutionName || data.schoolName || data.school?.name || '',
    status: data.status || 'active',
    path: data.primary_path || data.path || (service === 'career' ? 'Career' : service === 'wellbeing' ? 'Wellbeing' : 'SEN'),
    riasecCode: data.careerDNA?.riasec?.code || data.riasecCode || data.careerAssessment?.riasecCode || null,
    lastSessionDate: data.lastSessionDate || null,
    iepStatus: data.iepStatus || data.latestIepStatus || 'Not started',
    updatedAt: data.updatedAt || data.lastUpdatedAt || data.assessmentUpdatedAt || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const service = String(req.query?.service || '').toLowerCase();
  const config = CONFIG[service];
  if (!config) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const isFounder = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com';
  const role = decoded.role || '';
  if (!isFounder && role !== 'super_admin' && role !== config.role) {
    return res.status(403).json({ error: 'This professional account is not authorised for the requested service.' });
  }

  try {
    const firestore = getAdminFirestore();
    const snapshot = await firestore.collection(config.collection).get();
    const rows = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data() || {};
      if (!assigned(data, decoded.uid, config.assignmentFields)) return;
      if (config.collection === 'users' && data.role && data.role !== 'student') return;
      if (config.collection === 'users' && service === 'wellbeing' && data.primary_path !== 'wellbeing') return;
      if (config.collection === 'users' && service === 'sen' && data.primary_path !== 'sen') return;
      rows.push(cleanStudent(doc.id, data, service));
    });

    rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return res.status(200).json({ service, count: rows.length, students: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[professional caseload] failed:', error);
    return res.status(500).json({ error: 'Unable to load the assigned professional caseload.' });
  }
}
