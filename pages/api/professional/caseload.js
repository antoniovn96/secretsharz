import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { resolveStudentIdentity } from '../../../src/security/studentIdentityResolver.js';

const CONFIG = Object.freeze({
  career: { role: 'career_counsellor', domain: 'career', type: 'career_counsellor', slots: ['primary'] },
  wellbeing: { role: 'psychologist', domain: 'counselling', type: 'primary_counsellor', slots: ['primary', 'backup'], canonicalService: 'psychology' },
  sen: { role: 'educator', domain: 'sen', type: 'sen_professional', slots: ['primary', 'multidisciplinary'] },
});

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
function bearerToken(req) { const header = req.headers.authorization || req.headers.Authorization; if (typeof header !== 'string') return null; const match = header.match(/^Bearer\s+(.+)$/i); return match ? match[1] : null; }

function cleanStudent(id, data, service, identity) {
  const canonical = normalizeStudentRecord(data, id);
  const identityData = canonical.identity || {};
  const contact = canonical.contact || {};
  const academic = canonical.academic?.current || {};
  const institution = canonical.institution || {};
  const career = canonical.career || {};
  const sen = canonical.sen || {};
  const assessments = Array.isArray(canonical.assessments) ? canonical.assessments : [];
  const latestRiasec = [...assessments].reverse().find(a => a?.result?.riasecCode || a?.riasecCode);
  return {
    uid: identity.authUid || identity.documentId || id,
    studentId: identity.ssStudentId || identity.documentId || id,
    ssStudentId: identity.ssStudentId || null,
    authUid: identity.authUid || null,
    studentDocumentId: identity.documentId || id,
    name: identityData.fullName || data.name || data.fullName || 'Unknown Student',
    preferredName: identityData.preferredName || '',
    grade: academic.grade || data.grade || 'N/A',
    section: academic.section || data.section || '',
    school: academic.institutionName || institution.name || data.schoolName || 'N/A',
    institutionName: academic.institutionName || institution.name || data.schoolName || '',
    email: contact.email || data.email || '',
    phone: contact.mobile?.number || data.phone || '',
    phoneCountryCode: contact.mobile?.countryCode || null,
    status: data.status || 'active',
    path: service,
    photoURL: identityData.photoURL || data.photoURL || null,
    riasecCode: career.riasecCode || latestRiasec?.result?.riasecCode || latestRiasec?.riasecCode || null,
    lastSessionDate: data.lastSessionDate || null,
    iepStatus: sen.iep?.status || data.iepStatus || data.latestIepStatus || 'Not started',
    updatedAt: canonical.governance?.updatedAt || data.updatedAt || data.lastUpdatedAt || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const requestedService = String(req.query?.service || '').toLowerCase();
  const config = CONFIG[requestedService];
  if (!config) return res.status(400).json({ error: 'A valid service is required: career, wellbeing, or sen.' });
  const token = bearerToken(req); if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let decoded; try { decoded = await getAdminAuth().verifyIdToken(token); } catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const role = decoded.role || '';
  if (!isFounder && role !== 'super_admin' && role !== config.role) return res.status(403).json({ error: 'This professional account is not authorised for the requested service.' });

  try {
    const firestore = getAdminFirestore();
    let institutionIds = [];
    if (!isFounder && role !== 'super_admin') {
      const professionalSnap = await firestore.collection('users').doc(decoded.uid).get();
      if (!professionalSnap.exists) return res.status(403).json({ error: 'Professional profile not found.' });
      const professional = professionalSnap.data() || {};
      if (professional.role !== config.role && professional.professionalRole !== config.role) return res.status(403).json({ error: 'Professional role is not authorised for the requested service.' });
      institutionIds = Array.isArray(professional.institutionIds) ? [...new Set(professional.institutionIds.map(String).filter(Boolean))] : [];
    }

    const relationshipSnapshot = await firestore.collection('relationships').where('relatedPersonId', '==', decoded.uid).where('status', '==', 'active').limit(200).get();
    const assignments = relationshipSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(assignment => assignment.domain === config.domain && assignment.type === config.type && config.slots.includes(String(assignment.metadata?.slot || 'primary').toLowerCase()) && (!institutionIds.length || institutionIds.includes(String(assignment.metadata?.institutionId || ''))));

    const students = [];
    for (const assignment of assignments) {
      const identity = await resolveStudentIdentity({ db: firestore, authUid: assignment.subjectPersonId, ssStudentId: assignment.subjectPersonId }).catch(() => null);
      if (!identity?.documentId) continue;
      const studentSnap = await firestore.collection('students').doc(identity.documentId).get();
      const legacySnap = studentSnap.exists ? null : await firestore.collection('users').doc(identity.documentId).get();
      const data = studentSnap.exists ? studentSnap.data() || {} : (legacySnap?.exists ? legacySnap.data() || {} : null);
      if (!data) continue;
      const row = cleanStudent(identity.documentId, data, requestedService, identity);
      row.assignment = { relationshipId: assignment.id, institutionId: assignment.metadata?.institutionId || null, service: assignment.metadata?.service || config.canonicalService || requestedService, domain: assignment.domain, slot: assignment.metadata?.slot || 'primary', status: assignment.status };
      students.push(row);
    }

    const unique = new Map();
    students.forEach(student => { const key = student.ssStudentId || student.authUid || student.studentDocumentId; if (!unique.has(key)) unique.set(key, student); });
    const rows = [...unique.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return res.status(200).json({ service: requestedService, canonicalService: config.canonicalService || requestedService, domain: config.domain, count: rows.length, students: rows, generatedAt: new Date().toISOString() });
  } catch (error) { console.error('[professional caseload] failed:', error); return res.status(500).json({ error: 'Unable to load the assigned professional caseload.' }); }
}
