import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_PRICING } from '../../../src/config/careerPricing.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
const ALLOWED = new Set(Object.keys(CAREER_PRICING));

function token(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

async function requireAdmin(req) {
  const idToken = token(req);
  if (!idToken) throw Object.assign(new Error('Authentication required.'), { status: 401 });
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  const db = getAdminFirestore();
  const snap = await db.collection('users').doc(decoded.uid).get();
  const user = snap.exists ? snap.data() : {};
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  if (!isFounder && user.role !== 'super_admin') throw Object.assign(new Error('Super Admin access required.'), { status: 403 });
  return db;
}

function cleanPrice(value) {
  const amount = Number(value);
  if (!Number.isInteger(amount) || amount < 0 || amount > 100000000) return null;
  return amount;
}

export default async function handler(req, res) {
  try {
    const db = await requireAdmin(req);
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
      const amountPaise = cleanPrice(item.amountPaise);
      if (amountPaise === null) return res.status(400).json({ error: `Invalid price for ${item.key}.` });
      products[item.key] = { amountPaise, active: item.active !== false, updatedAt: new Date().toISOString() };
    }
    await ref.set({ products, updatedAt: new Date().toISOString() }, { merge: true });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Unable to manage pricing.' });
  }
}
