import crypto from 'crypto';

export async function provisionStudentAccount({ adminAuth, adminDb, studentName, studentEmail, profile = {}, institutionId = null, institutionName = '', provisionedByRole = 'admin', studentIds = [] }) {
  const name = String(studentName || '').trim().slice(0, 180);
  const email = String(studentEmail || '').trim().toLowerCase().slice(0, 254);
  if (!name) throw new Error('Student name is required.');
  if (!email || !email.includes('@')) throw new Error('A valid student email is required.');

  let user;
  let created = false;
  try {
    user = await adminAuth.getUserByEmail(email);
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') throw error;
    const temporaryPassword = crypto.randomBytes(24).toString('base64url');
    user = await adminAuth.createUser({ email, password: temporaryPassword, displayName: name, emailVerified: false, disabled: false });
    created = true;
  }

  const existingClaims = user.customClaims || {};
  const existingRole = typeof existingClaims.role === 'string' ? existingClaims.role : null;
  if (existingRole && existingRole !== 'student') {
    throw new Error(`This email is already assigned to the ${existingRole} role and cannot be provisioned as a student.`);
  }

  const now = new Date().toISOString();
  const studentRef = adminDb.collection('users').doc(user.uid);
  const existingSnap = await studentRef.get();
  const existing = existingSnap.exists ? existingSnap.data() || {} : {};
  if (institutionId && existing.institutionId && existing.institutionId !== institutionId) {
    throw new Error('This student account is already linked to another institution.');
  }

  // Students intentionally do not receive a privileged custom claim.
  if (existingClaims.role === 'student') {
    const nextClaims = { ...existingClaims };
    delete nextClaims.role;
    await adminAuth.setCustomUserClaims(user.uid, nextClaims);
  }

  await studentRef.set({
    name,
    email,
    role: 'student',
    accountType: 'student',
    ...profile,
    institutionId: institutionId || existing.institutionId || null,
    institutionName: institutionName || existing.institutionName || '',
    accountProvisioning: {
      method: provisionedByRole,
      status: 'invited',
      firstProvisionedAt: existing.accountProvisioning?.firstProvisionedAt || now,
      lastProvisionedAt: now
    },
    profileComplete: existing.profileComplete || false,
    updatedAt: now,
    ...(existingSnap.exists ? {} : { createdAt: now })
  }, { merge: true });

  const activationLink = await adminAuth.generatePasswordResetLink(email);
  return { uid: user.uid, name, email, created, activationLink };
}
