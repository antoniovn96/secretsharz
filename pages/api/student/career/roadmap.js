import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { careerRoadmapShareId, SHARED_INFORMATION_AUDIENCES, SHARED_INFORMATION_STATUS } from '../../../../src/platform/sharedInformation.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}

export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(decoded.role!=='student')return res.status(403).json({error:'Student access required.'});

  const db=getAdminFirestore();
  const snap=await db.collection('sharedInformation').doc(careerRoadmapShareId(decoded.uid)).get();
  if(!snap.exists)return res.status(200).json({success:true,roadmap:null});

  const share=snap.data()||{};
  const audiences=Array.isArray(share.audiences)?share.audiences:[];
  if(share.status!==SHARED_INFORMATION_STATUS.ACTIVE || !audiences.includes(SHARED_INFORMATION_AUDIENCES.STUDENT)){
    return res.status(200).json({success:true,roadmap:null});
  }

  return res.status(200).json({
    success:true,
    roadmap:{
      id:share.sourceRecordId||null,
      status:'Published',
      phases:share.data?.phases||{},
      summary:share.data?.summary||'',
      updatedAt:share.updatedAt||share.createdAt||null,
    },
  });
}
