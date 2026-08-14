// pages/api/chat.js
// Authenticated server-side AI gateway. The Anthropic key never reaches clients.

import { getAdminAuth } from '../../src/security/firebaseAdmin.js';

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function allowedOrigin(req) {
  const configured = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  const origin = req.headers.origin;
  if (!origin) return null;
  if (!configured) return null;
  return origin === configured ? origin : null;
}

export default async function handler(req, res) {
  const origin = allowedOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return jsonError(res, 405, 'Method not allowed.');

  // Every AI request must be authenticated. This closes the previous public
  // proxy that could be called without a Firebase identity.
  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  // Keep the verified identity available for future usage/audit/rate-limit
  // layers. Never trust a userId supplied in the request body.
  const requesterUid = decodedToken.uid;
  if (!requesterUid) return jsonError(res, 401, 'Authenticated identity is unavailable.');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[VidyaVantage] ANTHROPIC_API_KEY is not set.');
    return jsonError(res, 500, 'Server configuration error.');
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return jsonError(res, 400, 'Invalid JSON in request body.');
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    return jsonError(res, 400, 'Request body must contain a messages array.');
  }

  // Bound request size before spending tokens with the upstream provider.
  if (body.messages.length > 50) {
    return jsonError(res, 400, 'Too many messages in one request.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: body.messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      console.error('[VidyaVantage] Anthropic API error:', response.status, {
        requesterUid,
        status: response.status,
      });
      return res.status(response.status).json({
        error: 'AI provider returned an error.',
        details: data?.error?.message || 'Unknown error from AI provider.',
      });
    }

    console.log('[VidyaVantage] AI response completed for authenticated requester.');
    return res.status(200).json(data);
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return jsonError(res, 504, 'The AI analysis timed out. Please try again.');
    }

    console.error('[VidyaVantage] Unexpected AI gateway error:', {
      requesterUid,
      message: err.message,
    });
    return jsonError(res, 500, 'Internal server error.');
  }
}
