import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { CAREER_PRICING } from '../../../src/config/careerPricing.js';

const ALLOWED = new Set(Object.keys(CAREER_PRICING));

export default async function handler(req, res) {
  try {
    const authorization = await requireSuperAdmin(req);
    if (sendAuthorizationFailure(res, authorization)) return;

    const db = (await import('../../../src/security/firebaseAdmin.js')).getAdminFirestore();
    const ref = db.collection('platformConfig').doc('careerPricing');
    const snap = await ref.get();
    const overrides = snap.exists ? (snap.data()?.products || {}) : {};

    if (req.method === 'GET') {
      const products = Object.entries(CAREER_PRICING).map(([key, product]) => ({
        key,
        ...product,
        amountPaise: Number.isInteger(overrides[key]?.amountPaise) ? overrides[key].amountPaise : product.amountPaise,
        active: overrides[key]?.active !== false,
        updatedAt: overrides[key]?.updatedAt || null,
      }));
      return res.status(200).json({ products });
    }

    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed.' });
    const updates = Array.isArray(req.body?.products) ? req.body.products : [];
    const products = {};
    for (const item of updates) {
      if (!ALLOWED.has(item.key)) return res.status(400).json({ error: `Unknown product: ${item.key}` });
      const amountPaise = Number(item.amountPaise);
      if (!Number.isInteger(amountPaise) || amountPaise < 0 || amountPaise > 100000000) {
        return res.status(400).json({ error: `Invalid price for ${item.key}.` });
      }
      products[item.key] = { amountPaise, active: item.active !== false, updatedAt: new Date().toISOString() };
    }
    await ref.set({ products, updatedAt: new Date().toISOString() }, { merge: true });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Unable to manage pricing.' });
  }
}
