// pages/api/admin/assign-role.js
//
// Server-side privileged role provisioning. This is the ONLY place where
// Firebase Authentication custom claims are assigned or removed. Clients can
// NEVER call setCustomUserClaims directly.
//
// The requester authentication/authorization boundary is centralized in
// adminAuthorization.js. Role-assignment validation and claim mutation remain
// in roleAssignment.js as pure, testable domain logic.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import {
  validateAssignRequest,
  buildNewClaims,
  buildSafeResponse,
  buildAuditRecord,
  roleFromClaims
} from '../../../src/security/roleAssignment.js';

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;
  const decodedToken = authorization.decodedToken;

  const parsed = validateAssignRequest(req.body);
  if (!parsed.ok) return jsonError(res, parsed.status, parsed.error);
  const { targetUid, action, role } = parsed.value;

  let targetRecord;
  try {
    targetRecord = await getAdminAuth().getUser(targetUid);
  } catch (err) {
    return jsonError(res, 404, 'Target user does not exist.');
  }

  const previousClaims = targetRecord.customClaims || {};
  const previousRole = roleFromClaims(previousClaims);

  let newClaims;
  try {
    newClaims = buildNewClaims(previousClaims, action, role);
  } catch (err) {
    return jsonError(res, 400, 'Invalid role parameters.');
  }
  const newRole = roleFromClaims(newClaims);

  await getAdminAuth().setCustomUserClaims(targetUid, newClaims);
  await getAdminAuth().revokeRefreshTokens(targetUid);

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
    console.error('[assign-role] audit write failed:', err?.message || err);
  }

  return res.status(200).json(
    buildSafeResponse({
      targetUid,
      action,
      role,
      tokenRefreshRequired: true
    })
  );
}
