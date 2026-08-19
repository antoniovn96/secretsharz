// Secret Sharz — first-class relationship storage (SERVER-ONLY).
// Assignment scope is student + institution + service/domain + slot.
import { createRelationshipRecord, isKnownValue, RELATIONSHIP_TYPES, SERVICE_DOMAINS, RELATIONSHIP_STATUSES } from '../platform/canonicalModel.js';
import { validateAssignmentSlot } from './assignmentPolicy.js';

const COLLECTION = 'relationships';
function normalizeTimestamp(value) { if (value == null) return null; if (value instanceof Date) return value.toISOString(); if (typeof value === 'string' || typeof value === 'number') return value; return null; }
export function buildRelationshipDocument(input) { const record = createRelationshipRecord(input); return { ...record, startsAt:normalizeTimestamp(record.startsAt), endsAt:normalizeTimestamp(record.endsAt), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() }; }
export function validateRelationshipPatch(patch={}) { if (patch.type!==undefined&&!isKnownValue(patch.type,RELATIONSHIP_TYPES)) throw new Error('Unknown relationship type.'); if (patch.domain!==undefined&&patch.domain!==null&&!isKnownValue(patch.domain,SERVICE_DOMAINS)) throw new Error('Unknown service domain.'); if (patch.status!==undefined&&!isKnownValue(patch.status,RELATIONSHIP_STATUSES)) throw new Error('Unknown relationship status.'); if (patch.subjectPersonId!==undefined&&!patch.subjectPersonId) throw new Error('subjectPersonId cannot be empty.'); if (patch.relatedPersonId!==undefined&&!patch.relatedPersonId) throw new Error('relatedPersonId cannot be empty.'); if (patch.subjectPersonId&&patch.relatedPersonId&&patch.subjectPersonId===patch.relatedPersonId) throw new Error('A relationship cannot target the same person.'); return true; }
function scopedQuery(db,{subjectPersonId,type,domain=null,institutionId=null,slot=null}) { let query=db.collection(COLLECTION).where('subjectPersonId','==',subjectPersonId).where('type','==',type).where('status','==','active').limit(50); if (institutionId) query=query.where('metadata.institutionId','==',institutionId); if (slot) query=query.where('metadata.slot','==',slot); return {query,domain}; }
async function findActiveRelationships({db,subjectPersonId,type,domain=null,institutionId=null,slot=null}) { if(!db) throw new Error('Firestore instance is required.'); if(!subjectPersonId||!type)return[]; const {query}=scopedQuery(db,{subjectPersonId,type,domain,institutionId,slot}); const snapshot=await query.get(); return snapshot.docs.map(doc=>({ref:doc.ref,id:doc.id,...doc.data()})).filter(item=>domain==null||item.domain==null||item.domain===domain); }
export async function createRelationship({db,...input}) { if(!db)throw new Error('Firestore instance is required.'); const document=buildRelationshipDocument(input); const ref=db.collection(COLLECTION).doc(); await ref.set({...document,relationshipId:ref.id}); return{id:ref.id,...document,relationshipId:ref.id}; }

/** Atomically replace the active assignment for one student/institution/service/slot. */
export async function reassignRelationship({db,subjectPersonId,relatedPersonId,type,domain=null,institutionId=null,service=null,slot='primary',consentRequired=true,startsAt=new Date().toISOString(),metadata={}}) {
  if(!db)throw new Error('Firestore instance is required.'); validateRelationshipPatch({subjectPersonId,relatedPersonId,type,domain});
  const resolvedService=String(service||metadata.service||'').toLowerCase();
  const resolvedSlot=validateAssignmentSlot(resolvedService,slot).slot;
  if(!institutionId) throw new Error('institutionId is required for scoped professional assignments.');
  let result=null;
  await db.runTransaction(async tx=>{
    const {query}=scopedQuery(db,{subjectPersonId,type,domain,institutionId,slot:resolvedSlot}); const snapshot=await tx.get(query);
    const active=snapshot.docs.map(doc=>({ref:doc.ref,id:doc.id,...doc.data()})).filter(item=>domain==null||item.domain==null||item.domain===domain);
    const conflicting=active.filter(item=>item.relatedPersonId!==relatedPersonId); const now=new Date().toISOString();
    for(const relationship of conflicting) tx.update(relationship.ref,{status:'ended',endsAt:now,updatedAt:now});
    const existingTarget=active.find(item=>item.relatedPersonId===relatedPersonId);
    if(existingTarget){ result={id:existingTarget.id,...existingTarget,status:'active',reassigned:conflicting.length>0}; return; }
    const document=buildRelationshipDocument({subjectPersonId,relatedPersonId,type,domain,status:'active',startsAt,endsAt:null,consentRequired});
    const ref=db.collection(COLLECTION).doc(); tx.set(ref,{...document,relationshipId:ref.id,metadata:{...metadata,institutionId,service:resolvedService,slot:resolvedSlot}}); result={id:ref.id,...document,relationshipId:ref.id,metadata:{...metadata,institutionId,service:resolvedService,slot:resolvedSlot},reassigned:conflicting.length>0};
  }); return result;
}
export async function endRelationships({db,subjectPersonId,type,domain=null,institutionId=null,slot=null,endsAt=new Date().toISOString()}) { if(!db)throw new Error('Firestore instance is required.'); validateRelationshipPatch({subjectPersonId,type,domain}); let count=0; await db.runTransaction(async tx=>{const {query}=scopedQuery(db,{subjectPersonId,type,domain,institutionId,slot}); const snapshot=await tx.get(query); const active=snapshot.docs.map(doc=>({ref:doc.ref,...doc.data()})).filter(item=>domain==null||item.domain==null||item.domain===domain); for(const relationship of active)tx.update(relationship.ref,{status:'ended',endsAt,updatedAt:endsAt}); count=active.length;}); return count; }
export async function getActiveRelationship({db,subjectPersonId,relatedPersonId,type,domain=null,institutionId=null,slot=null}) { if(!db)throw new Error('Firestore instance is required.'); if(!subjectPersonId||!relatedPersonId||!type)return null; const {query}=scopedQuery(db,{subjectPersonId,type,domain,institutionId,slot}); const snapshot=await query.get(); const matches=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(item=>item.relatedPersonId===relatedPersonId&&(domain==null||item.domain==null||item.domain===domain)); return matches[0]||null; }
export async function hasActiveRelationship({db,subjectPersonId,relatedPersonId,types=[],domain=null,institutionId=null,slots=[]}) { const allowedTypes=Array.isArray(types)?types:[types]; const allowedSlots=Array.isArray(slots)?slots:[slots]; for(const type of allowedTypes.filter(Boolean)){ if(allowedSlots.length){for(const slot of allowedSlots.filter(Boolean)){if(await getActiveRelationship({db,subjectPersonId,relatedPersonId,type,domain,institutionId,slot}))return true;}} else if(await getActiveRelationship({db,subjectPersonId,relatedPersonId,type,domain,institutionId}))return true; } return false; }
export const RELATIONSHIP_COLLECTION=COLLECTION;
