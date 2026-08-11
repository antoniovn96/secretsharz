// Secret Sharz — client-side helper for the server-managed role endpoint.
//
// This module is the ADMIN UI's ONLY role-management write path. It calls the
// existing server endpoint (pages/api/admin/assign-role.js) with the caller's
// Firebase ID token as a Bearer credential. It NEVER writes to Firestore
// `users/{uid}.role` directly and NEVER touches Firebase Admin credentials.
//
// SECURITY MODEL
// --------------
// - The browser cannot grant a privileged role by writing `users.role`; only
//   the server endpoint may assign/remove custom claims (Firebase Admin SDK).
// - This helper is a thin fetch wrapper. Authorization is performed by the
//   server (verifyIdToken + decideAssignment). Client-side validation here is a
//   UI guard, NOT a security boundary.
// - Errors are mapped to short, safe, actionable messages. No stack traces,
//   tokens, credentials, or internal security details are surfaced to the UI.
//
// RESULT SHAPE
// ------------
// { ok: true, role, action, targetUid, tokenRefreshRequired }
//   on a 2xx response from the server.
// { ok: false, status, message }
//   on any non-2xx response or network failure. `message` is safe for UI display.

const ENDPOINT = '/api/admin/assign-role';

// UI-side validation (NOT the security boundary). Catches obvious mistakes
// before the round-trip; the server re-validates authoritatively.
function validateClientParams({ targetUid, action, role }) {
  if (typeof targetUid !== 'string' || targetUid.length < 1 || targetUid.length > 128) {
    return { ok: false, status: 0, message: 'A valid target user is required.' };
  }
  if (action !== 'set' && action !== 'remove') {
    return { ok: false, status: 0, message: 'Action must be "set" or "remove".' };
  }
  if (typeof role !== 'string' || role.length < 1) {
    return { ok: false, status: 0, message: 'A role is required.' };
  }
  return null;
}

// Map a non-2xx HTTP status to a short, safe, actionable UI message. Avoids
// echoing server internals. The caller may still inspect `status` for routing.
function safeMessage(status) {
  switch (status) {
    case 401:
      return 'You must be signed in to manage roles.';
    case 403:
      return 'You are not authorised to manage roles.';
    case 404:
      return 'The target user does not exist.';
    case 400:
      return 'The request was invalid. Check the role and action.';
    case 405:
      return 'This action is not supported.';
    default:
      return 'Role change failed. Please try again.';
  }
}

// Call the server-managed role endpoint. Returns the normalized result shape.
//
// `idToken`  — the current Firebase user's ID token (string). Sent as Bearer.
// `targetUid` — the Auth UID of the user whose role is being changed.
// `action`    — 'set' | 'remove'.
// `role`      — the role to set/remove (must be on the server allowlist).
export async function assignRoleViaServer({ idToken, targetUid, action, role }) {
  const clientError = validateClientParams({ targetUid, action, role });
  if (clientError) return clientError;

  if (typeof idToken !== 'string' || idToken.length < 1) {
    return { ok: false, status: 401, message: 'Authentication required.' };
  }

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ targetUid, action, role })
    });
  } catch (err) {
    // Network failure / aborted request. Recoverable: the UI can retry.
    return { ok: false, status: 0, message: 'Network error. Please try again.' };
  }

  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    body = null;
  }

  if (res.ok) {
    return {
      ok: true,
      role: body?.role ?? role,
      action: body?.action ?? action,
      targetUid: body?.targetUid ?? targetUid,
      tokenRefreshRequired: body?.tokenRefreshRequired === true
    };
  }

  return {
    ok: false,
    status: res.status,
    message: safeMessage(res.status)
  };
}
