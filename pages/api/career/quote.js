import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import {
  calculateCouponDiscount,
  customerTypeForProduct,
  getCareerProductConfig,
  normaliseCouponCode,
  validateCoupon,
  serialiseCoupon,
} from '../../../src/server/careerPricing.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const db = getAdminFirestore();
  const productKey = String(req.body?.product || 'student_individual').trim();
  const product = await getCareerProductConfig(db, productKey);
  if (!product) return res.status(400).json({ error: 'Unsupported career product.' });
  if (product.active === false) return res.status(409).json({ error: 'This career product is currently unavailable.' });

  const customerType = customerTypeForProduct(productKey);
  const quantity = Number.isInteger(product.seats) && product.seats > 0 ? product.seats : 1;
  const baseAmount = Math.max(0, Number(product.amountPaise || 0));
  const couponCode = normaliseCouponCode(req.body?.couponCode);
  let coupon = null;
  let discountAmount = 0;

  if (couponCode) {
    const couponSnap = await db.collection('careerCoupons').doc(couponCode).get();
    if (!couponSnap.exists) return res.status(400).json({ error: 'Coupon code was not found.' });
    coupon = couponSnap.data();
    const validation = validateCoupon(coupon, { productKey, customerType, quantity });
    if (!validation.valid) return res.status(400).json({ error: validation.reason });
    discountAmount = calculateCouponDiscount(coupon, baseAmount, quantity);
  }

  return res.status(200).json({
    userId: decoded.uid,
    productKey,
    product: product.sku,
    label: product.label,
    quantity,
    baseAmount,
    discountAmount,
    amount: Math.max(0, baseAmount - discountAmount),
    currency: 'INR',
    coupon: serialiseCoupon(coupon, couponCode),
  });
}
