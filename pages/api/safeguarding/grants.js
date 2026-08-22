// pages/api/safeguarding/grants.js
//
// Server-only issuance endpoint for trusted safeguarding grants.
// The client cannot manufacture a grant, choose an issuer, extend expiry, or
// bypass the safeguarding role check.
import crypto from 'crypto';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { SAFEGUARDING_ROLE, SAFEGUARDING_PURPOSE, normalizeSafeguardingGrantInput, SAFEGUARDING_SCOPES } from '../../../src/security/safeguardingGrant.js';

function jsonError(res, status, message) { return res.status(status).json({ error: message }); }

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, status: 400, error: 'Invalid request body.' };
  const allowed = ['targetUid', 'reason', 'scope', 'durationMinutes'];
  if (Object.keys(body).some((key) => !allowed.includes(key))) return { ok: false, status: 400, error: 'Unexpected fields in request body.' };
  if (typeof body.targetUid !== 'string' || body.targetUid.length < 1 || body.targetUid.length > 128) return { ok: false, status: 400, error: 'A valid targetUid is required.' };
  if (typeof body.reason !== 'string' || body.reason.trim().length < 10 || body.reason.trim().length > 2000) return { ok: false, status: 400, error: 'A safeguarding reason of 10–2000 characters is required.' };
  if (!Array.isArray(body.scope) || body.scope.length === 0 || body.scope.some((item) => !SAFEGUARDING_SCOPES.includes(item))) return { ok: false, status: 400, error: 'A valid safeguarding scope is required.' };
  const durationMinutes = body.durationMinutes === undefined ? 15 : body.durationMinutes;
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 60) return { ok: false, status: 400, error: 'durationMinutes must be between 1 and 60.' };
  return { ok: true, value: { targetUid: body.targetUid, reason: body.reason, scope: [...new Set(body.scope)], durationMinutes } };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return jsonError(res, 405, 'Method not allowed.'); }
  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  let decodedToken;
  try { decodedToken = await getAdminAuth().verifyIdToken(idToken); }
  catch (_) { return jsonError(res, 401, 'Invalid or expired authentication token.'); }

  if (decodedToken?.role !== SAFEGUARDING_ROLE) return jsonError(res, 403, 'A safeguarding officer role is required.');

  const parsed = validateBody(req.body);
  if (!parsed.ok) return jsonError(res, parsed.status, parsed.error);
  const { targetUid, reason, scope, durationMinutes } = parsed.value;
  if (decodedToken.uid === targetUid) return jsonError(res, 403, 'Safeguarding grants cannot be issued to the issuing officer.');

  try { await getAdminAuth().getUser(targetUid); }
  catch (_) { return jsonError(res, 404, 'Target user does not exist.'); }

  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + durationMinutes * 60 * 1000);
  const grantId = `sg_${crypto.randomUUID()}`;
  const grant = normalizeSafeguardingGrantInput({
    grantId,
    subjectPersonId: targetUid,
    issuedByPersonId: decodedToken.uid,
    reason,
    scope,
    issuedAt,
    expiresAt,
  });

  const record = {
    ...grant,
    purpose: SAFEGUARDING_PURPOSE,
    issuedByRole: SAFEGUARDING_ROLE,
    createdAt: issuedAt.toISOString(),
  };

  await getAdminFirestore().collection('safeguardingGrants').doc(grantId).set(record);
  await getAdminFirestore().collection('auditEvents').add({
    kind: 'safeguarding_grant_issued',
    grantId,
    actorUid: decodedToken.uid,
    targetUid,
    scope,
    reason,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    timestamp: issuedAt.toISOString(),
  });

  return res.status(201).json({
    ok: true,
    grantId,
    targetUid,
    scope,
    issuedAt: grant.issuedAt,
    expiresAt: grant.expiresAt,
    purpose: SAFEGUARDING_PURPOSE,
  });
}
