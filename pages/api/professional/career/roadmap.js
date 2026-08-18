import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { authorizeProfessionalStudent } from '../../../../src/security/authorizeProfessionalStudent.js';
import { resolveStudentProfile } from '../../../../src/platform/studentProfileResolver.js';

const ALLOWED_PHASES = ['phase1_unlock', 'phase2_explore', 'phase3_expand', 'phase4_inspire', 'phase5_ignite'];
const ALLOWED_STATUS = ['Draft', 'Published'];

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const studentId = String(req.query?.studentId || '').trim();
  const authResult = await authorizeProfessionalStudent({ req, studentId, service: 'career' });
  if (!authResult.authorized) {
    const status = authResult.reason === 'student_not_found' ? 404 : 403;
    return res.status(status).json({ error: 'Career roadmap access denied.' });
  }

  const resolved = resolveStudentProfile(authResult.student, {
    uid: authResult.viewerId,
    role: authResult.isAdmin ? 'super_admin' : 'career_counsellor',
  });
  if (!resolved.allowed) return res.status(403).json({ error: 'Career roadmap access denied.' });

  const db = getAdminFirestore();
  const roadmapRef = db.collection('students').doc(studentId).collection('career_roadmaps');

  if (req.method === 'POST') {
    const phases = req.body?.phases && typeof req.body.phases === 'object' ? req.body.phases : {};
    const cleanPhases = Object.fromEntries(
      ALLOWED_PHASES.map(key => [key, String(phases[key] || '').trim().slice(0, 5000)])
    );
    if (!Object.values(cleanPhases).some(Boolean)) {
      return res.status(400).json({ error: 'At least one roadmap phase is required.' });
    }

    // Draft is the safe default. The caller may explicitly request Published
    // when the existing workflow intentionally publishes on save.
    const requestedStatus = String(req.body?.status || 'Draft').trim();
    const status = ALLOWED_STATUS.includes(requestedStatus) ? requestedStatus : 'Draft';
    const now = new Date().toISOString();
    const docRef = await roadmapRef.add({
      providerId: authResult.viewerId,
      status,
      phases: cleanPhases,
      createdAt: now,
      updatedAt: now,
    });
    return res.status(201).json({ ok: true, id: docRef.id, status });
  }

  const snapshot = await roadmapRef.get();
  const roadmaps = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  return res.status(200).json({ student: resolved.profile, roadmaps });
}
