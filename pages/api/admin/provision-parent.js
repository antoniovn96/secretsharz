import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { provisionParentAccount } from '../../../src/security/provisionParentAccount.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=180){return String(value||'').trim().slice(0,max);}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  const isAdmin=decoded.email_verified===true&&decoded.email?.toLowerCase()===FOUNDER_EMAIL || decoded.role==='super_admin';
  if(!isAdmin)return res.status(403).json({error:'Super Admin access required.'});
  const name=clean(req.body?.name);const email=clean(req.body?.email,254).toLowerCase();const institutionId=clean(req.body?.institutionId,120);const institutionName=clean(req.body?.institutionName,180);
  if(!name||!email)return res.status(400).json({error:'Parent name and email are required.'});
  try{
    const result=await provisionParentAccount({adminAuth:getAdminAuth(),adminDb:getAdminFirestore(),parentName:name,parentEmail:email,institutionId:institutionId||null,institutionName});
    return res.status(200).json({success:true,parent:{uid:result.uid,name:result.name,email:result.email,created:result.created,activationLink:result.activationLink}});
  }catch(error){return res.status(409).json({error:error?.message||'Unable to provision the parent account.'});}
}
