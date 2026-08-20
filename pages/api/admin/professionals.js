import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

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

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const service = String(req.query?.service || '').trim().toLowerCase();
  if (!SERVICE_ROLES[service]) return res.status(400).json({ error: 'A valid service is required.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); } catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  if (!isFounder && decoded.role !== 'super_admin') return res.status(403).json({ error: 'Super Admin access required.' });

  try {
    const snapshot = await getAdminFirestore().collection('users').get();
    const professionals = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).filter(user => {
      const role = String(user.role || user.professionalRole || '').trim().toLowerCase();
      const inactive = user.status === 'inactive' || user.lifecycleStatus === 'inactive' || Boolean(user.archivedAt);
      return !inactive && SERVICE_ROLES[service].has(role);
    }).map(user => ({ id: user.id, name: user.name || user.fullName || user.displayName || '', role: user.role || user.professionalRole || '', email: user.email || '' })).sort((a, b) => a.name.localeCompare(b.name));
    return res.status(200).json({ service, professionals });
  } catch (error) {
    console.error('[admin professionals] failed:', error);
    return res.status(500).json({ error: 'Unable to load professionals.' });
  }
}
