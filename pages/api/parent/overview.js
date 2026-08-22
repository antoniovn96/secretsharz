import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveStudentProfile } from '../../../src/platform/studentProfileResolver.js';
import { careerRoadmapShareId, SHARED_INFORMATION_AUDIENCES, SHARED_INFORMATION_STATUS } from '../../../src/platform/sharedInformation.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=180){return String(value||'').trim().slice(0,max);}
function relationshipLabel(value){return ({father:'Father',mother:'Mother',guardian:'Guardian'})[value]||'Guardian';}

async function latestCareerReport(db, childId){
  const sharedSnap=await db.collection('sharedInformation').doc(careerRoadmapShareId(childId)).get();
  if(!sharedSnap.exists)return null;
  const shared=sharedSnap.data()||{};
  const audiences=Array.isArray(shared.audiences)?shared.audiences:[];
  if(shared.status!==SHARED_INFORMATION_STATUS.ACTIVE || !audiences.includes(SHARED_INFORMATION_AUDIENCES.PARENT))return null;
  return {type:'career',data:shared.data||{},shared:true};
}

async function latestSenReport(db, childId){
  // The SEN professional API writes canonical IEP records here. Do not read
  // the legacy users/{id}/iep_records collection from the parent surface.
  const snap=await db.collection('sen').doc(childId).collection('iep_records').orderBy('createdAt','desc').limit(1).get();
  if(snap.empty)return null;
  return {type:'sen',data:snap.docs[0].data()||{}};
}

function activeService(profile){
  if(profile?.services?.career?.status==='active')return 'career';
  if(profile?.services?.sen?.status==='active')return 'sen';
  return 'wellbeing';
}

function sanitizeChild(profile,id,reports,relationship){
  const careerDNA=profile.career?.profile?.riasec||profile.career?.riasec||{};
  const careerReport=reports.career?.data||{};
  const sen=reports.sen?.data||{};
  return {
    id,
    name:clean(profile.identity?.fullName||'Your child'),
    classLevel:clean(profile.academic?.current?.grade||''),
    section:clean(profile.academic?.current?.section||''),
    primary_path:activeService(profile),
    guardianRelationship:relationshipLabel(relationship),
    career:{
      hollandCode:clean(careerDNA.code||''),
      roadmapSummary:clean(careerReport?.phases?.phase2_explore||careerReport?.summary||'',1200),
    },
    sen:{
      goals:Array.isArray(sen.goals)?sen.goals.slice(0,20).map(x=>clean(x,300)):[],
      accommodations:Array.isArray(sen.accommodations)?sen.accommodations.slice(0,20).map(x=>clean(x,200)):[],
    },
    wellbeing:{specialistDetailsHidden:true},
  };
}

export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
  const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
  if(decoded.role!=='parent')return res.status(403).json({error:'Parent access required.'});

  const db=getAdminFirestore();
  const parentSnap=await db.collection('users').doc(decoded.uid).get();
  if(!parentSnap.exists)return res.status(404).json({error:'Parent profile not found.'});
  const parent=parentSnap.data()||{};
  if(parent.role!=='parent')return res.status(403).json({error:'Parent access required.'});

  const studentIds=Array.isArray(parent.linkedStudentIds)?parent.linkedStudentIds.filter(Boolean):[];
  const children=[];
  for(const childId of studentIds){
    const childSnap=await db.collection('users').doc(childId).get();
    if(!childSnap.exists)continue;
    const child=childSnap.data()||{};
    const resolved=resolveStudentProfile(child,{role:'parent',uid:decoded.uid});
    if(!resolved.allowed)continue;

    const relationship=resolved.profile.family?.guardians?.find((guardian)=>guardian.accountId===decoded.uid)?.relationship
      || parent.childRelationships?.[childId]
      || 'guardian';
    const reports={career:null,sen:null};
    try{
      if(resolved.profile.services?.career?.status==='active')reports.career=await latestCareerReport(db,childId);
      if(resolved.profile.services?.sen?.status==='active')reports.sen=await latestSenReport(db,childId);
    }catch(error){console.error('[parent/overview] report lookup failed:',error?.message||error);}
    children.push(sanitizeChild(resolved.profile,childId,reports,relationship));
  }

  return res.status(200).json({success:true,parent:{uid:decoded.uid,name:clean(parent.name||decoded.name||'Parent'),email:clean(parent.email||decoded.email||'',254),relationship:relationshipLabel(parent.parentRelationship),institutionId:parent.institutionId||null,institutionName:clean(parent.institutionName||'')},children});
}
