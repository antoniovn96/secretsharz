import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getInstitutionCareerReportStatus } from '../../../src/institution/careerReportContractStatus.js';
import { getAssessmentEvidenceCoverage } from '../../../src/career/assessmentCoverage.js';
import { serializeInstitutionalCareerReport } from '../../../src/institution/institutionalCareerReportSerializer.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
function bearerToken(req) { const h=req.headers.authorization||req.headers.Authorization; if(typeof h!=='string')return null; const m=h.match(/^Bearer\s+(.+)$/i); return m?m[1]:null; }

export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed.'});
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const db=getAdminFirestore(),isFounder=decoded.email_verified===true&&decoded.email?.toLowerCase()===FOUNDER_EMAIL,institutionId=String(req.query?.institutionId||decoded.institutionId||'').trim(),rosterId=String(req.query?.rosterId||'').trim();
 if(!institutionId||!rosterId)return res.status(400).json({error:'Institution and student record are required.'});
 const hasInstitutionAccess=decoded.role==='institution_member'&&decoded.institutionRole==='coordinator'&&decoded.institutionId===institutionId;if(!isFounder&&!hasInstitutionAccess)return res.status(403).json({error:'Institution coordinator access required.'});
 const institutionRef=db.collection('institutions').doc(institutionId),institution=await institutionRef.get();if(!institution.exists)return res.status(404).json({error:'Institution not found.'});
 const institutionData=institution.data();if(institutionData.status!=='active')return res.status(409).json({error:'This institution is not active.'});if(institutionData.licenses?.paymentStatus!=='paid'&&!isFounder)return res.status(409).json({error:'Institutional reports are locked until the entitlement is activated.'});
 const roster=await institutionRef.collection('roster').doc(rosterId).get();if(!roster.exists)return res.status(404).json({error:'Student record not found.'});const rosterData=roster.data();
 if(!rosterData.claimedBy)return res.status(409).json({error:'This student has not yet claimed the assessment code.'});if(rosterData.assessmentStatus!=='completed'&&rosterData.reportStatus!=='ready')return res.status(409).json({error:'The student career assessment has not been completed.'});
 const studentSnap=await db.collection('users').doc(rosterData.claimedBy).get();if(!studentSnap.exists)return res.status(404).json({error:'Student account not found.'});const student=studentSnap.data(),careerReport=student.careerAssessmentV2;if(!careerReport)return res.status(409).json({error:'Assessment report is not ready yet.'});
 const report=serializeInstitutionalCareerReport(careerReport),coverage=getInstitutionCareerReportStatus(report),assessmentEvidence=getAssessmentEvidenceCoverage(report);
 return res.status(200).json({student:{fullName:rosterData.fullName||'',className:rosterData.className||'',section:rosterData.section||'',rollNumber:rosterData.rollNumber||''},report,coverage,assessmentEvidence,dataScope:'institutional_career_guidance'});
}
