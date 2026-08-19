import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveStudentDocumentRef } from '../../../src/security/studentDocumentRef.js';

function bearerToken(req) { const header=req.headers.authorization||req.headers.Authorization; if(typeof header!=='string')return null; const match=header.match(/^Bearer\s+(.+)$/i); return match?match[1]:null; }
function safeString(value){return value==null?'':String(value).trim();}

export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
 const token=bearerToken(req); if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded; try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 try{
  const db=getAdminFirestore();
  const userSnap=await db.collection('users').doc(decoded.uid).get(); const userData=userSnap.exists?userSnap.data()||{}:{};
  const identityRef=await resolveStudentDocumentRef({db,authUid:decoded.uid,ssStudentId:safeString(userData.ssStudentId||userData.identity?.ssStudentId||userData.studentId)||null});
  const [studentSnap,profileSnap,legacyAttemptsSnap]=await Promise.all([
   identityRef.ref.get(),
   db.collection('careerProfiles').doc(identityRef.authUid||decoded.uid).get(),
   db.collection('careerProfiles').doc(identityRef.authUid||decoded.uid).collection('assessments').orderBy('completedAt','desc').limit(20).get(),
  ]);
  const student=studentSnap.exists?studentSnap.data()||{}:{}; const profile=profileSnap.exists?profileSnap.data()||{}:{};
  const hasCanonicalCareer=Boolean(student.careerAssessment||student.careerDataAuthority==='students'||profile.latestAssessmentId);
  const hasAccess=userData.careerReportAccess?.status==='paid'||userData.institutionAccess?.status==='active'||hasCanonicalCareer;
  if(!hasAccess)return res.status(403).json({error:'Career profile access is not active.'});
  if(!studentSnap.exists&&!profileSnap.exists)return res.status(404).json({error:'No Career assessment profile is available.'});
  const attempts=legacyAttemptsSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
  const canonicalAttemptsSnap=await identityRef.ref.collection('career_assessments').orderBy('completedAt','desc').limit(20).get();
  const canonicalAttempts=canonicalAttemptsSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
  const mergedAttempts=[...canonicalAttempts,...attempts.filter(item=>!canonicalAttempts.some(c=>c.id===item.id))].sort((a,b)=>String(b.completedAt||'').localeCompare(String(a.completedAt||''))).slice(0,20);
  const identity=student.identity||student.profile||userData.identity||userData.profile||{};
  const name=String(identity.fullName||identity.name||student.name||student.fullName||userData.name||userData.displayName||decoded.name||'Student').trim()||'Student';
  const canonicalAssessment=student.careerAssessment||profile.assessment||null;
  const exploration=Array.isArray(student.careerExploration)?student.careerExploration:(Array.isArray(profile.careerExploration)?profile.careerExploration:[]);
  return res.status(200).json({authUid:identityRef.authUid||decoded.uid,studentDocumentId:identityRef.documentId,ssStudentId:identityRef.ssStudentId||safeString(userData.ssStudentId||userData.studentId),identity:{name,preferredName:safeString(identity.preferredName||userData.preferredName),photoURL:student.photoURL||userData.photoURL||identity.photoURL||'',email:student.email||userData.email||decoded.email||''},latestAssessmentId:safeString(student.careerAssessment?.latestAssessmentId||profile.latestAssessmentId),latestAssessmentAt:student.assessmentCompletedAt||profile.latestAssessmentAt||null,assessment:canonicalAssessment,careerExploration:exploration,history:mergedAttempts,version:student.careerAssessment?.version||profile.version||null,updatedAt:student.updatedAt||profile.updatedAt||null,dataAuthority:'students'});
 }catch(error){console.error('[career/profile] failed:',error?.message||error);return res.status(500).json({error:'Unable to load the Career profile.'});}
}
