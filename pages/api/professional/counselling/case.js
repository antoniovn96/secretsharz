import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveStudentIdentity } from '../../../../src/security/studentIdentityResolver.js';
import { resolveCanonicalProfessionalAssignment } from '../../../../src/security/canonicalProfessionalAssignment.js';
import { resolveStudentDocumentRef } from '../../../../src/security/studentDocumentRef.js';

function buildStudentProjection(studentId, student = {}) {
  const identity = student.identity || student.profile || {};
  const academic = student.academic || {};
  const current = academic.current || {};
  const phone = identity.phone || student.phone || null;
  return { id:studentId, authUid:student.authUid||student.uid||null, ssStudentId:student.ssStudentId||student.studentId||studentId, name:identity.preferredName||identity.legalName||student.name||student.fullName||null, grade:current.grade||student.grade||null, section:current.section||student.section||null, academicYear:current.academicYear||student.academicYear||null, phone:phone?{countryCode:phone.countryCode||phone.country||'',number:phone.number||(typeof phone==='string'?phone:'')}:null };
}

export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{
  const header=req.headers.authorization||''; if(!header.startsWith('Bearer '))return res.status(401).json({error:'Authentication required'});
  const decoded=await getAdminAuth().verifyIdToken(header.slice(7)); const requestedStudentId=String(req.query.studentId||'').trim();
  if(!requestedStudentId)return res.status(400).json({error:'studentId is required'});
  const db=getAdminFirestore(); const identity=await resolveStudentIdentity({db,authUid:requestedStudentId,ssStudentId:requestedStudentId});
  if(!identity?.authUid&&!identity?.documentId)return res.status(404).json({error:'Student not found'});
  const isAdmin=decoded.role==='super_admin'||decoded.role==='admin'||decoded.role==='superadmin';
  const institutionId=String(req.query.institutionId||'').trim()||null;
  const assignment=await resolveCanonicalProfessionalAssignment({db,studentId:identity.authUid||identity.documentId,professionalId:decoded.uid,service:'psychology',institutionId});
  if(!isAdmin&&!assignment.found)return res.status(403).json({error:'Counselling relationship not authorised'});
  const studentRef=await resolveStudentDocumentRef({db,authUid:identity.authUid,ssStudentId:identity.ssStudentId});
  const studentSnap=await studentRef.ref.get(); if(!studentSnap.exists)return res.status(404).json({error:'Student not found'});
  const student=studentSnap.data()||{};
  return res.status(200).json({student:buildStudentProjection(studentRef.ssStudentId||requestedStudentId,{...student,authUid:studentRef.authUid,ssStudentId:studentRef.ssStudentId}),authorization:{source:assignment.found?'canonical':'admin',migrationFallback:false,assignment:assignment.found?assignment.assignment:null}});
 }catch(error){console.error('Counselling case access error:',error);return res.status(401).json({error:'Unable to authorise counselling case access'});}
}
