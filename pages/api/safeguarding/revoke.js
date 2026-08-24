// pages/api/safeguarding/revoke.js
// Server-only revocation for trusted safeguarding grants.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { SAFEGUARDING_ROLE } from '../../../src/security/safeguardingGrant.js';

function jsonError(res, status, message) { return res.status(status).json({ error: message }); }
function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return jsonError(res, 405, 'Method not allowed.'); }
  const token = bearerToken(req);
  if (!token) return jsonError(res, 401, 'Authentication required.');
  let actor;
  try { actor = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return jsonError(res, 401, 'Invalid or expired authentication token.'); }
  if (actor?.role !== SAFEGUARDING_ROLE) return jsonError(res, 403, 'A safeguarding officer role is required.');

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some((key) => key !== 'grantId') || typeof body.grantId !== 'string' || body.grantId.length < 1 || body.grantId.length > 128) {
    return jsonError(res, 400, 'A valid grantId is required.');
  }

  const ref = getAdminFirestore().collection('safeguardingGrants').doc(body.grantId);
  const snapshot = await ref.get();
  if (!snapshot.exists) return jsonError(res, 404, 'Safeguarding grant does not exist.');
  const grant = snapshot.data();
  if (grant.status !== 'active') return jsonError(res, 409, 'Safeguarding grant is not active.');

  const now = new Date().toISOString();
  await ref.update({ status: 'revoked', revokedAt: now, revokedByPersonId: actor.uid });
  await getAdminFirestore().collection('auditEvents').add({
    kind: 'safeguarding_grant_revoked',
    grantId: body.grantId,
    actorUid: actor.uid,
    targetUid: grant.subjectPersonId || null,
    timestamp: now,
  });

  return res.status(200).json({ ok: true, grantId: body.grantId, status: 'revoked' });
}
