import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_PRICING } from '../../../src/config/careerPricing.js';
import { getCareerProductConfig } from '../../../src/server/careerPricing.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const db = getAdminFirestore();
    const products = [];
    for (const key of Object.keys(CAREER_PRICING)) {
      const product = await getCareerProductConfig(db, key);
      if (product?.active !== false) {
        products.push({
          key,
          sku: product.sku,
          label: product.label,
          amountPaise: Number(product.amountPaise || 0),
          reportTier: product.reportTier,
          seats: product.seats || 1,
        });
      }
    }
    return res.status(200).json({ products, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[career/catalog] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load career products.' });
  }
}
