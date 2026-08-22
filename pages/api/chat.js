// pages/api/chat.js
//
// Server-side AI gateway. This endpoint is intentionally authenticated:
// Anthropic usage is a paid backend resource and may receive user-provided
// content. Client-side visibility is never treated as authorization.
import { getAdminAuth } from '../../src/security/firebaseAdmin.js';

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 12000;
const MAX_TOTAL_CHARS = 60000;

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return { ok: false, error: `messages must contain 1-${MAX_MESSAGES} items.` };
  }

  let totalChars = 0;
  for (const message of messages) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return { ok: false, error: 'Each message must be an object.' };
    }
    const keys = Object.keys(message);
    if (keys.some((key) => !['role', 'content'].includes(key))) {
      return { ok: false, error: 'Messages contain unsupported fields.' };
    }
    if (!['user', 'assistant'].includes(message.role)) {
      return { ok: false, error: 'Message role must be user or assistant.' };
    }
    if (typeof message.content !== 'string' || message.content.trim().length === 0) {
      return { ok: false, error: 'Message content must be a non-empty string.' };
    }
    if (message.content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: `Each message is limited to ${MAX_MESSAGE_CHARS} characters.` };
    }
    totalChars += message.content.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return { ok: false, error: `The conversation is limited to ${MAX_TOTAL_CHARS} characters.` };
    }
  }

  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate every caller before consuming the Anthropic resource.
  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  try {
    await getAdminAuth().verifyIdToken(idToken);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[AI] ANTHROPIC_API_KEY is not configured.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (_) {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }

  const validation = validateMessages(body?.messages);
  if (!validation.ok) return res.status(400).json({ error: validation.error });

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

    const data = await response.json();

    if (!response.ok) {
      console.error('[AI] Anthropic API error:', response.status);
      return res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({
        error: 'AI service returned an error.',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    if (err?.name === 'AbortError') {
      return res.status(504).json({ error: 'The AI analysis timed out. Please try again.' });
    }

    console.error('[AI] Unexpected server error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '128kb',
    },
  },
};
