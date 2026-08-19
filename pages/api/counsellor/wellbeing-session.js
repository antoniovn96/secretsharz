import { getAdminAuth } from '../../../src/security/firebaseAdmin.js';
import { getCounsellingSessions, createCounsellingSession } from '../../../src/security/counsellingSessionService.js';

function bearer(req) { const match = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i); return match?.[1] || null; }
async function authenticate(req, res) { const token = bearer(req); if (!token) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(token); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const actor = await authenticate(req, res); if (!actor) return;
  const studentId = String(req.query.studentId || req.body?.studentId || '').trim();
  const institutionId = String(req.query.institutionId || req.body?.institutionId || '').trim() || null;
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });
  try {
    if (req.method === 'GET') return res.status(200).json(await getCounsellingSessions({ db: undefined, studentId, professionalId: actor.uid, institutionId }));
    return res.status(201).json(await createCounsellingSession({ db: undefined, studentId, professionalId: actor.uid, institutionId, soap: req.body?.soap }));
  } catch (error) {
    console.error('[wellbeing-session] failed:', error?.message || error);
    const message = error?.message || 'Unable to process wellbeing session.';
    const status = /consent|authorised|relationship|canonical counselling/i.test(message) ? 403 : /empty clinical/i.test(message) ? 400 : 500;
    return res.status(status).json({ error: message, code: error?.code || undefined });
  }
}
