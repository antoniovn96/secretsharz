import { getAdminAuth } from './firebaseAdmin.js';
import { FOUNDER_EMAIL, ADMIN_CLAIM_ROLES } from './claimRoles.js';

function bearerToken(req) {
  const header = req?.headers?.authorization || req?.headers?.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function requireSuperAdmin(req) {
  const idToken = bearerToken(req);
  if (!idToken) return { ok: false, status: 401, error: 'Authentication required.' };

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[admin authorization] Firebase ID token verification failed:', {
      code: error?.code || null,
      message: error?.message || 'Unknown Firebase Auth verification error',
    });
    return { ok: false, status: 401, error: 'Invalid or expired authentication token.' };
  }

  const claimRole = decodedToken?.role;
  const hasAdminClaim = ADMIN_CLAIM_ROLES.includes(claimRole);
  // Temporary migration bridge: retain the verified founder fallback until
  // the production account is confirmed to carry the super_admin claim.
  // This keeps the migration fail-safe rather than risking an admin lockout.
  const isVerifiedFounder = decodedToken?.email_verified === true && decodedToken?.email === FOUNDER_EMAIL;

  if (!hasAdminClaim && !isVerifiedFounder) {
    return { ok: false, status: 403, error: 'Super Admin access required.' };
  }

  return { ok: true, decodedToken, authorizationSource: hasAdminClaim ? 'claim' : 'founder-migration' };
}

export function sendAuthorizationFailure(res, authorization) {
  if (authorization?.ok) return false;
  return res.status(authorization?.status || 403).json({ error: authorization?.error || 'Access denied.' });
}
