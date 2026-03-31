export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure we only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("STEP 1: Vercel hit the /api/chat route successfully!");

  // 2. Check API Key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("STEP 2 ERROR: API key is missing from Vercel Environment Variables");
    return res.status(500).json({ error: 'No API key found in server environment' });
  }

  // 3. Robust Body Parsing
  // Vercel sometimes passes the body as a string; we ensure it's an object.
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  console.log("STEP 2: API Key found, formatting request to Anthropic...");

  // 4. Make request to Claude
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // Updated to the most stable production model ID for 2026
        model: 'claude-3-5-haiku-latest', 
        max_tokens: 3000,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    console.log("STEP 3: Anthropic returned status code:", response.status);

    if (!response.ok) {
      console.error("STEP 4 ERROR: Anthropic rejected the request. Details:", data);
      return res.status(response.status).json({ 
        error: "Anthropic API Error", 
        details: data.error?.message || data 
      });
    }

    console.log("STEP 4 SUCCESS: Sending Claude's response to frontend.");
    return res.status(200).json(data);

  } catch (err) {
    console.error("CATCH BLOCK ERROR:", err.message);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}
