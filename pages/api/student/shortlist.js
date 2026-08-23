import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 300) {
  return String(value ?? '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  if (decoded.role !== 'student') {
    return res.status(403).json({ error: 'Student access required.' });
  }

  const tier = clean(req.body?.tier, 20).toLowerCase();
  if (!['dream', 'target', 'safe'].includes(tier)) {
    return res.status(400).json({ error: 'tier must be dream, target, or safe.' });
  }

  const college = req.body?.college;
  if (!college || typeof college !== 'object') {
    return res.status(400).json({ error: 'college is required.' });
  }

  const id = clean(college.id || '', 200);
  const name = clean(college.name || '', 300);
  if (!name) return res.status(400).json({ error: 'college.name is required.' });

  const entry = {
    id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    course: clean(college.course, 300),
    location: clean(college.location, 300),
    addedAt: new Date().toISOString(),
  };

  try {
    const db = getAdminFirestore();
    const ref = db.collection('students').doc(decoded.uid);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student record not found.' });

    const data = snapshot.data() || {};
    const shortlist = data.collegeShortlist && typeof data.collegeShortlist === 'object' ? data.collegeShortlist : {};
    const current = Array.isArray(shortlist[tier]) ? shortlist[tier] : [];
    const duplicate = current.some((item) => String(item?.id || '') === entry.id);
    const next = duplicate ? current : [...current, entry];

    await ref.set({
      collegeShortlist: {
        dream: Array.isArray(shortlist.dream) ? shortlist.dream : [],
        target: Array.isArray(shortlist.target) ? shortlist.target : [],
        safe: Array.isArray(shortlist.safe) ? shortlist.safe : [],
        [tier]: next,
      },
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return res.status(200).json({ ok: true, tier, college: entry });
  } catch (error) {
    console.error('[student-shortlist] save failed:', error);
    return res.status(500).json({ error: 'Unable to save the college shortlist.' });
  }
}
