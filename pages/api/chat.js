export default async function handler(req, res) {
  // 1. Handle CORS (So your frontend can talk to the backend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Check for API Key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'No API key found in environment variables' });
    return;
  }

  // 3. Make the request to Claude
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    
    // 4. Send the response back to your website
    res.status(response.status).json(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
