import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { canAssignProfessional, assignmentConfig } from '../../../src/security/serviceAssignmentPolicy.js';
import { canEndAssignment, canPromoteBackup } from '../../../src/security/serviceAssignmentLifecycle.js';
import { buildAssignmentMutation } from '../../../src/security/serviceAssignmentTransaction.js';
import { getActiveRelationship } from '../../../src/security/relationshipStore.js';

const REL_TYPE = { wellbeing: 'primary_counsellor', career_guidance: 'career_counsellor', sen: 'sen_professional' };
const DOMAIN = { wellbeing: 'counselling', career_guidance: 'career', sen: 'sen' };

function bearer(req) { const m = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function authenticate(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error: 'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return null; } }
async function institutionMembership(db, userId, institutionId) { const s = await db.collection('relationships').where('subjectPersonId','==',userId).where('type','==','institution_member').where('status','==','active').limit(50).get(); return s.docs.map(d=>({id:d.id,...d.data()})).find(r => r.domain === 'institution' && r.metadata?.institutionId === institutionId); }
async function studentMembership(db, studentId, institutionId) { const s = await db.collection('relationships').where('subjectPersonId','==',studentId).where('type','==','institution_member').where('status','==','active').limit(50).get(); return s.docs.map(d=>({id:d.id,...d.data()})).find(r => r.domain === 'institution' && r.metadata?.institutionId === institutionId); }

export default async function handler(req, res) {
  if (!['POST','PATCH'].includes(req.method)) { res.setHeader('Allow','POST, PATCH'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const actor = await authenticate(req, res); if (!actor) return;
  const body = req.body || {}; const db = getAdminFirestore();
  const studentId = String(body.studentId || '').trim(); const professionalId = String(body.professionalId || '').trim(); const service = String(body.service || '').toLowerCase(); const institutionId = String(body.institutionId || '').trim();
  if (!studentId || !professionalId || !service || !institutionId) return res.status(400).json({ error: 'studentId, professionalId, service and institutionId are required.' });
  if (!assignmentConfig(service)) return res.status(400).json({ error: 'Unsupported service.' });
  try {
    const actorRole = String(actor.role || '').toLowerCase();
    const staff = await institutionMembership(db, professionalId, institutionId);
    const student = await studentMembership(db, studentId, institutionId);
    const role = String(body.professionalRole || staff?.metadata?.role || '').toLowerCase();
    if (!staff || !student) return res.status(403).json({ error: 'Active professional and student institution memberships are required.' });
    if (actorRole !== 'super_admin' && actor.uid !== professionalId) return res.status(403).json({ error: 'Only the authorized professional or super admin may perform this operation.' });

    const existingSnap = await db.collection('relationships').where('subjectPersonId','==',studentId).where('type','==',REL_TYPE[service]).where('status','==','active').limit(50).get();
    const existing = existingSnap.docs.map(d=>({ relationshipId:d.id, ...d.data(), slot:d.data().metadata?.slot || (service === 'sen' ? 'team' : 'primary') }));
    const relationshipAuthorized = Boolean(await getActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: professionalId, type: REL_TYPE[service], domain: DOMAIN[service] })) || actorRole === 'super_admin';

    if (req.method === 'POST') {
      const slot = String(body.slot || (service === 'sen' ? 'team' : 'primary')).toLowerCase();
      const allowed = actorRole === 'super_admin' || canAssignProfessional({ service, role, institutionId, targetInstitutionId: institutionId, professionalInstitutionActive: true, studentInstitutionActive: true });
      if (!allowed) return res.status(403).json({ error: 'Not authorized to create this assignment.' });
      const relationshipId = `pending-${professionalId}-${Date.now()}`;
      const next = buildAssignmentMutation({ service, assignments: existing, action: { type: 'assign', assignment: { relationshipId, status: 'active', slot, relatedPersonId: professionalId, metadata: { service, slot, institutionId, role } } } });
      const ref = db.collection('relationships').doc();
      await ref.set({ subjectPersonId: studentId, relatedPersonId: professionalId, type: REL_TYPE[service], domain: DOMAIN[service], status: 'active', startsAt: new Date().toISOString(), endsAt: null, consentRequired: false, metadata: { service, slot, institutionId, role }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      return res.status(201).json({ assignment: { id: ref.id, service, slot, studentId, professionalId, institutionId } });
    }

    const action = String(body.action || '').toLowerCase(); const relationshipId = String(body.relationshipId || '').trim();
    const target = existing.find(a => a.relationshipId === relationshipId);
    if (!target) return res.status(404).json({ error: 'Active assignment not found.' });
    if (action === 'end') {
      if (actorRole !== 'super_admin' && !canEndAssignment({ assignment: target, actorAuthorized: actor.uid === target.relatedPersonId })) return res.status(403).json({ error: 'Not authorized to end assignment.' });
      await db.collection('relationships').doc(relationshipId).update({ status: 'ended', endsAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      return res.status(200).json({ ended: true, relationshipId });
    }
    if (action === 'promote_backup') {
      const backup = target;
      if (actorRole !== 'super_admin' && actor.uid !== backup.relatedPersonId) return res.status(403).json({ error: 'Not authorized to promote this backup.' });
      if (!canPromoteBackup({ service, primaryAssignment: existing.find(a => a.slot === 'primary'), backupAssignment: backup, actorAuthorized: true })) return res.status(403).json({ error: 'Backup promotion not permitted.' });
      const next = buildAssignmentMutation({ service, assignments: existing, action: { type: 'promote_backup', backupRelationshipId: relationshipId } });
      const tx = db.runTransaction(async transaction => { for (const a of next) { if (a.relationshipId === relationshipId) transaction.update(db.collection('relationships').doc(a.relationshipId), { 'metadata.slot': 'primary', updatedAt: new Date().toISOString() }); else if (a.status === 'ended' && a.relationshipId !== relationshipId) transaction.update(db.collection('relationships').doc(a.relationshipId), { status: 'ended', endsAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); } });
      await tx;
      return res.status(200).json({ promoted: true, relationshipId });
    }
    return res.status(400).json({ error: 'Unsupported assignment action.' });
  } catch (error) { console.error('[assignments] failed:', error?.message || error); return res.status(400).json({ error: error?.message || 'Assignment operation failed.' }); }
}
