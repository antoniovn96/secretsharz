export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log("STEP 1: Vercel hit the /api/chat route successfully!");

  // 2. Check API Key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("STEP 2 ERROR: API key is missing from Vercel Environment Variables");
    return res.status(500).json({ error: 'No API key found' });
  }

  console.log("STEP 2: API Key found, formatting request to Anthropic...");

  // 3. Make request to Claude
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 3000,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    console.log("STEP 3: Anthropic returned status code:", response.status);

    // If Anthropic throws an error (like a 404), catch it here!
    if (!response.ok) {
      console.error("STEP 4 ERROR: Anthropic rejected the request. Details:", data);
      // We force a 500 error here so the frontend doesn't confuse it with a missing file
      return res.status(500).json({ error: "Anthropic API Error", details: data });
    }

    console.log("STEP 4 SUCCESS: Sending Claude's response to frontend.");
    return res.status(200).json(data);

  } catch (err) {
    console.error("CATCH BLOCK ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
