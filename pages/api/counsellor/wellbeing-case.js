import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveStudentIdentity } from '../../../src/security/studentIdentityResolver.js';
import { resolveCanonicalProfessionalAssignment } from '../../../src/security/canonicalProfessionalAssignment.js';
import { requireServiceConsent, CONSENT_TYPES } from '../../../src/security/consentResolver.js';
import { assertInstitutionReadAccess } from '../../../src/security/institutionReadAuthority.js';
import { assertAccess } from '../../../src/security/accessDecisionService.js';

function bearer(req) { const m = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i); return m?.[1] || null; }
async function authenticate(req, res) { const t = bearer(req); if (!t) { res.status(401).json({ error:'Authentication required.' }); return null; } try { return await getAdminAuth().verifyIdToken(t); } catch { res.status(401).json({ error:'Invalid or expired authentication token.' }); return null; } }

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).json({ error:'Method not allowed.' }); }
  const actor = await authenticate(req,res); if (!actor) return;
  const requestedId = String(req.query.studentId || '').trim();
  const institutionId = String(req.query.institutionId || '').trim();
  if (!requestedId || !institutionId) return res.status(400).json({ error:'studentId and institutionId are required.' });
  try {
    const db = getAdminFirestore();
    const identity = await resolveStudentIdentity({ db, authUid: requestedId, ssStudentId: requestedId });
    await assertInstitutionReadAccess({ db, actorUid: actor.uid, actorRole: actor.role, institutionId, studentId: identity.authUid || identity.documentId });

    const assignment = await resolveCanonicalProfessionalAssignment({
      db,
      studentId: identity.authUid || identity.ssStudentId,
      professionalId: actor.uid,
      service: 'psychology',
      institutionId,
    });
    if (!assignment.found && actor.role !== 'super_admin') return res.status(403).json({ error:'No active counselling assignment for this student.' });

    const actorAssignment = assignment.found ? assignment.assignment : null;
    if (assignment.found) await requireServiceConsent({ db, userId: identity.authUid || identity.ssStudentId, serviceType: CONSENT_TYPES.COUNSELLING });

    const consent = { required:true, status: assignment.found ? 'active' : 'missing' };
    assertAccess({ actor, studentId:identity.authUid, institutionId, service:'psychology', domain:'counselling', relationship:actorAssignment, consent, safeguarding:{ restricted:false } });

    const studentSnap = await db.collection('students').doc(identity.documentId).get();
    if (!studentSnap.exists) return res.status(404).json({ error:'Student not found.' });
    const student = studentSnap.data();

    const releaseSnap = await db.collection('releases').where('studentAuthUid','==',identity.authUid || identity.documentId).where('audience','==','PARENT').where('status','==','ACTIVE').limit(100).get();
    const releasedScopes = [...new Set(releaseSnap.docs.map(d=>d.data()).filter(r => (r.service === 'wellbeing' || r.service === 'psychology' || r.service === 'counselling') && (!r.institutionId || r.institutionId === institutionId)).flatMap(r => Array.isArray(r.scopes) ? r.scopes : (r.scope ? [r.scope] : [])))];

    return res.status(200).json({
      student:{ authUid:identity.authUid, ssStudentId:identity.ssStudentId, name:student.name || student.fullName || null, grade:student.grade || student.currentGrade || null },
      institution:{ id:institutionId },
      service:{ name:'wellbeing', canonicalService:'psychology', domain:'counselling', status:'active', assignmentSlot:actorAssignment?.slot || null, relationshipId:actorAssignment?.id || null },
      operational:{ goals:student.wellbeing?.goals || [], followUps:student.wellbeing?.followUps || [], caseStatus:student.wellbeing?.caseStatus || 'active' },
      sharing:{ parent:{ released:releasedScopes.length > 0, scopes:releasedScopes } },
      protected:{ clinicalNotes:'restricted', privateCounsellorNotes:'restricted', formulation:'restricted' }
    });
  } catch (error) { console.error('[wellbeing-case] failed:', error?.message || error); const status = /identity|membership|assignment|authorized|required|access denied|consent/i.test(error?.message || '') ? 403 : 500; return res.status(status).json({ error:error?.message || 'Unable to load wellbeing case file.' }); }
}
