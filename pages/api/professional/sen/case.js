import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveStudentIdentity } from '../../../../src/security/studentIdentityResolver.js';
import { resolveStudentDocumentRef } from '../../../../src/security/studentDocumentRef.js';
import { resolveCanonicalProfessionalAssignment } from '../../../../src/security/canonicalProfessionalAssignment.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization||'';if(!header.startsWith('Bearer '))return null;return header.slice(7);}
function clean(value){return value==null?'':String(value).trim();}

export default async function handler(req,res){
 if(!['GET'].includes(req.method)){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
 const requestedId=clean(req.query?.studentId); const institutionId=clean(req.query?.institutionId)||null;
 if(!requestedId)return res.status(400).json({error:'studentId is required.'});
 const token=bearerToken(req); if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded; try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 try{
  const db=getAdminFirestore();
  const identity=await resolveStudentIdentity({db,authUid:requestedId,ssStudentId:requestedId});
  if(!identity?.documentId)return res.status(404).json({error:'Student not found.'});
  const studentRef=await resolveStudentDocumentRef({db,authUid:identity.authUid,ssStudentId:identity.ssStudentId});
  const studentSnap=await studentRef.ref.get(); if(!studentSnap.exists)return res.status(404).json({error:'Canonical student record not found.'});
  const student=studentSnap.data()||{};
  const isAdmin=decoded.role==='super_admin'||decoded.role==='admin'||decoded.email?.toLowerCase()==='antonio.antonio.noronha@gmail.com';
  let assignment=null;
  if(!isAdmin){
   const result=await resolveCanonicalProfessionalAssignment({db,studentId:identity.authUid||identity.ssStudentId,professionalId:decoded.uid,service:'sen',institutionId});
   if(!result.found)return res.status(403).json({error:'SEN student access denied.'});
   assignment=result.assignment;
  }
  const identityData=student.identity||student.profile||{};
  const academic=student.academic?.current||{};
  const sen=student.sen||{};
  const iepSnap=await studentRef.ref.collection('sen_iep_records').orderBy('updatedAt','desc').limit(20).get().catch(()=>({docs:[]}));
  const ieps=iepSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
  return res.status(200).json({student:{name:identityData.fullName||student.name||student.fullName||'Student',studentId:identity.ssStudentId,ssStudentId:identity.ssStudentId,authUid:identity.authUid,studentDocumentId:identity.documentId,grade:academic.grade||'',section:academic.section||'',institutionName:academic.institutionName||student.schoolName||student.institutionName||''},sen:{status:sen.status||'active',iep:sen.iep||null},ieps,assignment});
 }catch(error){console.error('[professional sen case] failed:',error);return res.status(500).json({error:'Unable to load the SEN case.'});}
}
