import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminFirestore } from '../../src/security/firebaseAdmin';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
const MAX_MESSAGE_LENGTH = 1500;
const recentByClient = new Map();

function clean(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength)
    : '';
}

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function requestClientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim().slice(0, 80);
  return String(req.socket?.remoteAddress || 'unknown').slice(0, 80);
}

function rateLimited(req) {
  // Best-effort in-process guard; production should also use platform-level
  // rate limiting or bot protection because serverless instances do not share memory.
  const now = Date.now();
  const key = requestClientKey(req);
  const previous = recentByClient.get(key) || [];
  const active = previous.filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  if (active.length >= 5) return true;
  active.push(now);
  recentByClient.set(key, active);
  if (recentByClient.size > 1000) {
    for (const [client, timestamps] of recentByClient) {
      if (!timestamps.length || now - timestamps[timestamps.length - 1] > 10 * 60 * 1000) recentByClient.delete(client);
    }
  }
  return false;
}

async function requireAdmin(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw Object.assign(new Error('Authentication required.'), { status: 401 });
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(header.slice(7));
  } catch (_) {
    throw Object.assign(new Error('Invalid or expired authentication token.'), { status: 401 });
  }
  const isFounder = decoded.email_verified === true && decoded.email === FOUNDER_EMAIL;
  if (!isFounder && decoded.role !== 'super_admin') throw Object.assign(new Error('Super Admin access required.'), { status: 403 });
  return decoded;
}

function feedbackPayload(doc) {
  const data = doc.data();
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null;
  return {
    id: doc.id,
    type: data.type || 'general',
    message: data.message || '',
    displayName: data.displayName || '',
    email: data.email || '',
    allowPublication: data.allowPublication === true,
    status: data.status || 'pending',
    createdAt,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'POST') {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    // Quietly discard a honeypot submission without teaching bots our checks.
    if (clean(body.website, 200)) return res.status(200).json({ accepted: true });

    if (rateLimited(req)) return jsonError(res, 429, 'Too many submissions. Please try again later.');
    const allowedTypes = new Set(['general', 'suggestion', 'accessibility', 'experience']);
    const type = clean(body.type, 30) || 'general';
    const message = clean(body.message, MAX_MESSAGE_LENGTH);
    const displayName = clean(body.displayName, 80);
    const email = clean(body.email, 254);
    const allowPublication = body.allowPublication === true;

    if (!allowedTypes.has(type)) return jsonError(res, 400, 'Choose a valid feedback type.');
    if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) return jsonError(res, 400, 'Message must be between 10 and 1,500 characters.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError(res, 400, 'Enter a valid email address or leave the field blank.');
    if (req.headers.origin && req.headers.host) {
      try {
        const origin = new URL(req.headers.origin);
        if (origin.host !== req.headers.host) return jsonError(res, 403, 'Submission origin is not allowed.');
      } catch (_) {
        return jsonError(res, 403, 'Submission origin is not allowed.');
      }
    }

    try {
      await getAdminFirestore().collection('websiteFeedbackInbox').add({
        type,
        message,
        displayName,
        email,
        allowPublication,
        status: 'pending',
        source: 'public_website',
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.status(201).json({ accepted: true });
    } catch (error) {
      console.error('[website-feedback] submission failed:', error?.message || 'unknown error');
      return jsonError(res, 503, 'Feedback is temporarily unavailable. Please try again later.');
    }
  }

  if (req.method === 'GET') {
    if (req.query.view === 'published') {
      try {
        const snapshot = await getAdminFirestore().collection('websiteFeedbackInbox').where('status', '==', 'published').orderBy('createdAt', 'desc').limit(6).get();
        const items = snapshot.docs
          .filter((doc) => doc.data().allowPublication === true)
          .map((doc) => ({
            id: doc.id,
            message: doc.data().message || '',
            displayName: doc.data().displayName || 'Anonymous',
          }));
        return res.status(200).json({ items });
      } catch (error) {
        console.error('[website-feedback] published feedback lookup failed:', error?.message || 'unknown error');
        return jsonError(res, 503, 'Published feedback is temporarily unavailable.');
      }
    }
    try {
      await requireAdmin(req);
      const status = String(req.query.status || 'pending');
      if (!['pending', 'published', 'rejected', 'all'].includes(status)) return jsonError(res, 400, 'Invalid feedback status.');
      const snapshot = await getAdminFirestore().collection('websiteFeedbackInbox').orderBy('createdAt', 'desc').limit(100).get();
      const items = snapshot.docs.map(feedbackPayload).filter((item) => status === 'all' || item.status === status);
      return res.status(200).json({ items });
    } catch (error) {
      return jsonError(res, error.status || 500, error.status ? error.message : 'Unable to load feedback.');
    }
  }

  if (req.method === 'PATCH') {
    try {
      const moderator = await requireAdmin(req);
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      const id = clean(body.id, 128);
      const action = clean(body.action, 20);
      if (!id || !['publish', 'reject'].includes(action)) return jsonError(res, 400, 'A feedback ID and valid moderation action are required.');
      const db = getAdminFirestore();
      const ref = db.collection('websiteFeedbackInbox').doc(id);
      const snapshot = await ref.get();
      if (!snapshot.exists) return jsonError(res, 404, 'Feedback submission was not found.');
      const data = snapshot.data();
      if (action === 'publish' && data.allowPublication !== true) {
        return jsonError(res, 409, 'This person did not give permission for public display.');
      }
      const isFounder = moderator.email_verified === true && moderator.email === FOUNDER_EMAIL;
      await ref.update({
        status: action === 'publish' ? 'published' : 'rejected',
        moderatedAt: FieldValue.serverTimestamp(),
        moderatedBy: moderator.uid,
        moderatorType: isFounder ? 'founder' : 'super_admin',
      });
      return res.status(200).json({ updated: true, status: action === 'publish' ? 'published' : 'rejected' });
    } catch (error) {
      return jsonError(res, error.status || 500, error.status ? error.message : 'Unable to update feedback status.');
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  return jsonError(res, 405, 'Method not allowed.');
}
