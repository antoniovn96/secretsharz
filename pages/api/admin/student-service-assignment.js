import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';

const SERVICE_PATHS = new Set(['career', 'wellbeing', 'sen']);
const SERVICE_ROLES = Object.freeze({
  career: new Set(['career_counsellor', 'career_coach']),
  wellbeing: new Set(['psychologist', 'counselling_psychologist', 'counsellor']),
  sen: new Set(['educator', 'sen_educator', 'special_educator']),
});
const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const match = typeof header === 'string' ? header.match(/^Bearer\s+(.+)$/i) : null;
  return match ? match[1] : null;
}

function isSuperAdmin(decoded = {}) {
  return decoded.role === 'super_admin' || (decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL);
}

function nowIso() { return new Date().toISOString(); }

export default async function handler(req, res) {
  if (!['POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  if (!isSuperAdmin(decoded)) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = String(req.body?.studentId || req.query?.studentId || '').trim();
  const service = String(req.body?.service || req.query?.service || '').trim().toLowerCase();
  const professionalId = req.method === 'DELETE' ? null : String(req.body?.professionalId || '').trim();
  if (!studentId || !SERVICE_PATHS.has(service)) return res.status(400).json({ error: 'Student ID and a valid service are required.' });
  if (req.method === 'POST' && !professionalId) return res.status(400).json({ error: 'Professional ID is required when assigning a student.' });

  try {
    const db = getAdminFirestore();
    const studentRef = db.collection('users').doc(studentId);
    const professionalRef = professionalId ? db.collection('users').doc(professionalId) : null;
    const [studentSnap, professionalSnap] = await Promise.all([
      studentRef.get(),
      professionalRef ? professionalRef.get() : Promise.resolve(null),
    ]);

    if (!studentSnap.exists) return res.status(404).json({ error: 'Canonical student record not found.' });
    const raw = studentSnap.data() || {};
    if (!isStudentProfile(raw)) return res.status(400).json({ error: 'The target record is not a student profile.' });
    const profile = normalizeStudentRecord(raw, studentId);
    if (profile.services?.[service]?.status !== 'active') return res.status(409).json({ error: `Student is not actively enrolled in the ${service} service.` });
    if (raw.status === 'archived' || raw.lifecycleStatus === 'archived' || raw.archivedAt) return res.status(409).json({ error: 'Archived students cannot receive active professional assignments.' });

    if (professionalId) {
      if (!professionalSnap?.exists) return res.status(404).json({ error: 'Professional account not found.' });
      const professional = professionalSnap.data() || {};
      const role = String(professional.role || professional.professionalRole || '').trim().toLowerCase();
      if (!SERVICE_ROLES[service]?.has(role)) return res.status(409).json({ error: 'Selected professional is not authorised for this service.' });
      if (professional.status === 'inactive' || professional.lifecycleStatus === 'inactive' || professional.archivedAt) return res.status(409).json({ error: 'Selected professional is inactive.' });
    }

    const beforeAssignment = profile.relationships?.assignments?.[service] || null;
    const now = nowIso();
    const nextAssignment = professionalId ? {
      professionalId,
      status: 'active',
      assignedAt: now,
      assignedBy: decoded.uid,
      updatedAt: now,
    } : {
      professionalId: null,
      status: 'inactive',
      unassignedAt: now,
      unassignedBy: decoded.uid,
      updatedAt: now,
    };

    const auditRef = db.collection('auditEvents').doc();
    const batch = db.batch();
    batch.set(studentRef, {
      relationships: { assignments: { [service]: nextAssignment } },
      updatedAt: now,
    }, { merge: true });
    batch.set(auditRef, {
      eventType: professionalId ? 'student_service_assigned' : 'student_service_unassigned',
      actorId: decoded.uid,
      actorRole: 'super_admin',
      resourceType: 'student',
      resourceId: studentId,
      service,
      professionalId: professionalId || null,
      previousProfessionalId: typeof beforeAssignment === 'string' ? beforeAssignment : null,
      purpose: 'administration',
      outcome: 'success',
      timestamp: now,
    });
    await batch.commit();

    return res.status(200).json({ ok: true, studentId, service, assignment: nextAssignment });
  } catch (error) {
    console.error('[student-service-assignment] failed:', error);
    return res.status(500).json({ error: 'Unable to update the student service assignment.' });
  }
}
