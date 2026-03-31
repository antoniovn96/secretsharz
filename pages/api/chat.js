// pages/api/chat.js

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── API KEY CHECK ─────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[VidyaVantage] ANTHROPIC_API_KEY is not set in Vercel environment variables.');
    return res.status(500).json({ error: 'Server configuration error: API key missing.' });
  }

  // ── PARSE BODY ────────────────────────────────────────────────────
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: 'Request body must contain a messages array.' });
  }

  // ── CALL ANTHROPIC WITH TIMEOUT ───────────────────────────────────
  // FIX: Added AbortController so the function doesn't hang past Vercel's
  // serverless timeout limit (10s Hobby / 60s Pro).
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second hard limit

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      // FIX: Pinned model string instead of rolling alias 'claude-3-5-haiku-latest'.
      // FIX: Increased max_tokens from 3000 → 4096 to prevent mid-JSON truncation
      // which caused JSON.parse to crash in the frontend.
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
      console.error('[VidyaVantage] Anthropic API error:', response.status, data);
      return res.status(response.status).json({
        error: 'Anthropic API returned an error.',
        details: data?.error?.message || 'Unknown error from Anthropic.',
      });
    }

    console.log('[VidyaVantage] Successfully returned response from Anthropic.');
    return res.status(200).json(data);

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      console.error('[VidyaVantage] Anthropic request timed out after 50s.');
      return res.status(504).json({ error: 'The AI analysis timed out. Please try again.' });
    }

    console.error('[VidyaVantage] Unexpected server error:', err.message);
    return res.status(500).json({ error: 'Internal server error.', message: err.message });
  }
}
