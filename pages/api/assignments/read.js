import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const SERVICE_BY_TYPE = { primary_counsellor: 'wellbeing', career_counsellor: 'career_guidance', sen_professional: 'sen' };

function bearer(req) { const m = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function auth(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const actor = await auth(req, res); if (!actor) return;
  const studentId = String(req.query.studentId || '').trim();
  const service = String(req.query.service || '').toLowerCase();
  const institutionId = String(req.query.institutionId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });
  try {
    const db = getAdminFirestore();
    let query = db.collection('relationships').where('subjectPersonId', '==', studentId).where('status', '==', 'active').limit(200);
    const snap = await query.get();
    const assignments = snap.docs.map((doc) => {
      const d = doc.data();
      const typeService = SERVICE_BY_TYPE[d.type];
      return { id: doc.id, studentId, professionalId: d.relatedPersonId, service: d.metadata?.service || typeService || null, role: d.metadata?.role || null, slot: d.metadata?.slot || null, institutionId: d.metadata?.institutionId || null, status: d.status, startsAt: d.startsAt || null, endsAt: d.endsAt || null };
    }).filter((a) => a.service && (!service || a.service === service) && (!institutionId || a.institutionId === institutionId));
    if (actor.role !== 'super_admin') {
      const actorIsAssigned = assignments.some((a) => a.professionalId === actor.uid);
      const institutionMatch = institutionId && actor.institutionId === institutionId;
      if (!actorIsAssigned && !institutionMatch) return res.status(403).json({ error: 'Not authorized to view these assignments.' });
    }
    return res.status(200).json({ studentId, institutionId: institutionId || null, assignments });
  } catch (error) { console.error('[assignments/read] failed:', error?.message || error); return res.status(500).json({ error: 'Unable to load assignments.' }); }
}
