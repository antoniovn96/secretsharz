import crypto from 'crypto';

/**
 * Server-only parent account provisioning.
 *
 * Parents are never created through the public registration UI. An authorised
 * Secret Sharz server workflow provisions the Firebase Auth account, assigns
 * the parent claim, creates the parent profile, links the selected students,
 * and returns an activation link to the authorised provisioning caller.
 */
export async function provisionParentAccount({adminAuth,adminDb,parentName,parentEmail,institutionId=null,institutionName='',rosterIds=[],studentIds=[],provisioningMethod='admin',relationship='guardian'}){
  const name=String(parentName||'').trim().slice(0,180);const email=String(parentEmail||'').trim().toLowerCase().slice(0,254);const relation=['father','mother','guardian'].includes(String(relationship).toLowerCase())?String(relationship).toLowerCase():'guardian';
  if(!name)throw new Error('Parent name is required.');if(!email||!email.includes('@'))throw new Error('A valid parent email is required.');if(!Array.isArray(studentIds)||studentIds.length===0)throw new Error('At least one student must be linked to the parent account.');
  let user;let created=false;
  try{user=await adminAuth.getUserByEmail(email);}catch(error){if(error?.code!=='auth/user-not-found')throw error;const temporaryPassword=crypto.randomBytes(24).toString('base64url');user=await adminAuth.createUser({email,password:temporaryPassword,displayName:name,emailVerified:false,disabled:false});created=true;}
  const existingClaims=user.customClaims||{};const existingRole=typeof existingClaims.role==='string'?existingClaims.role:null;if(existingRole&&existingRole!=='parent')throw new Error(`This email is already assigned to the ${existingRole} role and cannot be provisioned as a parent.`);
  const now=new Date().toISOString();const parentRef=adminDb.collection('users').doc(user.uid);const existingProfileSnap=await parentRef.get();const existingProfile=existingProfileSnap.exists?existingProfileSnap.data()||{}:{};
  // A parent may legitimately have children at more than one institution.
  // Keep the legacy singular fields for compatibility, while maintaining the
  // complete institutional relationship set in institutionIds/names.
  const existingInstitutionIds=Array.isArray(existingProfile.institutionIds)?existingProfile.institutionIds.filter(Boolean):[];
  const mergedInstitutionIds=Array.from(new Set([...existingInstitutionIds,...(institutionId?[institutionId]:[])]));
  const existingInstitutionNames=existingProfile.institutionNames&&typeof existingProfile.institutionNames==='object'?existingProfile.institutionNames:{};
  const institutionNames={...existingInstitutionNames,...(institutionId&&institutionName?{[institutionId]:institutionName}:{})};
  const mergedRosterIds=Array.from(new Set([...(Array.isArray(existingProfile.linkedRosterIds)?existingProfile.linkedRosterIds:[]),...rosterIds.filter(Boolean)]));
  const mergedStudentIds=Array.from(new Set([...(Array.isArray(existingProfile.linkedStudentIds)?existingProfile.linkedStudentIds:[]),...studentIds.filter(Boolean)]));
  const existingRelationships=existingProfile.childRelationships&&typeof existingProfile.childRelationships==='object'?existingProfile.childRelationships:{};
  const childRelationships={...existingRelationships};studentIds.forEach(studentId=>{childRelationships[studentId]=relation;});
  await adminAuth.setCustomUserClaims(user.uid,{...existingClaims,role:'parent'});
  await parentRef.set({name,email,role:'parent',accountType:'parent',parentRelationship:relation,accountProvisioning:{method:provisioningMethod,status:'invited',firstProvisionedAt:existingProfile.accountProvisioning?.firstProvisionedAt||now,lastProvisionedAt:now},institutionId:institutionId||existingProfile.institutionId||null,institutionName:institutionName||existingProfile.institutionName||'',institutionIds:mergedInstitutionIds,institutionNames,linkedRosterIds:mergedRosterIds,linkedStudentIds:mergedStudentIds,childRelationships,consentStatus:existingProfile.consentStatus||'pending',profileComplete:true,updatedAt:now,...(existingProfileSnap.exists?{}:{createdAt:now})},{merge:true});

  // A student may have more than one legitimate parent/guardian account.
  // Store the relationship on the child as a map keyed by parent UID. Only
  // the students explicitly included in this provisioning action receive the
  // new relationship; previously linked children retain their relationship.
  for(const studentId of studentIds){
    const studentRef=adminDb.collection('users').doc(studentId);
    await adminDb.runTransaction(async transaction=>{
      const studentSnap=await transaction.get(studentRef);
      if(!studentSnap.exists)throw new Error('A linked student account no longer exists.');
      const student=studentSnap.data()||{};
      const existingGuardianRelationships=student.guardianRelationships&&typeof student.guardianRelationships==='object'?student.guardianRelationships:{};
      transaction.set(studentRef,{guardianRelationships:{...existingGuardianRelationships,[user.uid]:relation}},{merge:true});
    });
  }

  const activationLink=await adminAuth.generatePasswordResetLink(email);
  return {uid:user.uid,name,email,created,activationLink};
}
