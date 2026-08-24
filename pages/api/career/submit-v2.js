import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_DATA } from '../../../src/data/careers.js';
import { ASSESSMENT_VERSION } from '../../../src/career/careerAssessmentBlueprint.js';
import { resolveBundle } from '../../../src/career/assessmentSelection.js';
import { matchCareerToSelectedProfile, scoreSelectedAssessment } from '../../../src/career/scoreSelectedAssessment.js';
import { PREMIUM_REPORT_PAGE_COUNT, FREE_REPORT_PAGE_COUNT } from '../../../src/career/reportArchitecture.js';

function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}
function safeObject(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}
function safeString(v,max=300){return String(v||'').trim().slice(0,max);}

function buildCareerMatches(scored,intake){
 const academicAverage=Number(intake?.academicAverage||0);
 return CAREER_DATA.map(c=>{const m=matchCareerToSelectedProfile(c,scored,{academicAverage});return{id:c.id,name:c.title,category:c.category,stream:Array.isArray(c.stream)?c.stream.join(' / '):'',riasec:c.riasec||[],explorationIndex:m.explorationIndex,rationale:'This pathway shares some characteristics with the available profile evidence. Explore the pathway details before making a decision.'};}).sort((a,b)=>b.explorationIndex-a.explorationIndex).slice(0,12);
}

export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
 const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const body=req.body||{};
 const pathway=['student','working_professional','hr_role_alignment'].includes(body.pathway)?body.pathway:'student';
 const intake=safeObject(body.intake);
 const answers=safeObject(body.answers);
 const db=getAdminFirestore();
 let userData={};try{const s=await db.collection('users').doc(decoded.uid).get();userData=s.exists?s.data():{};}catch(_){ }

 // Resolve institutional entitlement before selecting the assessment bundle. An
 // institution code is authoritative for the test bundle purchased by that
 // institution; the browser cannot change it by posting another bundleId.
 const requestedCode=safeString(intake.licenseCode||userData.institutionAccessCode,120);
 let institutionEntitled=false;
 let institutionCodeRecord=null;
 if(requestedCode){try{const s=await db.collection('institutionCodes').doc(requestedCode).get();if(s.exists){institutionCodeRecord=s.data();institutionEntitled=s.data()?.status==='redeemed'&&s.data()?.redeemedBy===decoded.uid;}}catch(_){}}
 const institutionBundleId=institutionEntitled?safeString(institutionCodeRecord?.bundleId,160):'';
 const requestedBundleId=safeString(body.bundleId,160);
 const entitlement=userData.careerReportAccess||null;
 const entitlementBundleId=safeString(entitlement?.bundleId||userData.careerAssessmentBundleId,160);
 const bundle=resolveBundle(institutionBundleId||requestedBundleId||entitlementBundleId);
 const scored=scoreSelectedAssessment(answers,{bundleId:bundle.id});
 const matches=buildCareerMatches(scored,intake);
 const reportTier=institutionEntitled?'institution':entitlement?.status==='paid'?'premium':'free';
 const premiumAccess=reportTier!=='free';
 const report={
   version:ASSESSMENT_VERSION,
   pathway,
   bundleId:bundle.id,
   bundleSku:bundle.sku,
   bundleTitle:bundle.title,
   selectedFamilyIds:bundle.familyIds,
   selectedTestCount:bundle.familyCount,
   deliveryMode:bundle.deliveryMode,
   estimatedMinutes:bundle.durationMinutes,
   reportPages:premiumAccess?PREMIUM_REPORT_PAGE_COUNT:FREE_REPORT_PAGE_COUNT,
   reportType:premiumAccess?'full_career_intelligence':'career_snapshot',
   reportTier,
   completedAt:new Date().toISOString(),
   intake:{dob:safeString(intake.dob,30),age:Number.isFinite(Number(intake.age))?Number(intake.age):null,ageBand:safeString(intake.ageBand,30),educationStage:safeString(intake.educationStage,80),board:safeString(intake.board,100),className:safeString(intake.className,100),stream:safeString(intake.stream,100),institutionName:safeString(intake.institutionName||userData.institutionName,160),likedSubjects:Array.isArray(intake.likedSubjects)?intake.likedSubjects.slice(0,30):[],dislikedSubjects:Array.isArray(intake.dislikedSubjects)?intake.dislikedSubjects.slice(0,30):[],hobbies:safeString(intake.hobbies,500),curiosity:safeString(intake.curiosity,500),goal:safeString(intake.goal,500),currentRole:safeString(intake.currentRole,160),professionalIntent:safeString(intake.professionalIntent,80),academicAverage:Number(intake.academicAverage||0)},
   scores:scored,
   careerExploration:matches,
   reflection:{statement:'Results are a structured starting point for exploration, not a verdict about the person.',recommendedNextStep:pathway==='working_professional'?'Review the available stay/grow, lateral pivot and industry pivot pathways with a career professional.':'Explore at least three pathways and compare their education, work, skills and lived experience before deciding.'}
 };
 try{
   await db.collection('users').doc(decoded.uid).set({
     careerAssessmentV2:report,
     careerAssessment:{version:ASSESSMENT_VERSION,completedAt:report.completedAt,bundleId:bundle.id,bundleSku:bundle.sku,selectedFamilyIds:bundle.familyIds,hollandCode:scored.riasecCode?scored.riasecCode.split('').slice(0,3):[],riasecScores:scored.riasec||null,top5Careers:matches.slice(0,5).map(c=>({name:c.name,stream:c.stream,matchScore:c.explorationIndex,tags:c.riasec}))},
     assessmentCompletedAt:report.completedAt,
     riasecCode:scored.riasecCode||null,
     riasecScores:scored.riasec||null,
     careerAssessmentFamilies:bundle.familyIds,
     careerAssessmentBundleId:bundle.id,
     careerAssessmentReportTier:reportTier,
     careerAssessmentReportPages:report.reportPages
   },{merge:true});
   if(institutionEntitled&&institutionCodeRecord?.institutionId&&institutionCodeRecord?.rosterId){await db.collection('institutions').doc(institutionCodeRecord.institutionId).collection('roster').doc(institutionCodeRecord.rosterId).set({assessmentStatus:'completed',reportStatus:'ready',bundleId:bundle.id,bundleSku:bundle.sku,selectedFamilyIds:bundle.familyIds,reportPages:report.reportPages,reportTier,updatedAt:report.completedAt,claimedBy:decoded.uid,claimedAt:institutionCodeRecord.redeemedAt||null},{merge:true});}
   return res.status(200).json({saved:true,report});
 }catch(error){console.error('[career/submit-v2] failed:',error?.message||error);return res.status(500).json({error:'Unable to save the career assessment.'});}
}
