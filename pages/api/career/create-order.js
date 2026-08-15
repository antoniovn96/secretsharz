import { getAdminAuth } from '../../../src/security/firebaseAdmin.js';

const DEFAULT_PRICE_PAISE = 99900;

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return jsonError(res, 503, 'Payment gateway is not configured yet.');
  }

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (_) {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  const configuredAmount = Number(process.env.CAREER_REPORT_PRICE_PAISE || DEFAULT_PRICE_PAISE);
  if (!Number.isInteger(configuredAmount) || configuredAmount < 100) {
    return jsonError(res, 500, 'Invalid career report price configuration.');
  }

  const receipt = `career_${decodedToken.uid.slice(0, 12)}_${Date.now()}`;
  const payload = {
    amount: configuredAmount,
    currency: 'INR',
    receipt,
    notes: {
      uid: decodedToken.uid,
      product: 'career_full_report'
    }
  };

  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data?.id) {
      console.error('[career/create-order] Razorpay error:', data);
      return jsonError(res, 502, 'Unable to create the payment order.');
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
      product: 'career_full_report'
    });
  } catch (err) {
    console.error('[career/create-order] request failed:', err?.message || err);
    return jsonError(res, 502, 'Payment gateway request failed.');
  }
}
