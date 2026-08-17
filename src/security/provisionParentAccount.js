import crypto from 'crypto';

/**
 * Server-only parent account provisioning.
 *
 * Parents are never created through the public registration UI. An authorised
 * Secret Sharz server workflow provisions the Firebase Auth account, assigns
 * the parent claim, creates the parent profile, and returns a one-time
 * password-reset/activation link to the authorised provisioning caller.
 *
 * The activation link is intentionally NOT stored in Firestore.
 */
export async function provisionParentAccount({
  adminAuth,
  adminDb,
  parentName,
  parentEmail,
  institutionId = null,
  institutionName = '',
  rosterIds = [],
  studentIds = [],
}) {
  const name = String(parentName || '').trim().slice(0, 180);
  const email = String(parentEmail || '').trim().toLowerCase().slice(0, 254);
  if (!name) throw new Error('Parent name is required.');
  if (!email || !email.includes('@')) throw new Error('A valid parent email is required.');

  let user;
  let created = false;
  try {
    user = await adminAuth.getUserByEmail(email);
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') throw error;
    const temporaryPassword = crypto.randomBytes(24).toString('base64url');
    user = await adminAuth.createUser({
      email,
      password: temporaryPassword,
      displayName: name,
      emailVerified: false,
      disabled: false,
    });
    created = true;
  }

  const existingClaims = user.customClaims || {};
  const existingRole = typeof existingClaims.role === 'string' ? existingClaims.role : null;
  if (existingRole && existingRole !== 'parent') {
    throw new Error(`This email is already assigned to the ${existingRole} role and cannot be provisioned as a parent.`);
  }

  await adminAuth.setCustomUserClaims(user.uid, {
    ...existingClaims,
    role: 'parent',
  });

  const now = new Date().toISOString();
  const parentRef = adminDb.collection('users').doc(user.uid);
  const existingProfileSnap = await parentRef.get();
  const existingProfile = existingProfileSnap.exists ? existingProfileSnap.data() || {} : {};

  const mergedRosterIds = Array.from(new Set([
    ...(Array.isArray(existingProfile.linkedRosterIds) ? existingProfile.linkedRosterIds : []),
    ...rosterIds.filter(Boolean),
  ]));
  const mergedStudentIds = Array.from(new Set([
    ...(Array.isArray(existingProfile.linkedStudentIds) ? existingProfile.linkedStudentIds : []),
    ...studentIds.filter(Boolean),
  ]));

  await parentRef.set({
    name,
    email,
    role: 'parent',
    accountType: 'parent',
    accountProvisioning: {
      method: institutionId ? 'institution' : 'admin',
      status: 'invited',
      firstProvisionedAt: existingProfile.accountProvisioning?.firstProvisionedAt || now,
      lastProvisionedAt: now,
    },
    institutionId: institutionId || existingProfile.institutionId || null,
    institutionName: institutionName || existingProfile.institutionName || '',
    linkedRosterIds: mergedRosterIds,
    linkedStudentIds: mergedStudentIds,
    consentStatus: existingProfile.consentStatus || 'pending',
    profileComplete: true,
    updatedAt: now,
    ...(existingProfileSnap.exists ? {} : { createdAt: now }),
  }, { merge: true });

  // Firebase Admin generates the activation URL; it is returned only to the
  // authorised provisioning workflow and is never persisted.
  const activationLink = await adminAuth.generatePasswordResetLink(email);

  return {
    uid: user.uid,
    name,
    email,
    created,
    activationLink,
  };
}
