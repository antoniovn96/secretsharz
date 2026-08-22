import { getAdminAuth } from './firebaseAdmin.js';

function bearerToken(req) {
  const header = req?.headers?.authorization || req?.headers?.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function requireProfessional(req, allowedRoles = []) {
  const idToken = bearerToken(req);
  if (!idToken) return { ok: false, status: 401, error: 'Authentication required.' };

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[professional authorization] Firebase ID token verification failed:', {
      code: error?.code || null,
      message: error?.message || 'Unknown Firebase Auth verification error',
    });
    return { ok: false, status: 401, error: 'Invalid or expired authentication token.' };
  }

  const role = String(decodedToken?.role || '').toLowerCase();
  const allowed = allowedRoles.map((value) => String(value).toLowerCase());
  if (!allowed.includes(role) && role !== 'super_admin') {
    return { ok: false, status: 403, error: 'Professional access required.' };
  }

  return { ok: true, decodedToken, authorizationSource: 'claim' };
}

export function sendProfessionalAuthorizationFailure(res, authorization) {
  if (authorization?.ok) return false;
  return res.status(authorization?.status || 403).json({ error: authorization?.error || 'Access denied.' });
}
