// Secret Sharz — Admin Student Journey Decision API
//
// Server-side only. Primary-journey changes are privileged administrative
// decisions. The current routing state is updated atomically with an
// append-only decision event under users/{studentUid}/decisionHistory/{eventId}.
// Client code cannot write these events directly.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const ALLOWED_PATHS = new Set(['wellbeing', 'sen', 'career']);
const MAX_REASON_LENGTH = 500;

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isPrivilegedAdmin(decodedToken) {
  return decodedToken?.email_verified === true && decodedToken?.email === 'antonio.antonio.noronha@gmail.com'
    || decodedToken?.role === 'super_admin';
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, status: 400, error: 'A JSON request body is required.' };
  }

  const keys = Object.keys(body).sort();
  const allowedKeys = ['expectedPreviousPath', 'nextPath', 'reason', 'targetUid'];
  if (keys.some(key => !allowedKeys.includes(key))) {
    return { ok: false, status: 400, error: 'Unexpected request fields.' };
  }

  const { targetUid, nextPath, expectedPreviousPath, reason } = body;
  if (typeof targetUid !== 'string' || !targetUid.trim() || targetUid.length > 128) {
    return { ok: false, status: 400, error: 'A valid targetUid is required.' };
  }
  if (typeof nextPath !== 'string' || !ALLOWED_PATHS.has(nextPath)) {
    return { ok: false, status: 400, error: 'Invalid primary journey.' };
  }
  if (expectedPreviousPath != null && (typeof expectedPreviousPath !== 'string' || !ALLOWED_PATHS.has(expectedPreviousPath))) {
    return { ok: false, status: 400, error: 'Invalid expectedPreviousPath.' };
  }
  if (typeof reason !== 'string' || reason.trim().length < 3 || reason.trim().length > MAX_REASON_LENGTH) {
    return { ok: false, status: 400, error: `Reason must be between 3 and ${MAX_REASON_LENGTH} characters.` };
  }

  return {
    ok: true,
    value: {
      targetUid: targetUid.trim(),
      nextPath,
      expectedPreviousPath: expectedPreviousPath || null,
      reason: reason.trim(),
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  if (!isPrivilegedAdmin(decodedToken)) {
    return jsonError(res, 403, 'Super Admin access required.');
  }

  const parsed = validateBody(req.body);
  if (!parsed.ok) return jsonError(res, parsed.status, parsed.error);

  const { targetUid, nextPath, expectedPreviousPath, reason } = parsed.value;
  const db = getAdminFirestore();
  const studentRef = db.collection('users').doc(targetUid);
  const eventRef = studentRef.collection('decisionHistory').doc();

  try {
    const result = await db.runTransaction(async transaction => {
      const studentSnapshot = await transaction.get(studentRef);
      if (!studentSnapshot.exists) {
        const error = new Error('Student record not found.');
        error.status = 404;
        throw error;
      }

      const student = studentSnapshot.data() || {};
      const previousPath = student.primary_path || student.primaryPath || student.path || null;

      if (expectedPreviousPath && previousPath !== expectedPreviousPath) {
        const error = new Error('The student journey changed before this decision was saved. Refresh the record and try again.');
        error.status = 409;
        throw error;
      }

      if (previousPath === nextPath) {
        const error = new Error('The student is already on this primary journey.');
        error.status = 409;
        throw error;
      }

      const now = FieldValue.serverTimestamp();
      const event = {
        eventType: 'PRIMARY_JOURNEY_CHANGED',
        studentUid: targetUid,
        previousPath,
        nextPath,
        reason,
        actorUid: decodedToken.uid || null,
        actorEmail: decodedToken.email || null,
        source: 'ADMIN_STUDENT_360',
        createdAt: now,
      };

      transaction.update(studentRef, {
        primary_path: nextPath,
        primaryJourneyDecisionAt: now,
        updatedAt: now,
      });
      transaction.create(eventRef, event);

      return { previousPath, nextPath, eventId: eventRef.id };
    });

    return res.status(200).json({
      success: true,
      studentUid: targetUid,
      previousPath: result.previousPath,
      nextPath: result.nextPath,
      eventId: result.eventId,
    });
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    if (status === 500) console.error('[admin student journey] failed:', error);
    return jsonError(res, status, error?.message || 'Unable to change the student journey.');
  }
}
