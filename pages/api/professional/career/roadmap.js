import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { authorizeProfessionalStudent } from '../../../../src/security/authorizeProfessionalStudent.js';
import { resolveStudentProfile } from '../../../../src/platform/studentProfileResolver.js';
import { resolveStudentDocumentRef } from '../../../../src/security/studentDocumentRef.js';
import { buildCareerRoadmapShare, careerRoadmapShareId } from '../../../../src/platform/sharedInformation.js';

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const studentId = String(req.query?.studentId || '').trim();
  const institutionId = String(req.query?.institutionId || '').trim() || null;
  const authResult = await authorizeProfessionalStudent({ req, studentId, service: 'career', institutionId });
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
  const identityRef = await resolveStudentDocumentRef({ db, authUid: authResult.authUid, ssStudentId: authResult.studentId });
  const roadmapRef = identityRef.ref.collection('career_roadmaps');

  if (req.method === 'POST') {
    const phases = req.body?.phases && typeof req.body.phases === 'object' ? req.body.phases : {};
    const allowedKeys = ['phase1_unlock', 'phase2_explore', 'phase3_expand', 'phase4_inspire', 'phase5_ignite'];
    const cleanPhases = Object.fromEntries(allowedKeys.map(key => [key, String(phases[key] || '').trim().slice(0, 5000)]));
    if (!Object.values(cleanPhases).some(Boolean)) return res.status(400).json({ error: 'At least one roadmap phase is required.' });
    const requestedStatus = String(req.body?.status || 'Draft').trim().toLowerCase();
    if (!['draft', 'published'].includes(requestedStatus)) return res.status(400).json({ error: 'Roadmap status must be Draft or Published.' });
    const status = requestedStatus === 'published' ? 'Published' : 'Draft';
    const now = new Date().toISOString();
    const docRef = await roadmapRef.add({
      providerId: authResult.viewerId,
      studentAuthUid: identityRef.authUid,
      ssStudentId: identityRef.ssStudentId,
      institutionId,
      status,
      phases: cleanPhases,
      createdAt: now,
      updatedAt: now,
    });
    if (status === 'Published') {
      const resolvedInstitutionId = institutionId || authResult.student?.institutionId || resolved.profile?.institutionId || resolved.profile?.institution?.id || null;
      const share = buildCareerRoadmapShare({ studentId: identityRef.ssStudentId, roadmapId: docRef.id, providerId: authResult.viewerId, phases: cleanPhases, institutionId: resolvedInstitutionId, now });
      await db.collection('sharedInformation').doc(careerRoadmapShareId(identityRef.ssStudentId)).set(share, { merge: true });
    }
    return res.status(201).json({ ok: true, id: docRef.id, status, studentId: identityRef.ssStudentId, ssStudentId: identityRef.ssStudentId, authUid: identityRef.authUid });
  }
  const snapshot = await roadmapRef.get();
  const roadmaps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  return res.status(200).json({ student: { ...resolved.profile, studentId: identityRef.ssStudentId, ssStudentId: identityRef.ssStudentId, authUid: identityRef.authUid }, roadmaps });
}
