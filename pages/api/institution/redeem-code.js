import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=120){return String(value||'').trim().slice(0,max);}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  const token=bearerToken(req); if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded; try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  const code=clean(req.body?.code,120).toUpperCase(); if(!code)return res.status(400).json({error:'Please enter your institutional access code.'});
  const db=getAdminFirestore(); const codeRef=db.collection('institutionCodes').doc(code);

  try{
    const result=await db.runTransaction(async transaction=>{
      const codeSnap=await transaction.get(codeRef);
      if(!codeSnap.exists)throw Object.assign(new Error('This access code was not found.'),{status:404});
      const record=codeSnap.data();
      const institutionRef=db.collection('institutions').doc(record.institutionId);
      const rosterRef=institutionRef.collection('roster').doc(record.rosterId);
      const [institutionSnap,rosterSnap]=await Promise.all([transaction.get(institutionRef),transaction.get(rosterRef)]);
      if(!institutionSnap.exists)throw Object.assign(new Error('The institution linked to this code no longer exists.'),{status:404});
      const institution=institutionSnap.data();
      if(institution.status!=='active')throw Object.assign(new Error('This institutional assessment programme is not active yet.'),{status:409});
      if(institution.licenses?.paymentStatus!=='paid')throw Object.assign(new Error('This institutional assessment code is temporarily locked until the institution entitlement is activated.'),{status:409});
      if(!rosterSnap.exists)throw Object.assign(new Error('Student roster record not found.'),{status:404});
      const roster=rosterSnap.data();

      if(record.status==='redeemed'){
        if(record.redeemedBy!==decoded.uid || roster.claimedBy!==decoded.uid)throw Object.assign(new Error('This access code has already been claimed by another account.'),{status:409});
        return {institutionId:record.institutionId,institutionName:record.institutionName,roster};
      }
      if(record.status!=='available')throw Object.assign(new Error('This access code has already been used or is no longer active.'),{status:409});
      if(roster.claimedBy && roster.claimedBy!==decoded.uid)throw Object.assign(new Error('This student record is already linked to another account.'),{status:409});

      let parentSnapshot=null;
      if(roster.parentUid) parentSnapshot=await transaction.get(db.collection('users').doc(roster.parentUid));

      const now=new Date().toISOString();
      transaction.update(codeRef,{status:'redeemed',redeemedBy:decoded.uid,redeemedAt:now});
      transaction.set(rosterRef,{status:'claimed',claimedBy:decoded.uid,claimedAt:now,assessmentStatus:'not_started',reportStatus:'locked_until_completion'},{merge:true});
      transaction.set(db.collection('users').doc(decoded.uid),{
        institutionId:record.institutionId,
        institutionName:record.institutionName,
        institutionRosterId:record.rosterId,
        institutionAccessCode:code,
        institutionAccess:{type:'licensed_assessment',status:'active',grantedAt:now},
        parentUid:roster.parentUid||null,
        parentName:roster.parentName||null,
        parentEmail:roster.parentEmail||null,
      },{merge:true});

      if(parentSnapshot?.exists){
        const parent=parentSnapshot.data()||{};
        const linkedStudentIds=Array.from(new Set([...(Array.isArray(parent.linkedStudentIds)?parent.linkedStudentIds:[]),decoded.uid]));
        transaction.set(db.collection('users').doc(roster.parentUid),{linkedStudentIds,updatedAt:now},{merge:true});
      }
      return {institutionId:record.institutionId,institutionName:record.institutionName,roster:{...roster,fullName:roster.fullName||'',className:roster.className||'',section:roster.section||''}};
    });

    return res.status(200).json({success:true,institution:{id:result.institutionId,name:result.institutionName},student:{fullName:result.roster.fullName||'',className:result.roster.className||'',section:result.roster.section||'',parentUid:result.roster.parentUid||null}});
  }catch(error){return res.status(error.status||500).json({error:error.message||'Unable to redeem institutional access code.'});}
}
