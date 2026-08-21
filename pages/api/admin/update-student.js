import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';

const clean = (value, max = 180) => String(value ?? '').trim().slice(0, max);
const plain = value => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === 'object') return String(value.display || value.label || value.name || value.number || value.international || '');
  return value;
};
const PRIMARY_PATHS = ['wellbeing', 'sen', 'career', 'unassigned'];
const STUDENT_TRACKS = ['unassigned', 'career', 'counselling', 'both', 'sen'];
const validPathTrack = (path, track) => {
  if (!PRIMARY_PATHS.includes(path) || !STUDENT_TRACKS.includes(track)) return false;
  if (path === 'unassigned') return track === 'unassigned';
  if (track === 'both') return true;
  if (path === 'career') return track === 'career';
  if (path === 'wellbeing') return track === 'counselling';
  if (path === 'sen') return track === 'sen';
  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;
  const decoded = authorization.decodedToken;

  const studentId = clean(req.body?.studentId, 128);
  if (!studentId) return res.status(400).json({ error: 'Student ID is required.' });

  const allowed = ['name', 'email', 'phone', 'gender', 'grade', 'schoolName', 'studentTrack', 'primary_path'];
  const incoming = req.body?.profile && typeof req.body.profile === 'object' ? req.body.profile : {};
  const patch = {};
  allowed.forEach(key => { if (Object.prototype.hasOwnProperty.call(incoming, key)) patch[key] = plain(incoming[key]); });
  if (patch.primary_path !== undefined) patch.primary_path = String(patch.primary_path).toLowerCase();
  if (patch.studentTrack !== undefined) patch.studentTrack = String(patch.studentTrack).toLowerCase();
  if (patch.primary_path !== undefined && !PRIMARY_PATHS.includes(patch.primary_path)) return res.status(400).json({ error: 'Invalid primary path.' });
  if (patch.studentTrack !== undefined && !STUDENT_TRACKS.includes(patch.studentTrack)) return res.status(400).json({ error: 'Invalid student track.' });
  if (patch.name !== undefined) patch.name = clean(patch.name, 180);
  if (patch.email !== undefined) patch.email = clean(patch.email, 254).toLowerCase();
  if (patch.phone !== undefined) patch.phone = clean(patch.phone, 60);
  if (patch.grade !== undefined) patch.grade = clean(patch.grade, 80);
  if (patch.schoolName !== undefined) patch.schoolName = clean(patch.schoolName, 180);
  if (!Object.keys(patch).length) return res.status(400).json({ error: 'No editable student fields were supplied.' });

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Student record not found.' });
    const existing = snap.data() || {};
    if (String(existing.profileType || existing.role || 'student').toLowerCase() !== 'student') return res.status(409).json({ error: 'The selected record is not a student account.' });

    const nextPath = patch.primary_path !== undefined ? patch.primary_path : clean(existing.primary_path || existing.path || existing.studentTrack || 'unassigned').toLowerCase();
    const nextTrack = patch.studentTrack !== undefined ? patch.studentTrack : clean(existing.studentTrack || existing.track || 'unassigned').toLowerCase();
    if (!validPathTrack(nextPath, nextTrack)) return res.status(400).json({ error: 'Primary Path and Student Track are incompatible. Use Career + Career, Wellbeing + Counselling, SEN + SEN, or any path + Both.' });

    const updatedAt = new Date().toISOString();
    await ref.set({ ...patch, primary_path: nextPath, studentTrack: nextTrack, updatedAt }, { merge: true });
    try {
      await db.collection('auditEvents').add({
        actorUid: decoded.uid || null,
        actorEmail: decoded.email || null,
        actorRole: 'super_admin',
        authorizationSource: authorization.authorizationSource || 'claim',
        targetUid: studentId,
        targetRole: 'student',
        action: 'update_student_directory_profile',
        fields: Object.keys(patch).concat(['primary_path', 'studentTrack']).filter((value, index, list) => list.indexOf(value) === index),
        createdAt: updatedAt
      });
    } catch (auditError) {
      console.error('[update-student] audit write failed:', auditError?.message || auditError);
    }
    return res.status(200).json({ success: true, studentId, profile: { ...existing, ...patch, primary_path: nextPath, studentTrack: nextTrack, updatedAt } });
  } catch (error) {
    console.error('[update-student] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to update the student profile.' });
  }
}
