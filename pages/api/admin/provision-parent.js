import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { provisionParentAccount } from '../../../src/security/provisionParentAccount.js';
import { canProvisionRole, assertInstitutionScope, getRequesterRole } from '../../../src/security/provisioningAuthorization.js';
import normalizeStudentRecord from '../../../src/platform/studentRecordNormalizer.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=180){return String(value||'').trim().slice(0,max);}
const RELATIONSHIPS=new Set(['father','mother','guardian']);

function assignmentId(assignment){
  if(!assignment)return null;
  if(typeof assignment==='string')return assignment.trim()||null;
  return String(assignment.primaryProfessionalId||assignment.professionalId||assignment.id||'').trim()||null;
}

async function assertStudentLinkScope(db,role,uid,institutionId,studentIds){
  if(role==='admin'||role==='super_admin')return;
  if(!Array.isArray(studentIds)||!studentIds.length)throw new Error('At least one student must be linked to the parent account.');
  for(const studentId of studentIds){
    const snap=await db.collection('users').doc(studentId).get();
    if(!snap.exists||snap.data()?.role!=='student')throw new Error('One or more selected students could not be found.');
    const student=snap.data()||{};
    if(role==='institution'){
      if(!institutionId||student.institutionId!==institutionId)throw new Error('An institution may only link parents to its own students.');
      continue;
    }

    const canonical=normalizeStudentRecord(student,studentId);
    const serviceKey=role==='career_counsellor'?'career':role==='psychologist'?'wellbeing':role==='educator'?'sen':null;
    if(!serviceKey)throw new Error('You are not authorised to link this parent to students.');
    if(canonical.services?.[serviceKey]?.status!=='active')throw new Error('The student does not have an active service eligible for this parent linkage.');
    const assignedId=assignmentId(canonical.relationships?.assignments?.[serviceKey]);
    if(assignedId!==uid)throw new Error('You may only link parents to students assigned to you.');
  }
}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(!canProvisionRole(decoded,'parent'))return res.status(403).json({error:'Only an administrator, authorised professional, or institution may create parent accounts.'});
  const name=clean(req.body?.name);const email=clean(req.body?.email,254).toLowerCase();const institutionId=clean(req.body?.institutionId,120)||null;const institutionName=clean(req.body?.institutionName,180);const role=getRequesterRole(decoded);const relationship=clean(req.body?.relationship,30).toLowerCase();
  const studentIds=Array.isArray(req.body?.studentIds)?Array.from(new Set(req.body.studentIds.filter(Boolean).slice(0,50))):[];
  if(!name||!email)return res.status(400).json({error:'Parent name and email are required.'});
  if(!email.includes('@'))return res.status(400).json({error:'A valid parent email is required.'});
  if(!RELATIONSHIPS.has(relationship))return res.status(400).json({error:'Please select Father, Mother, or Guardian.'});
  if(!studentIds.length)return res.status(400).json({error:'At least one student must be linked to the parent account.'});
  if(role==='institution'&&!assertInstitutionScope(decoded,institutionId))return res.status(403).json({error:'The institution account may only provision parents within its own institution.'});
  try{
    const db=getAdminFirestore();
    await assertStudentLinkScope(db,role,decoded.uid,institutionId,studentIds);
    const result=await provisionParentAccount({adminAuth:getAdminAuth(),adminDb:db,parentName:name,parentEmail:email,institutionId,institutionName,provisioningMethod:role,studentIds,relationship});
    try{await db.collection('auditEvents').add({actorUid:decoded.uid||null,actorEmail:decoded.email||null,actorRole:role,targetUid:result.uid,targetRole:'parent',action:'provision_parent',institutionId,studentIds,relationship,createdAt:new Date().toISOString()});}catch(auditError){console.error('[provision-parent] audit write failed:',auditError?.message||auditError);}
    return res.status(200).json({success:true,parent:{uid:result.uid,name:result.name,email:result.email,created:result.created,activationLink:result.activationLink}});
  }catch(error){return res.status(409).json({error:error?.message||'Unable to provision the parent account.'});}
}
