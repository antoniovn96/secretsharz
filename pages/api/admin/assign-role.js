// pages/api/admin/assign-role.js
//
// Server-side privileged role provisioning. This is the ONLY place where
// Firebase Authentication custom claims are assigned or removed. Clients can
// NEVER call setCustomUserClaims directly.
//
// SECURITY
// --------
// - The requesting administrator is authenticated by verifying their Firebase
//   ID token (Authorization: Bearer <idToken>) via the Admin SDK.
// - The requester is authorized ONLY from the verified token (founder email or
//   an admin custom claim). Request body fields, client-side roles, and
//   users/{uid}.role are NEVER trusted for authorization.
// - Only { targetUid, action, role } are accepted; all other fields are rejected
//   (anti mass-assignment / arbitrary-claim injection).
// - Existing unrelated custom claims are preserved.
// - Every change is written to the protected auditEvents collection via the
//   Admin SDK (which bypasses firestore.rules; ordinary clients cannot write
//   there because the rules deny auditEvents access).
//
// TOKEN REFRESH
// -------------
// Assigning a custom claim does NOT retroactively edit an already-issued ID
// token. The target user's current ID token will not contain the new claim
// until they refresh/re-authenticate. By default this endpoint revokes the
// target's refresh tokens so the new claim is enforced on their next sign-in.
// The response explicitly states tokenRefreshRequired so the UI never assumes
// the claim is immediately live.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import {
  validateAssignRequest,
  decideAssignment,
  buildNewClaims,
  buildSafeResponse,
  buildAuditRecord,
  roleFromClaims
} from '../../../src/security/roleAssignment.js';

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  // 1. Authenticate the requester via a verified ID token. Unauthenticated
  //    callers never reach the authorization logic.
  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (err) {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  // 2. Parse + strictly validate the body (rejects unexpected fields).
  const parsed = validateAssignRequest(req.body);
  if (!parsed.ok) return jsonError(res, parsed.status, parsed.error);
  const { targetUid, action, role } = parsed.value;

  // 3. Authorize the requester from the verified token only.
  //    decideAssignment() consults ONLY the decoded token (never the body) and
  //    rejects non-admin requesters with 403.
  const decision = decideAssignment({ requester: decodedToken, targetUid, action, role });
  if (!decision.allowed) return jsonError(res, decision.status, decision.reason);

  // 4. Verify the target user exists and capture prior claim state (for audit
  //    + claim preservation). A non-existent target is a 404.
  let targetRecord;
  try {
    targetRecord = await getAdminAuth().getUser(targetUid);
  } catch (err) {
    return jsonError(res, 404, 'Target user does not exist.');
  }

  const previousClaims = targetRecord.customClaims || {};
  const previousRole = roleFromClaims(previousClaims);

  // 5. Build the new claims, preserving all unrelated existing claims.
  let newClaims;
  try {
    newClaims = buildNewClaims(previousClaims, action, role);
  } catch (err) {
    return jsonError(res, 400, 'Invalid role parameters.');
  }
  const newRole = roleFromClaims(newClaims);

  // 6. Apply the claim server-side.
  await getAdminAuth().setCustomUserClaims(targetUid, newClaims);

  // 7. Enforce token refresh: revoke the target's refresh tokens so the new
  //    claim takes effect on next sign-in (existing ID tokens remain valid only
  //    until their natural expiry). The response never claims immediate effect.
  await getAdminAuth().revokeRefreshTokens(targetUid);

  // 8. Audit the privileged change to the protected auditEvents collection via
  //    the Admin SDK (bypasses firestore.rules). Ordinary clients cannot write
  //    auditEvents (rules deny). Do not store secrets in the audit record.
  try {
    const record = buildAuditRecord({
      actorUid: decodedToken.uid || null,
      actorEmail: decodedToken.email || null,
      targetUid,
      action,
      role,
      previousRole,
      newRole
    });
    await getAdminFirestore().collection('auditEvents').add(record);
  } catch (err) {
    // Audit failure must not roll back the security change, but it is surfaced
    // in logs so operators can investigate. The role change already succeeded;
    // this is a monitoring signal, not a silent failure.
    console.error('[assign-role] audit write failed:', err?.message || err);
  }

  // 9. Return a safe response (no secrets, no full claim set).
  return res.status(200).json(
    buildSafeResponse({
      targetUid,
      action,
      role,
      tokenRefreshRequired: true
    })
  );
}
