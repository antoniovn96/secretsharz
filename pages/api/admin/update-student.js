import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

const clean = (value, max = 180) => String(value ?? '').trim().slice(0, max);
const plain = value => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === 'object') return String(value.display || value.label || value.name || value.number || value.international || '');
  return value;
};

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const isFounder = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decoded.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = clean(req.body?.studentId, 128);
  if (!studentId) return res.status(400).json({ error: 'Student ID is required.' });

  const allowed = ['name', 'email', 'phone', 'gender', 'grade', 'schoolName', 'studentTrack', 'primary_path'];
  const incoming = req.body?.profile && typeof req.body.profile === 'object' ? req.body.profile : {};
  const patch = {};
  allowed.forEach(key => { if (Object.prototype.hasOwnProperty.call(incoming, key)) patch[key] = plain(incoming[key]); });
  if (patch.primary_path !== undefined) patch.primary_path = ['wellbeing', 'sen', 'career', 'unassigned'].includes(String(patch.primary_path)) ? String(patch.primary_path) : 'unassigned';
  if (patch.studentTrack !== undefined) patch.studentTrack = clean(patch.studentTrack, 40);
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

    const updatedAt = new Date().toISOString();
    await ref.set({ ...patch, updatedAt }, { merge: true });
    try {
      await db.collection('auditEvents').add({ actorUid: decoded.uid || null, actorEmail: decoded.email || null, actorRole: isFounder ? 'founder' : 'super_admin', targetUid: studentId, targetRole: 'student', action: 'update_student_directory_profile', fields: Object.keys(patch), createdAt: updatedAt });
    } catch (auditError) { console.error('[update-student] audit write failed:', auditError?.message || auditError); }
    return res.status(200).json({ success: true, studentId, profile: { ...existing, ...patch, updatedAt } });
  } catch (error) {
    console.error('[update-student] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to update the student profile.' });
  }
}
