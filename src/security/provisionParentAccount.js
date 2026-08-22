import crypto from 'crypto';
import { ensurePendingRelationship } from './relationshipStore.js';

/**
 * Server-only parent account provisioning.
 *
 * Provisioning creates an invitation and a PENDING canonical relationship.
 * It never manufactures parental consent or activates the relationship.
 * Legacy family.guardians fields remain compatibility projections only.
 */
export async function provisionParentAccount({adminAuth,adminDb,parentName,parentEmail,institutionId=null,institutionName='',rosterIds=[],studentIds=[],provisioningMethod='admin',relationship='guardian',allowUnlinked=false}){
  const name=String(parentName||'').trim().slice(0,180);const email=String(parentEmail||'').trim().toLowerCase().slice(0,254);const relation=['father','mother','guardian'].includes(String(relationship).toLowerCase())?String(relationship).toLowerCase():'guardian';
  if(!name)throw new Error('Parent name is required.');if(!email||!email.includes('@'))throw new Error('A valid parent email is required.');
  if(!Array.isArray(studentIds)||(!studentIds.length&&!allowUnlinked))throw new Error('At least one student must be linked to the parent account.');
  let user;let created=false;
  try{user=await adminAuth.getUserByEmail(email);}catch(error){if(error?.code!=='auth/user-not-found')throw error;const temporaryPassword=crypto.randomBytes(24).toString('base64url');user=await adminAuth.createUser({email,password:temporaryPassword,displayName:name,emailVerified:false,disabled:false});created=true;}
  const existingClaims=user.customClaims||{};const existingRole=typeof existingClaims.role==='string'?existingClaims.role:null;if(existingRole&&existingRole!=='parent')throw new Error(`This email is already assigned to the ${existingRole} role and cannot be provisioned as a parent.`);
  const now=new Date().toISOString();const parentRef=adminDb.collection('users').doc(user.uid);const existingProfileSnap=await parentRef.get();const existingProfile=existingProfileSnap.exists?existingProfileSnap.data()||{}:{};
  const existingInstitutionIds=Array.isArray(existingProfile.institutionIds)?existingProfile.institutionIds.filter(Boolean):[];
  const existingPrimaryInstitution=existingProfile.institutionId||existingInstitutionIds[0]||null;
  if(existingPrimaryInstitution&&institutionId&&existingPrimaryInstitution!==institutionId)throw new Error('This parent account is already linked to another institution and cannot be reassigned across institutions.');
  const mergedInstitutionIds=Array.from(new Set([...existingInstitutionIds,...(institutionId?[institutionId]:[])]));
  const existingInstitutionNames=existingProfile.institutionNames&&typeof existingProfile.institutionNames==='object'?existingProfile.institutionNames:{};
  const institutionNames={...existingInstitutionNames,...(institutionId&&institutionName?{[institutionId]:institutionName}: {})};
  const mergedRosterIds=Array.from(new Set([...(Array.isArray(existingProfile.linkedRosterIds)?existingProfile.linkedRosterIds:[]),...rosterIds.filter(Boolean)]));
  const mergedStudentIds=Array.from(new Set([...(Array.isArray(existingProfile.linkedStudentIds)?existingProfile.linkedStudentIds:[]),...studentIds.filter(Boolean)]));
  const existingRelationships=existingProfile.childRelationships&&typeof existingProfile.childRelationships==='object'?existingProfile.childRelationships:{};
  const childRelationships={...existingRelationships};studentIds.forEach(studentId=>{childRelationships[studentId]=relation;});

  const canonicalType=relation==='guardian'?'guardian':'parent';
  for(const studentId of studentIds){
    await ensurePendingRelationship({db:adminDb,subjectPersonId:studentId,relatedPersonId:user.uid,type:canonicalType,metadata:{source:'parent_provisioning',provisioningMethod}});
  }

  await adminAuth.setCustomUserClaims(user.uid,{...existingClaims,role:'parent'});
  await parentRef.set({name,email,role:'parent',accountType:'parent',parentRelationship:relation,accountProvisioning:{method:provisioningMethod,status:'invited',firstProvisionedAt:existingProfile.accountProvisioning?.firstProvisionedAt||now,lastProvisionedAt:now},institutionId:institutionId||existingProfile.institutionId||null,institutionName:institutionName||existingProfile.institutionName||'',institutionIds:mergedInstitutionIds,institutionNames,linkedRosterIds:mergedRosterIds,linkedStudentIds:mergedStudentIds,childRelationships,consentStatus:existingProfile.consentStatus||'pending',profileComplete:true,updatedAt:now,...(existingProfileSnap.exists?{}:{createdAt:now})},{merge:true});

  for(const studentId of studentIds){
    const studentRef=adminDb.collection('users').doc(studentId);
    await adminDb.runTransaction(async transaction=>{
      const studentSnap=await transaction.get(studentRef);
      if(!studentSnap.exists)throw new Error('A linked student account no longer exists.');
      const student=studentSnap.data()||{};
      const existingGuardianRelationships=student.guardianRelationships&&typeof student.guardianRelationships==='object'?student.guardianRelationships:{};
      const existingGuardians=Array.isArray(student.family?.guardians)?student.family.guardians:[];
      const guardianIndex=existingGuardians.findIndex((guardian)=>guardian?.accountId===user.uid || guardian?.uid===user.uid || guardian?.id===user.uid);
      const existingGuardian=guardianIndex>=0?existingGuardians[guardianIndex]:{};
      const canonicalGuardian={...existingGuardian,accountId:user.uid,relationship:relation,name:name||existingGuardian.name||'',email:email||existingGuardian.email||'',phone:existingGuardian.phone||'',countryCode:existingGuardian.countryCode||null,legalGuardian:existingGuardian.legalGuardian===true,invitationStatus:existingGuardian.invitationStatus||'invited',consentStatus:existingGuardian.consentStatus||existingProfile.consentStatus||'pending'};
      const guardians=guardianIndex>=0?existingGuardians.map((guardian,index)=>index===guardianIndex?canonicalGuardian:guardian):[...existingGuardians,canonicalGuardian];
      transaction.set(studentRef,{guardianRelationships:{...existingGuardianRelationships,[user.uid]:relation},family:{...(student.family||{}),guardians}},{merge:true});
    });
  }

  const activationLink=await adminAuth.generatePasswordResetLink(email);
  return {uid:user.uid,name,email,created,activationLink};
}
