import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
const FOUNDER_EMAIL='antonio.antonio.noronha@gmail.com';
function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}
export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed.'});
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  const db=getAdminFirestore();let caller={};try{const s=await db.collection('users').doc(decoded.uid).get();caller=s.exists?s.data():{};}catch(_){ }
  const isFounder=decoded.email_verified===true&&decoded.email?.toLowerCase()===FOUNDER_EMAIL;
  const institutionId=String(req.query?.institutionId||caller.institutionId||'').trim();const rosterId=String(req.query?.rosterId||'').trim();
  if(!institutionId||!rosterId)return res.status(400).json({error:'Institution and student record are required.'});
  if(!isFounder&&!(caller.role==='institution_member'&&caller.institutionId===institutionId))return res.status(403).json({error:'Institution access required.'});
  const roster=await db.collection('institutions').doc(institutionId).collection('roster').doc(rosterId).get();
  if(!roster.exists)return res.status(404).json({error:'Student record not found.'});
  const data=roster.data();if(!data.claimedBy)return res.status(409).json({error:'This student has not yet claimed the assessment code.'});
  const user=await db.collection('users').doc(data.claimedBy).get();if(!user.exists)return res.status(404).json({error:'Student account not found.'});
  const userData=user.data();if(!userData.careerAssessmentV2)return res.status(409).json({error:'Assessment report is not ready yet.'});
  return res.status(200).json({student:{fullName:data.fullName,className:data.className,section:data.section,rollNumber:data.rollNumber},report:userData.careerAssessmentV2});
}
