import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeString(value) {
  return value == null ? '' : String(value).trim();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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

  try {
    const db = getAdminFirestore();
    const [profileSnap, attemptsSnap] = await Promise.all([
      db.collection('careerProfiles').doc(decoded.uid).get(),
      db.collection('careerProfiles').doc(decoded.uid).collection('assessments').orderBy('completedAt', 'desc').limit(20).get(),
    ]);

    if (!profileSnap.exists) {
      return res.status(404).json({ error: 'No Career assessment profile is available.' });
    }

    const profile = profileSnap.data() || {};
    const attempts = attemptsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({
      authUid: decoded.uid,
      ssStudentId: safeString(profile.ssStudentId),
      latestAssessmentId: safeString(profile.latestAssessmentId),
      latestAssessmentAt: profile.latestAssessmentAt || null,
      assessment: profile.assessment || null,
      careerExploration: Array.isArray(profile.careerExploration) ? profile.careerExploration : [],
      history: attempts,
      version: profile.version || null,
      updatedAt: profile.updatedAt || null,
    });
  } catch (error) {
    console.error('[career/profile] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load the Career profile.' });
  }
}
