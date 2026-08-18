import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { provisionParentAccount } from '../../../src/security/provisionParentAccount.js';
import { canProvisionRole, assertInstitutionScope, getRequesterRole } from '../../../src/security/provisioningAuthorization.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=180){return String(value||'').trim().slice(0,max);}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(!canProvisionRole(decoded,'parent'))return res.status(403).json({error:'Only an administrator, authorised professional, or institution may create parent accounts.'});
  const name=clean(req.body?.name);const email=clean(req.body?.email,254).toLowerCase();const institutionId=clean(req.body?.institutionId,120)||null;const institutionName=clean(req.body?.institutionName,180);const role=getRequesterRole(decoded);
  if(!name||!email)return res.status(400).json({error:'Parent name and email are required.'});
  if(!email.includes('@'))return res.status(400).json({error:'A valid parent email is required.'});
  if(role==='institution'&&!assertInstitutionScope(decoded,institutionId))return res.status(403).json({error:'The institution account may only provision parents within its own institution.'});
  try{
    const result=await provisionParentAccount({adminAuth:getAdminAuth(),adminDb:getAdminFirestore(),parentName:name,parentEmail:email,institutionId,institutionName,provisioningMethod:role,studentIds:Array.isArray(req.body?.studentIds)?req.body.studentIds.slice(0,50):[]});
    try{await getAdminFirestore().collection('auditEvents').add({actorUid:decoded.uid||null,actorEmail:decoded.email||null,actorRole:role,targetUid:result.uid,targetRole:'parent',action:'provision_parent',institutionId,createdAt:new Date().toISOString()});}catch(auditError){console.error('[provision-parent] audit write failed:',auditError?.message||auditError);}
    return res.status(200).json({success:true,parent:{uid:result.uid,name:result.name,email:result.email,created:result.created,activationLink:result.activationLink}});
  }catch(error){return res.status(409).json({error:error?.message||'Unable to provision the parent account.'});}
}
