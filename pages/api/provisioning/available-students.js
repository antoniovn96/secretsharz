import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { canProvisionRole, getRequesterRole } from '../../../src/security/provisioningAuthorization.js';
import normalizeStudentRecord from '../../../src/platform/studentRecordNormalizer.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=120){return String(value||'').trim().slice(0,max);}
function assignmentId(assignment){if(!assignment)return null;if(typeof assignment==='string')return assignment.trim()||null;return String(assignment.primaryProfessionalId||assignment.professionalId||assignment.id||'').trim()||null;}

function professionalCanLinkStudent(student,role,uid){
  if(role==='admin'||role==='super_admin')return true;
  const serviceKey=role==='career_counsellor'?'career':role==='psychologist'?'wellbeing':role==='educator'?'sen':null;
  if(!serviceKey)return false;
  const canonical=normalizeStudentRecord(student,student.id);
  if(canonical.services?.[serviceKey]?.status!=='active')return false;
  return assignmentId(canonical.relationships?.assignments?.[serviceKey])===uid;
}

export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(!canProvisionRole(decoded,'parent'))return res.status(403).json({error:'You are not authorised to link parents to students.'});
  const role=getRequesterRole(decoded);const institutionId=clean(req.query?.institutionId);
  try{
    const snap=await getAdminFirestore().collection('users').where('role','==','student').get();
    const students=snap.docs.map(doc=>({id:doc.id,...doc.data()})).filter(student=>{
      if(role==='admin'||role==='super_admin')return true;
      if(role==='institution')return !!institutionId&&student.institutionId===institutionId&&student.institutionId===decoded.institutionId;
      return professionalCanLinkStudent(student,role,decoded.uid);
    }).map(student=>({id:student.id,name:student.name||student.displayName||'',email:student.email||'',grade:student.grade||student.classLevel||'',institutionId:student.institutionId||null}));
    return res.status(200).json({students});
  }catch(error){console.error('[available-students]',error);return res.status(500).json({error:'Unable to load students available for parent linking.'});}
}
