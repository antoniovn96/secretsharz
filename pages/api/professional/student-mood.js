import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  const studentId = String(req.query?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'Student ID is required.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const isFounder = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com';
  if (!isFounder && decoded.role !== 'super_admin' && decoded.role !== 'psychologist') return res.status(403).json({ error: 'Psychology professional access required.' });

  try {
    const firestore = getAdminFirestore();
    const student = await firestore.collection('users').doc(studentId).get();
    if (!student.exists) return res.status(404).json({ error: 'Student not found.' });
    const data = student.data() || {};
    if (decoded.role === 'psychologist' && data.assignedStaff?.psychologistId !== decoded.uid && data.assignedStaff?.psychologyId !== decoded.uid) {
      return res.status(403).json({ error: 'This student is not assigned to your professional account.' });
    }

    const logs = await firestore.collection('users').doc(studentId).collection('mood_logs').orderBy('timestamp', 'desc').limit(1).get();
    if (logs.empty) return res.status(200).json({ alert: null });
    const doc = logs.docs[0];
    const mood = doc.data() || {};
    if (mood.moodValue !== 1 && mood.moodValue !== 2) return res.status(200).json({ alert: null });

    const timestamp = mood.timestamp?.toDate ? mood.timestamp.toDate().toISOString() : (mood.timestamp || new Date().toISOString());
    return res.status(200).json({ alert: { id: doc.id, studentId, studentName: data.name || data.fullName || 'Student', moodValue: mood.moodValue, moodLabel: mood.moodLabel || '', timestamp, emoji: mood.moodValue === 1 ? '😢' : '😟' } });
  } catch (error) {
    console.error('[professional student mood] failed:', error);
    return res.status(500).json({ error: 'Unable to load the assigned student mood status.' });
  }
}
