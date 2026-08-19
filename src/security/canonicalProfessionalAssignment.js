import { getAdminFirestore } from './firebaseAdmin.js';
import { resolveStudentIdentity } from './studentIdentityResolver.js';

const RULES = Object.freeze({
  career: { domain:'career', types:['career_counsellor'], slots:['primary'] },
  psychology: { domain:'counselling', types:['primary_counsellor'], slots:['primary','backup'] },
  sen: { domain:'sen', types:['sen_professional'], slots:['primary','multidisciplinary'] },
});

export async function resolveCanonicalProfessionalAssignment({ db=getAdminFirestore(), studentId, professionalId, service, institutionId=null }) {
  const rule=RULES[service];
  if(!rule) return {found:false,reason:'invalid_service'};
  if(!studentId||!professionalId) return {found:false,reason:'missing_identity'};
  const identity=await resolveStudentIdentity({db,authUid:studentId,ssStudentId:studentId});
  if(!identity?.authUid&&!identity?.documentId) return {found:false,reason:'student_not_found'};
  let q=db.collection('relationships').where('subjectPersonId','==',identity.authUid||identity.documentId).where('relatedPersonId','==',professionalId).where('status','==','active').limit(100);
  if(institutionId) q=q.where('metadata.institutionId','==',institutionId);
  const snap=await q.get();
  const matches=snap.docs.map(d=>({id:d.id,...d.data()})).filter(r=>rule.types.includes(r.type)&&r.domain===rule.domain&&rule.slots.includes(String(r.metadata?.slot||'primary').toLowerCase())&&(!institutionId||r.metadata?.institutionId===institutionId));
  if(!matches.length) return {found:false,reason:'not_assigned',identity};
  const assignment=matches[0];
  return {found:true,identity,assignment:{id:assignment.id,professionalId:assignment.relatedPersonId,institutionId:assignment.metadata?.institutionId||null,service:assignment.metadata?.service||service,domain:assignment.domain,slot:assignment.metadata?.slot||'primary',status:assignment.status}};
}

export const PROFESSIONAL_ASSIGNMENT_RULES=RULES;
