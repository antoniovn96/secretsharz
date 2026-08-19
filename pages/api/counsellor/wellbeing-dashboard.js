import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { assertInstitutionReadAccess } from '../../../src/security/institutionReadAuthority.js';

function bearer(req) { const m = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function authenticate(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).json({ error:'Method not allowed.' }); }
  const actor = await authenticate(req,res); if (!actor) return;
  const studentId = String(req.query.studentId || '').trim();
  const institutionId = String(req.query.institutionId || '').trim();
  if (!studentId || !institutionId) return res.status(400).json({ error:'studentId and institutionId are required.' });
  try {
    const db = getAdminFirestore();
    await assertInstitutionReadAccess({ db, actorUid: actor.uid, actorRole: actor.role, institutionId, studentId });
    const relSnap = await db.collection('relationships').where('subjectPersonId','==',studentId).where('status','==','active').limit(200).get();
    const active = relSnap.docs.map(d=>({ id:d.id, ...d.data() })).filter(r => r.metadata?.institutionId === institutionId);
    const wellbeing = active.filter(r => r.metadata?.service === 'wellbeing' && r.domain === 'counselling');
    const actorAssignment = wellbeing.find(r => r.relatedPersonId === actor.uid);
    if (!actorAssignment && actor.role !== 'super_admin') return res.status(403).json({ error:'No active wellbeing assignment for this student.' });
    const studentSnap = await db.collection('students').doc(studentId).get();
    const student = studentSnap.exists ? studentSnap.data() : null;
    if (!student) return res.status(404).json({ error:'Student not found.' });
    const parentReleaseSnap = await db.collection('releases').where('studentAuthUid','==',studentId).where('audience','==','PARENT').where('status','==','ACTIVE').limit(50).get();
    const parentReleases = parentReleaseSnap.docs.map(d=>d.data()).filter(r => r.service === 'wellbeing' && (!r.institutionId || r.institutionId === institutionId));
    return res.status(200).json({ counsellor:{ uid:actor.uid, assignmentSlot:actorAssignment?.metadata?.slot || null }, student:{ authUid:studentId, ssStudentId:student.ssStudentId || null, name:student.name || null, grade:student.grade || null }, service:{ name:'wellbeing', status:'active' }, assignment:{ slot:actorAssignment?.metadata?.slot || null, institutionId, startsAt:actorAssignment?.startsAt || null }, sharing:{ parent:{ released:parentReleases.length > 0, scopes:[...new Set(parentReleases.flatMap(r=>Array.isArray(r.scopes)?r.scopes:(r.scope?[r.scope]:[])))] } }, privacy:{ privateClinicalNotes:'restricted', protectedCounsellorNotes:'restricted' } });
  } catch (error) { console.error('[wellbeing-dashboard] failed:', error?.message || error); const status = /required|authorized|assignment/i.test(error?.message || '') ? 403 : 500; return res.status(status).json({ error: error?.message || 'Unable to load wellbeing dashboard.' }); }
}
