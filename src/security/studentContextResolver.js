import { resolveStudentIdentity } from './studentIdentityResolver.js';
import { normalizePlatformEntitlement, resolvePlatformAccess } from './platformEntitlement.js';

export async function resolveStudentContext({ db, authUid, ssStudentId, institutionId = null }) {
  const identity = await resolveStudentIdentity({ db, authUid, ssStudentId });
  const institutionSnap = await db.collection('relationships').where('subjectPersonId','==',identity.authUid || identity.documentId).where('type','==','institution_member').where('status','==','active').limit(100).get();
  const institutions = institutionSnap.docs.map(d => ({ id:d.id, ...d.data() })).map(r => ({ institutionId:r.metadata?.institutionId || r.relatedPersonId || null, role:r.metadata?.role || null, status:r.status, startsAt:r.startsAt || null, endsAt:r.endsAt || null })).filter(i => i.institutionId);
  const requested = institutionId ? institutions.find(i => i.institutionId === institutionId) || null : null;
  const studentSnap = identity.documentId ? await db.collection('students').doc(identity.documentId).get() : null;
  const student = studentSnap?.exists ? studentSnap.data() : {};
  const entitlement = normalizePlatformEntitlement(student.platformEntitlement || {});
  const access = resolvePlatformAccess({ platformEntitlement: entitlement, activeInstitutionCount: institutions.length });
  return { identity, platform: { entitlement, tier: access.tier }, institutions, context: requested ? { type:'institution', institutionId:requested.institutionId, role:requested.role } : { type:'platform', institutionId:null }, capabilities: { platform:true, institution: Boolean(requested) } };
}
