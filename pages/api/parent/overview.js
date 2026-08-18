import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}
function clean(value,max=180){return String(value||'').trim().slice(0,max);}
function relationshipLabel(value){return ({father:'Father',mother:'Mother',guardian:'Guardian'})[value]||'Guardian';}

async function latestReport(db, childId, path){
  if(path==='sen'){
    const snap=await db.collection('users').doc(childId).collection('iep_records').orderBy('timestamp','desc').limit(1).get();
    return snap.empty?null:{type:'sen',data:snap.docs[0].data()||{}};
  }
  if(path==='career'){
    const snap=await db.collection('users').doc(childId).collection('career_roadmaps').orderBy('timestamp','desc').limit(1).get();
    return snap.empty?null:{type:'career',data:snap.docs[0].data()||{}};
  }
  return null;
}

function sanitizeChild(data,id,report,relationship){
  const path=data.primary_path||data.studentTrack||'wellbeing';
  const careerDNA=data.careerDNA?.riasec||{};
  const roadmap=report?.type==='career'?report.data:{};
  const sen=report?.type==='sen'?report.data:{};
  return {
    id,
    name:clean(data.name||data.displayName||'Your child'),
    classLevel:clean(data.classLevel||data.grade||''),
    section:clean(data.section||''),
    primary_path:path,
    guardianRelationship:relationshipLabel(relationship),
    career:{
      hollandCode:clean(careerDNA.code||data.riasecCode||''),
      roadmapSummary:clean(roadmap?.phases?.phase2_explore||roadmap?.summary||'',1200),
    },
    sen:{
      goals:Array.isArray(sen.goals)?sen.goals.slice(0,20).map(x=>clean(x,300)):[],
      accommodations:Array.isArray(sen.accommodations)?sen.accommodations.slice(0,20).map(x=>clean(x,200)):[],
    },
    wellbeing:{
      specialistDetailsHidden:true,
    },
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
    const guardianRelationship=child.guardianRelationships?.[decoded.uid];
    if(!guardianRelationship)continue;
    const path=child.primary_path||child.studentTrack||'wellbeing';
    let report=null;
    try{report=await latestReport(db,childId,path);}catch(error){console.error('[parent/overview] report lookup failed:',error?.message||error);}
    children.push(sanitizeChild(child,childId,report,guardianRelationship));
  }

  return res.status(200).json({success:true,parent:{uid:decoded.uid,name:clean(parent.name||decoded.name||'Parent'),email:clean(parent.email||decoded.email||'',254),relationship:relationshipLabel(parent.parentRelationship),institutionId:parent.institutionId||null,institutionName:clean(parent.institutionName||'')},children});
}
