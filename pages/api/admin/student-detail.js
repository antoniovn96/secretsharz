import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveStudentIdentity } from '../../../src/security/studentIdentityResolver.js';
import resolveStudentProfile from '../../../src/platform/studentProfileResolver.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}

export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
 const studentId=String(req.query?.studentId||'').trim(); if(!studentId)return res.status(400).json({error:'studentId is required.'});
 const idToken=bearerToken(req); if(!idToken)return res.status(401).json({error:'Authentication required.'});
 let viewer; try{const decoded=await getAdminAuth().verifyIdToken(idToken);viewer={id:decoded.uid,uid:decoded.uid,role:decoded.role||decoded.userRole||decoded.profileType,profileType:decoded.profileType,institutionId:decoded.institutionId||decoded.institutionID};}catch(error){console.error('[student-detail] token verification failed:',error);return res.status(401).json({error:'Invalid or expired authentication token.'});}
 try{
  const db=getAdminFirestore();
  const identity=await resolveStudentIdentity({db,authUid:studentId,ssStudentId:studentId});
  let snapshot=identity.documentId?await db.collection('students').doc(identity.documentId).get():null;
  if(!snapshot?.exists && identity.legacyDocumentId) snapshot=await db.collection('users').doc(identity.legacyDocumentId).get();
  if(!snapshot?.exists)return res.status(404).json({error:'Student not found.'});
  const rawStudent={id:snapshot.id,...snapshot.data(),authUid:identity.authUid,ssStudentId:identity.ssStudentId};
  const resolved=resolveStudentProfile(rawStudent,viewer);
  if(!resolved.allowed)return res.status(403).json({error:'You do not have an authorized relationship with this student.'});
  return res.status(200).json({studentId:identity.ssStudentId||studentId,ssStudentId:identity.ssStudentId||studentId,authUid:identity.authUid,identitySource:identity.source,...resolved});
 }catch(error){console.error('[student-detail] failed:',error);const status=/identity|conflict|resolved/i.test(error?.message||'')?404:500;return res.status(status).json({error:status===404?error.message:'Unable to load the student profile.'});}
}
