import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';

const CONFIG = Object.freeze({
  career: { role: 'career_counsellor', collection: 'students', assignmentFields: ['assignedStaff.careerId'] },
  wellbeing: { role: 'psychologist', collection: 'users', assignmentFields: ['assignedStaff.psychologistId', 'assignedStaff.psychologyId'] },
  sen: { role: 'educator', collection: 'users', assignmentFields: ['assignedStaff.senId', 'assignedStaff.educatorId'] },
});

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function valueAt(data, path) { return path.split('.').reduce((value, key) => value?.[key], data); }

function assigned(data, uid, service, fields) {
  const canonical = normalizeStudentRecord(data, null);
  const canonicalAssignment = canonical.relationships?.assignments?.[service];
  if (canonicalAssignment) return canonicalAssignment === uid;
  return fields.some(field => valueAt(data, field) === uid);
}

function cleanStudent(id, data, service) {
  const canonical = normalizeStudentRecord(data, id);
  const identity = canonical.identity || {};
  const contact = canonical.contact || {};
  const academic = canonical.academic?.current || {};
  const institution = canonical.institution || {};
  const career = canonical.career || {};
  const sen = canonical.sen || {};
  const assessments = Array.isArray(canonical.assessments) ? canonical.assessments : [];
  const latestRiasec = [...assessments].reverse().find(a => a?.result?.riasecCode || a?.riasecCode);

  return {
    uid: id,
    name: identity.fullName || 'Unknown Student',
    preferredName: identity.preferredName || '',
    grade: academic.grade || 'N/A',
    section: academic.section || '',
    school: academic.institutionName || institution.name || 'N/A',
    institutionName: academic.institutionName || institution.name || '',
    email: contact.email || '',
    phone: contact.mobile?.number || '',
    phoneCountryCode: contact.mobile?.countryCode || null,
    status: data.status || 'active',
    path: service,
    photoURL: identity.photoURL || null,
    riasecCode: career.riasecCode || latestRiasec?.result?.riasecCode || latestRiasec?.riasecCode || null,
    lastSessionDate: data.lastSessionDate || null,
    iepStatus: sen.iep?.status || data.iepStatus || data.latestIepStatus || 'Not started',
    updatedAt: canonical.governance?.updatedAt || data.updatedAt || data.lastUpdatedAt || null,
  };
}

async function getAuthorisedInstitutionStudentIds(db, professional, service) {
  const institutionIds = Array.isArray(professional?.institutionIds) ? [...new Set(professional.institutionIds.map(String).filter(Boolean))] : [];
  if (!institutionIds.length) return new Set();
  const allowed = new Set();
  await Promise.all(institutionIds.map(async institutionId => {
    const institutionSnap = await db.collection('institutions').doc(institutionId).get();
    if (!institutionSnap.exists) return;
    const institution = institutionSnap.data() || {};
    const services = Array.isArray(institution.services) ? institution.services : Array.isArray(institution.licenses?.services) ? institution.licenses.services : [];
    if (!services.includes(service)) return;
    const rosterSnap = await db.collection('institutions').doc(institutionId).collection('roster').get();
    rosterSnap.docs.forEach(rosterDoc => { const roster = rosterDoc.data() || {}; const studentUid = roster.claimedBy || roster.userUid || roster.studentUid; if (studentUid) allowed.add(String(studentUid)); });
  }));
  return allowed;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const service = String(req.query?.service || '').toLowerCase();
  const config = CONFIG[service];
  if (!config) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); } catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const role = decoded.role || '';
  if (!isFounder && role !== 'super_admin' && role !== config.role) return res.status(403).json({ error: 'This professional account is not authorised for the requested service.' });

  try {
    const firestore = getAdminFirestore();
    let professionalProfile = null;
    let authorisedInstitutionStudentIds = null;
    if (!isFounder && role !== 'super_admin') {
      const professionalSnap = await firestore.collection('users').doc(decoded.uid).get();
      if (!professionalSnap.exists) return res.status(403).json({ error: 'Professional profile not found.' });
      professionalProfile = professionalSnap.data() || {};
      if (professionalProfile.role !== config.role && professionalProfile.professionalRole !== config.role) return res.status(403).json({ error: 'Professional role is not authorised for the requested service.' });
      authorisedInstitutionStudentIds = await getAuthorisedInstitutionStudentIds(firestore, professionalProfile, service);
    }

    const snapshot = await firestore.collection(config.collection).get();
    const rows = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data() || {};
      const canonical = normalizeStudentRecord(data, doc.id);
      if (!assigned(data, decoded.uid, service, config.assignmentFields)) return;
      if (authorisedInstitutionStudentIds && !authorisedInstitutionStudentIds.has(doc.id)) return;
      if (config.collection === 'users' && data.role && data.role !== 'student') return;
      if (config.collection === 'users' && canonical.services?.[service]?.status !== 'active') return;
      rows.push(cleanStudent(doc.id, data, service));
    });
    rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return res.status(200).json({ service, count: rows.length, students: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[professional caseload] failed:', error);
    return res.status(500).json({ error: 'Unable to load the assigned professional caseload.' });
  }
}
