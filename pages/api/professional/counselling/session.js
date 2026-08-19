import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveStudentIdentity } from '../../../../src/security/studentIdentityResolver.js';
import { resolveCanonicalProfessionalAssignment } from '../../../../src/security/canonicalProfessionalAssignment.js';
import { resolveStudentDocumentRef } from '../../../../src/security/studentDocumentRef.js';
import { resolveServiceConsent, CONSENT_TYPES } from '../../../../src/security/consentResolver.js';
import { buildClinicalRecord } from '../../../../src/security/clinicalRecordContract.js';

const NOTE_FIELDS=['subjective','objective','assessment','plan'];
const CANONICAL_COLLECTION='counsellingClinicalRecords';
function cleanSoap(input={}){const soap={};for(const field of NOTE_FIELDS){if(typeof input[field]==='string')soap[field]=input[field].trim();}return soap;}
function serializeSession(doc){const data=doc.data()||{};return{id:doc.id,...data,createdAt:data.createdAt?.toDate?.()?.toISOString?.()||data.createdAt||null,updatedAt:data.updatedAt?.toDate?.()?.toISOString?.()||data.updatedAt||null};}

export default async function handler(req,res){
 const header=req.headers.authorization||''; if(!header.startsWith('Bearer '))return res.status(401).json({error:'Authentication required'});
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 try{
  const decoded=await getAdminAuth().verifyIdToken(header.slice(7)); const db=getAdminFirestore();
  const requestedStudentId=String(req.query.studentId||req.body?.studentId||'').trim(); if(!requestedStudentId)return res.status(400).json({error:'studentId is required'});
  const identity=await resolveStudentIdentity({db,authUid:requestedStudentId,ssStudentId:requestedStudentId});
  if(!identity?.authUid&&!identity?.documentId)return res.status(404).json({error:'Student not found'});
  const institutionId=String(req.query.institutionId||req.body?.institutionId||'').trim()||null;
  const isAdmin=['admin','super_admin','superadmin'].includes(String(decoded.role||'').toLowerCase());
  const assignment=await resolveCanonicalProfessionalAssignment({db,studentId:identity.authUid||identity.documentId,professionalId:decoded.uid,service:'psychology',institutionId});
  if(!isAdmin&&!assignment.found)return res.status(403).json({error:'Counselling relationship not authorised'});
  const consent=await resolveServiceConsent({db,userId:identity.authUid||identity.documentId,serviceType:CONSENT_TYPES.COUNSELLING});
  if(!consent.allowed)return res.status(403).json({error:'Required counselling consent is not active',code:'CONSENT_REQUIRED'});
  const studentRef=await resolveStudentDocumentRef({db,authUid:identity.authUid,ssStudentId:identity.ssStudentId}); const studentSnap=await studentRef.ref.get();
  if(!studentSnap.exists)return res.status(404).json({error:'Student not found'}); const student={...studentSnap.data(),authUid:studentRef.authUid,ssStudentId:studentRef.ssStudentId};
  const canonicalCollection=db.collection(CANONICAL_COLLECTION);
  if(req.method==='GET'){
   const snapshot=await canonicalCollection.where('authUid','==',studentRef.authUid).orderBy('createdAt','desc').limit(50).get();
   return res.status(200).json({source:'canonical',student:{studentId:studentRef.ssStudentId,ssStudentId:studentRef.ssStudentId,authUid:studentRef.authUid},assignment:assignment.found?assignment.assignment:null,sessions:snapshot.docs.map(serializeSession)});
  }
  const soap=cleanSoap(req.body?.soap); if(!NOTE_FIELDS.some(field=>soap[field]))return res.status(400).json({error:'Cannot save an empty clinical note'});
  if(!assignment.found||assignment.assignment?.status!=='active')return res.status(403).json({error:'A canonical active counselling relationship is required for new clinical records',code:'CANONICAL_RELATIONSHIP_REQUIRED'});
  const now=new Date(); const record=buildClinicalRecord({student,providerId:decoded.uid,relationshipId:assignment.assignment.id,soap,now}); const ref=canonicalCollection.doc();
  await ref.set({...record,recordId:ref.id,studentAuthUid:studentRef.authUid,ssStudentId:studentRef.ssStudentId,institutionId:assignment.assignment.institutionId||institutionId||null,assignmentSlot:assignment.assignment.slot||'primary',migrationSource:'canonical-v1'});
  return res.status(201).json({id:ref.id,recordId:ref.id,studentId:studentRef.ssStudentId,ssStudentId:studentRef.ssStudentId,authUid:studentRef.authUid,createdAt:now.toISOString(),source:'canonical'});
 }catch(error){console.error('Counselling session API error:',error);return res.status(500).json({error:'Unable to process counselling session request'});}
}
