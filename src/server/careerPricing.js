import { CAREER_PRICING } from '../config/careerPricing.js';

export const CAREER_CUSTOMER_TYPES = ['student', 'professional', 'hr', 'institution'];

export function customerTypeForProduct(productKey) {
  const key = String(productKey || '').trim();
  if (key.startsWith('student_')) return 'student';
  if (key.startsWith('professional_')) return 'professional';
  if (key.startsWith('hr_')) return 'hr';
  if (key.startsWith('institution_')) return 'institution';
  return null;
}

export async function getCareerProductConfig(db, productKey) {
  const key = String(productKey || '').trim();
  const product = CAREER_PRICING[key] || null;
  if (!product) return null;

  const snap = await db.collection('platformConfig').doc('careerPricing').get();
  const override = snap.exists ? snap.data()?.products?.[key] : null;
  if (override?.active === false) return { key, ...product, active: false };

  return {
    key,
    ...product,
    amountPaise: Number.isInteger(override?.amountPaise) ? override.amountPaise : product.amountPaise,
    active: true,
    updatedAt: override?.updatedAt || null,
  };
}

export function normaliseCouponCode(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function dateIsInWindow(coupon, now = new Date()) {
  const startsAt = coupon?.startsAt ? new Date(coupon.startsAt) : null;
  const endsAt = coupon?.endsAt ? new Date(coupon.endsAt) : null;
  if (startsAt && !Number.isNaN(startsAt.getTime()) && now < startsAt) return false;
  if (endsAt && !Number.isNaN(endsAt.getTime()) && now > endsAt) return false;
  return true;
}

export function validateCoupon(coupon, { productKey, customerType, quantity = 1, now = new Date() } = {}) {
  if (!coupon || coupon.active === false) return { valid: false, reason: 'Coupon is not active.' };
  if (!dateIsInWindow(coupon, now)) return { valid: false, reason: 'Coupon is outside its validity period.' };

  const allowedTypes = Array.isArray(coupon.customerTypes) ? coupon.customerTypes : [];
  if (allowedTypes.length && !allowedTypes.includes(customerType)) {
    return { valid: false, reason: 'Coupon is not available for this customer type.' };
  }

  const allowedProducts = Array.isArray(coupon.productKeys) ? coupon.productKeys : [];
  if (allowedProducts.length && !allowedProducts.includes(productKey)) {
    return { valid: false, reason: 'Coupon is not valid for this product.' };
  }

  const maxRedemptions = Number(coupon.maxRedemptions || 0);
  const redemptions = Number(coupon.redemptions || 0);
  if (maxRedemptions > 0 && redemptions >= maxRedemptions) {
    return { valid: false, reason: 'Coupon redemption limit has been reached.' };
  }

  if (!Number.isInteger(quantity) || quantity < 1) return { valid: false, reason: 'Invalid product quantity.' };
  return { valid: true };
}

export function calculateCouponDiscount(coupon, baseAmountPaise, quantity = 1) {
  const base = Math.max(0, Math.round(Number(baseAmountPaise || 0)));
  if (!coupon || base === 0) return 0;

  const type = String(coupon.type || 'percentage');
  const value = Math.max(0, Number(coupon.valuePaise ?? coupon.value ?? 0));
  let discount = 0;

  if (type === 'percentage') {
    discount = Math.round(base * Math.min(100, value) / 100);
  } else if (type === 'fixed') {
    discount = Math.round(value);
  } else if (type === 'fixed_per_student') {
    discount = Math.round(value * Math.max(1, quantity));
  } else if (type === 'sponsored') {
    discount = base;
  }

  return Math.min(base, Math.max(0, discount));
}

export function serialiseCoupon(coupon, code) {
  if (!coupon) return null;
  return {
    code: code || coupon.code || null,
    type: coupon.type || 'percentage',
    valuePaise: Number(coupon.valuePaise || 0),
    customerTypes: Array.isArray(coupon.customerTypes) ? coupon.customerTypes : [],
    productKeys: Array.isArray(coupon.productKeys) ? coupon.productKeys : [],
  };
}
