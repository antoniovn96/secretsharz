import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) { const header=req.headers.authorization||req.headers.Authorization; if(typeof header!=='string') return null; const match=header.match(/^Bearer\s+(.+)$/i); return match?match[1]:null; }
function toMillis(value){ if(!value)return null; if(typeof value.toMillis==='function')return value.toMillis(); if(typeof value.toDate==='function')return value.toDate().getTime(); if(value instanceof Date)return value.getTime(); if(typeof value==='number')return value; if(typeof value==='string'){const parsed=Date.parse(value);return Number.isNaN(parsed)?null:parsed;} return null; }
function toIso(value){const millis=toMillis(value);return millis==null?null:new Date(millis).toISOString();}
function safeAuthError(error){return{code:error?.code||null,message:error?.message||'Unknown Firebase Auth verification error',expectedProjectId:getAdminApp()?.options?.projectId||null};}
function publicStudentRecord(doc,source='students') { const data=doc.data()||{}; const authUid=data.authUid||data.uid||data.userId||(source==='users'?doc.id:null); const ssStudentId=data.ssStudentId||data.studentId||(String(doc.id).startsWith('SS-')?doc.id:null); return { id:ssStudentId||doc.id, studentId:ssStudentId||doc.id, ssStudentId:ssStudentId||null, authUid:authUid||null, source, name:data.name||data.fullName||'', email:data.email||'', photoURL:data.photoURL||'', role:data.role||'', profileType:data.profileType||'', age:data.age??null, dob:data.dob||data.dateOfBirth||'', grade:data.grade||data.gradeOrCourse||'', schoolName:data.schoolName||'', institutionName:data.institutionName||'', parentName:data.parentName||'', parentContact:data.parentContact||'', contactNumber:data.contactNumber||data.phone||'', primary_path:data.primary_path||'', studentTrack:data.studentTrack||'', path:getStudentPath(data), profileComplete:data.profileComplete===true, onboardingCompleted:data.onboardingCompleted===true, riasecCode:data.riasecCode||data.careerDNA?.riasec?.code||'', riasecScores:data.riasecScores||data.careerDNA?.riasec?.scores||{}, careerAssessment:data.careerAssessment||null, assessmentCompletedAt:toIso(data.assessmentCompletedAt||data.careerAssessment?.completedAt), careerReportAccess:data.careerReportAccess||null, createdAt:toIso(data.createdAt), createdAtMs:toMillis(data.createdAt), updatedAt:toIso(data.updatedAt)}; }
function mergeRecords(primary, legacy){const merged={...legacy,...primary}; merged.source=primary?'students':'users'; merged.id=primary?.ssStudentId||legacy?.ssStudentId||primary?.id||legacy?.id; merged.studentId=merged.id; merged.ssStudentId=primary?.ssStudentId||legacy?.ssStudentId||merged.id||null; merged.authUid=primary?.authUid||legacy?.authUid||null; return merged;}

export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
 const idToken=bearerToken(req); if(!idToken)return res.status(401).json({error:'Authentication required.'});
 let decodedToken; try{decodedToken=await getAdminAuth().verifyIdToken(idToken);}catch(error){console.error('[admin students auth] Firebase ID token verification failed:',safeAuthError(error));return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const isFounder=decodedToken.email_verified===true&&decodedToken.email==='antonio.antonio.noronha@gmail.com'; const isSuperAdmin=decodedToken.role==='super_admin'; if(!isFounder&&!isSuperAdmin)return res.status(403).json({error:'Super Admin access required.'});
 try{
  const db=getAdminFirestore();
  const [canonicalSnapshot,legacySnapshot]=await Promise.all([db.collection('students').get(),db.collection('users').get()]);
  const canonical=new Map(); canonicalSnapshot.docs.filter(doc=>isStudentProfile(doc.data()||{})||doc.id.startsWith('SS-')).forEach(doc=>{const record=publicStudentRecord(doc,'students'); canonical.set(record.ssStudentId||record.authUid||record.id,record);});
  const legacy=new Map(); legacySnapshot.docs.filter(doc=>isStudentProfile(doc.data()||{})).forEach(doc=>{const record=publicStudentRecord(doc,'users'); legacy.set(record.ssStudentId||record.authUid||record.id,record);});
  const keys=new Set([...canonical.keys(),...legacy.keys()]);
  const students=[...keys].map(key=>mergeRecords(canonical.get(key),legacy.get(key))).sort((a,b)=>(b.createdAtMs||0)-(a.createdAtMs||0));
  return res.status(200).json({generatedAt:new Date().toISOString(),students,count:students.length,identity:{primary:'students',legacyFallback:'users'}});
 }catch(error){console.error('[admin students] failed:',error);return res.status(500).json({error:'Unable to load the student directory.'});}
}
