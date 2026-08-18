import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { authorizeProfessionalStudent } from '../../../../src/security/authorizeProfessionalStudent.js';
import { resolveStudentProfile } from '../../../../src/platform/studentProfileResolver.js';

function profileViewer(authResult) {
  return {
    uid: authResult.viewerId,
    role: authResult.isAdmin ? 'super_admin' : 'career_counsellor',
  };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const studentId = String(req.query?.studentId || '').trim();
  const authResult = await authorizeProfessionalStudent({ req, studentId, service: 'career' });
  if (!authResult.authorized) {
    const status = authResult.reason === 'student_not_found' ? 404 : 403;
    return res.status(status).json({ error: 'Career case access denied.' });
  }

  const resolved = resolveStudentProfile(authResult.student, profileViewer(authResult));
  if (!resolved.allowed) return res.status(403).json({ error: 'Career case access denied.' });

  const db = getAdminFirestore();
  const studentRef = db.collection('students').doc(studentId);

  if (req.method === 'POST') {
    const type = String(req.body?.type || 'session').trim().slice(0, 40);
    const title = String(req.body?.title || 'Career counselling note').trim().slice(0, 180);
    const content = String(req.body?.content || '').trim().slice(0, 12000);
    const followUpDate = req.body?.followUpDate ? String(req.body.followUpDate).slice(0, 20) : null;
    if (!content) return res.status(400).json({ error: 'Note content is required.' });

    const noteRef = await studentRef.collection('career_notes').add({
      providerId: authResult.viewerId,
      type,
      title,
      content,
      followUpDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return res.status(201).json({ ok: true, id: noteRef.id });
  }

  const [notesSnap, roadmapsSnap] = await Promise.all([
    studentRef.collection('career_notes').get(),
    studentRef.collection('career_roadmaps').get(),
  ]);

  const sortNewest = rows => rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const notes = sortNewest(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  const roadmaps = sortNewest(roadmapsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

  return res.status(200).json({
    student: resolved.profile,
    notes,
    roadmaps,
  });
}
