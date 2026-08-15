import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_DATA } from '../../../src/data/careers.js';
import { ASSESSMENT_VERSION, matchCareerToProfile, scoreAssessment } from '../../../src/career/careerAssessmentBlueprint.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
function safeObject(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
function safeString(value, max = 300) { return String(value || '').trim().slice(0, max); }
function buildCareerMatches(scored, intake) {
  const academicAverage = Number(intake?.academicAverage || 0);
  return CAREER_DATA.map((career) => { const match = matchCareerToProfile(career, scored, { academicAverage }); return { id:career.id,name:career.title,category:career.category,stream:Array.isArray(career.stream)?career.stream.join(' / '):'',riasec:career.riasec||[],explorationIndex:match.explorationIndex,rationale:'This pathway shares some characteristics with the profile interest pattern. Explore the pathway details before making a decision.' }; }).sort((a,b)=>b.explorationIndex-a.explorationIndex).slice(0,12);
}

export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
 const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const body=req.body||{};const pathway=['student','working_professional','hr_role_alignment'].includes(body.pathway)?body.pathway:'student';const intake=safeObject(body.intake);const answers=safeObject(body.answers);const scored=scoreAssessment(answers);const matches=buildCareerMatches(scored,intake);
 const db=getAdminFirestore();let userData={};try{const userSnap=await db.collection('users').doc(decoded.uid).get();userData=userSnap.exists?userSnap.data():{};}catch(_){ }
 let entitlement=userData.careerReportAccess||null;const institutionId=safeString(intake.institutionId,120);const codeId=safeString(intake.licenseCode,120);let institutionEntitled=false;let institutionCodeRecord=null;
 if(codeId){try{const codeSnap=await db.collection('institutionCodes').doc(codeId).get();if(codeSnap.exists){institutionCodeRecord=codeSnap.data();institutionEntitled=institutionCodeRecord.status==='redeemed'&&institutionCodeRecord.redeemedBy===decoded.uid;}}catch(_){}}
 const reportTier=institutionEntitled?'institution':entitlement?.status==='paid'?'premium':'free';
 const report={version:ASSESSMENT_VERSION,pathway,reportTier,completedAt:new Date().toISOString(),intake:{dob:safeString(intake.dob,30),age:Number.isFinite(Number(intake.age))?Number(intake.age):null,ageBand:safeString(intake.ageBand,30),educationStage:safeString(intake.educationStage,80),board:safeString(intake.board,100),stream:safeString(intake.stream,100),institutionName:safeString(intake.institutionName,160),currentRole:safeString(intake.currentRole,160),professionalIntent:safeString(intake.professionalIntent,80),academicAverage:Number(intake.academicAverage||0)},scores:scored,careerExploration:matches,reflection:{statement:'Results are a structured starting point for exploration, not a verdict about the person.',recommendedNextStep:pathway==='working_professional'?'Review the stay/grow, lateral pivot and industry pivot pathways with a career professional.':'Explore at least three pathways and compare their education, work, skills and lived experience before deciding.'}};
 try{
  await db.collection('users').doc(decoded.uid).set({careerAssessmentV2:report,careerAssessment:{version:ASSESSMENT_VERSION,completedAt:report.completedAt,hollandCode:scored.riasecCode.split('').slice(0,3),riasecScores:scored.riasec,top5Careers:matches.slice(0,5).map(c=>({name:c.name,stream:c.stream,matchScore:c.explorationIndex,tags:c.riasec}))},assessmentCompletedAt:report.completedAt,riasecCode:scored.riasecCode,riasecScores:scored.riasec},{merge:true});
  if(institutionEntitled&&institutionCodeRecord?.institutionId&&institutionCodeRecord?.rosterId){await db.collection('institutions').doc(institutionCodeRecord.institutionId).collection('roster').doc(institutionCodeRecord.rosterId).set({assessmentStatus:'completed',reportStatus:'ready',updatedAt:report.completedAt,claimedBy:decoded.uid,claimedAt:institutionCodeRecord.redeemedAt||null},{merge:true});}
  return res.status(200).json({saved:true,report});
 }catch(error){console.error('[career/submit-v2] failed:',error?.message||error);return res.status(500).json({error:'Unable to save the career assessment.'});}
}
