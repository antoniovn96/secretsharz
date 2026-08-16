import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const FOUNDER_EMAIL='antonio.antonio.noronha@gmail.com';
function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed.'});
 const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
 let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const db=getAdminFirestore();
 const userSnap=await db.collection('users').doc(decoded.uid).get();
 const user=userSnap.exists?userSnap.data():{};
 const claims=decoded.customClaims||{};
 const isFounder=decoded.email_verified===true&&decoded.email?.toLowerCase()===FOUNDER_EMAIL;
 const claimInstitutionId=typeof claims.institutionId==='string'?claims.institutionId.trim():'';
 const claimRole=claims.role;
 const claimInstitutionRole=claims.institutionRole;
 const institutionId=String(req.query?.institutionId||claimInstitutionId||'').trim();
 if(!institutionId)return res.status(400).json({error:'Institution ID is required.'});
 const hasInstitutionClaim=claimRole==='institution_member'&&claimInstitutionRole==='coordinator'&&claimInstitutionId===institutionId;
 if(!isFounder&&!hasInstitutionClaim)return res.status(403).json({error:'Institution coordinator access required.'});
 const snap=await db.collection('institutionImports').where('institutionId','==',institutionId).orderBy('createdAt','desc').limit(100).get();
 return res.status(200).json({imports:snap.docs.map(d=>({id:d.id,...d.data()}))});
}
