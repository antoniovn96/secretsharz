// pages/api/admin/create-professional.js
//
// Creates a professional's Firebase Authentication account and directory
// profile in one privileged server-side workflow. The browser never receives
// or chooses a password and never receives Firebase Admin credentials.
import { randomUUID } from 'crypto';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { buildAuditRecord } from '../../../src/security/roleAssignment.js';
import { isAssignableClaimRole } from '../../../src/security/claimRoles.js';

const ALLOWED_BODY_KEYS = Object.freeze([
  'name', 'email', 'phone', 'role', 'specialization', 'qualification',
  'institutionName', 'registrationNumber'
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = Object.freeze({ name: 120, email: 254, phone: 40, text: 250 });

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function cleanText(value, max) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body.' };
  }

  const unexpected = Object.keys(body).filter(key => !ALLOWED_BODY_KEYS.includes(key));
  if (unexpected.length) return { ok: false, error: 'Unexpected fields in request body.' };

  const name = cleanText(body.name, MAX.name);
  const email = cleanText(body.email, MAX.email)?.toLowerCase();
  const role = body.role;

  if (!name) return { ok: false, error: 'Full name is required.' };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: 'A valid email address is required.' };
  if (!isAssignableClaimRole(role) || role === 'super_admin' || role === 'parent') {
    return { ok: false, error: 'A valid professional role is required.' };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone: cleanText(body.phone, MAX.phone),
      role,
      specialization: cleanText(body.specialization, MAX.text),
      qualification: cleanText(body.qualification, MAX.text),
      institutionName: cleanText(body.institutionName, MAX.text),
      registrationNumber: cleanText(body.registrationNumber, MAX.text)
    }
  };
}

function randomPassword() {
  return `SS-${randomUUID()}-Aa9!`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;
  const decodedToken = authorization.decodedToken;

  const parsed = validateBody(req.body);
  if (!parsed.ok) return jsonError(res, 400, parsed.error);
  const professional = parsed.value;

  const adminAuth = getAdminAuth();
  const firestore = getAdminFirestore();
  let authUser = null;

  try {
    authUser = await adminAuth.createUser({
      email: professional.email,
      emailVerified: false,
      password: randomPassword(),
      displayName: professional.name,
      disabled: false
    });

    await adminAuth.setCustomUserClaims(authUser.uid, { role: professional.role });

    await firestore.collection('users').doc(authUser.uid).set({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      role: professional.role,
      professionalRole: professional.role,
      specialization: professional.specialization,
      qualification: professional.qualification,
      institutionName: professional.institutionName,
      registrationNumber: professional.registrationNumber,
      status: 'active',
      profileComplete: false,
      hasLogin: true,
      authProvisionedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const inviteLink = await adminAuth.generatePasswordResetLink(professional.email);

    try {
      await firestore.collection('auditEvents').add(buildAuditRecord({
        actorUid: decodedToken.uid || null,
        actorEmail: decodedToken.email || null,
        targetUid: authUser.uid,
        action: 'create_professional',
        role: professional.role,
        previousRole: null,
        newRole: professional.role
      }));
    } catch (auditError) {
      console.error('[create-professional] audit write failed:', auditError?.message || auditError);
    }

    return res.status(201).json({
      success: true,
      uid: authUser.uid,
      role: professional.role,
      inviteLink,
      inviteLinkExpires: 'Use promptly; Firebase password reset links are time-limited.'
    });
  } catch (error) {
    console.error('[create-professional] provisioning failed:', error?.message || error);

    if (authUser?.uid) {
      try {
        await adminAuth.deleteUser(authUser.uid);
      } catch (cleanupError) {
        console.error('[create-professional] Auth cleanup failed:', cleanupError?.message || cleanupError);
      }
    }

    if (error?.code === 'auth/email-already-exists') {
      return jsonError(res, 409, 'A Firebase Authentication account already exists for this email address.');
    }

    return jsonError(res, 500, 'Unable to create the professional account. No partial account was intentionally retained.');
  }
}
