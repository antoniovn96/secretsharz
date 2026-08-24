import { getAdminAuth } from '../../../src/security/firebaseAdmin.js';
import { acceptGuardianRelationship } from '../../../src/security/guardianRelationshipAcceptance.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(decoded.role!=='parent')return res.status(403).json({error:'Parent access required.'});
  const relationshipId=typeof req.body?.relationshipId==='string'?req.body.relationshipId.trim():'';
  if(!relationshipId)return res.status(400).json({error:'relationshipId is required.'});
  try{
    const accepted=await acceptGuardianRelationship({guardianId:decoded.uid,relationshipId});
    return res.status(200).json({success:true,relationship:accepted});
  }catch(error){
    const message=String(error?.message||'Unable to accept relationship.');
    if(/not found|only the invited|only pending|not configured|age band|not eligible/i.test(message))return res.status(403).json({error:'Relationship cannot be accepted.'});
    console.error('[parent/accept-relationship]',message);
    return res.status(500).json({error:'Unable to accept relationship.'});
  }
}
