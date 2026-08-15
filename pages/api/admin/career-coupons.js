import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_PRICING } from '../../../src/config/careerPricing.js';
import { CAREER_CUSTOMER_TYPES, normaliseCouponCode } from '../../../src/server/careerPricing.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
const COUPON_TYPES = new Set(['percentage', 'fixed', 'fixed_per_student', 'sponsored']);

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function requireAdmin(req) {
  const token = bearerToken(req);
  if (!token) throw Object.assign(new Error('Authentication required.'), { status: 401 });
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    throw Object.assign(new Error('Invalid or expired authentication token.'), { status: 401 });
  }

  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const db = getAdminFirestore();
  const snap = await db.collection('users').doc(decoded.uid).get();
  const user = snap.exists ? snap.data() : {};
  if (!isFounder && user.role !== 'super_admin') {
    throw Object.assign(new Error('Super Admin access required.'), { status: 403 });
  }
  return { db, decoded };
}

function clean(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

function normaliseCoupon(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    code: data.code || doc.id,
    type: data.type || 'percentage',
    valuePaise: Number(data.valuePaise || 0),
    active: data.active !== false,
    customerTypes: Array.isArray(data.customerTypes) ? data.customerTypes : [],
    productKeys: Array.isArray(data.productKeys) ? data.productKeys : [],
    startsAt: data.startsAt || null,
    endsAt: data.endsAt || null,
    maxRedemptions: Number(data.maxRedemptions || 0),
    redemptions: Number(data.redemptions || 0),
    description: data.description || '',
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function validatePayload(body, { partial = false } = {}) {
  const code = normaliseCouponCode(body.code);
  const type = clean(body.type, 40);
  const description = clean(body.description, 300);
  const customerTypes = Array.isArray(body.customerTypes) ? body.customerTypes.filter(x => CAREER_CUSTOMER_TYPES.includes(x)) : [];
  const productKeys = Array.isArray(body.productKeys) ? body.productKeys.filter(x => Object.prototype.hasOwnProperty.call(CAREER_PRICING, x)) : [];
  const maxRedemptions = Number(body.maxRedemptions || 0);
  const startsAt = body.startsAt ? new Date(body.startsAt) : null;
  const endsAt = body.endsAt ? new Date(body.endsAt) : null;

  if (!partial && !code) throw Object.assign(new Error('Coupon code is required.'), { status: 400 });
  if (type && !COUPON_TYPES.has(type)) throw Object.assign(new Error('Unsupported coupon type.'), { status: 400 });
  if (!Number.isInteger(maxRedemptions) || maxRedemptions < 0) throw Object.assign(new Error('Maximum redemptions must be a whole number; use 0 for unlimited.'), { status: 400 });
  if (startsAt && Number.isNaN(startsAt.getTime())) throw Object.assign(new Error('Invalid coupon start date.'), { status: 400 });
  if (endsAt && Number.isNaN(endsAt.getTime())) throw Object.assign(new Error('Invalid coupon end date.'), { status: 400 });
  if (startsAt && endsAt && startsAt > endsAt) throw Object.assign(new Error('Coupon end date must be after its start date.'), { status: 400 });

  const valuePaise = body.valuePaise == null ? null : Number(body.valuePaise);
  if (valuePaise != null && (!Number.isInteger(valuePaise) || valuePaise < 0)) throw Object.assign(new Error('Coupon value must be a non-negative whole number of paise.'), { status: 400 });
  if (type === 'percentage' && valuePaise != null && valuePaise > 100) throw Object.assign(new Error('Percentage coupons cannot exceed 100%.'), { status: 400 });

  return {
    ...(code ? { code } : {}),
    ...(type ? { type } : {}),
    ...(valuePaise != null ? { valuePaise } : {}),
    ...(description ? { description } : { description: '' }),
    customerTypes,
    productKeys,
    ...(body.startsAt !== undefined ? { startsAt: startsAt ? startsAt.toISOString() : null } : {}),
    ...(body.endsAt !== undefined ? { endsAt: endsAt ? endsAt.toISOString() : null } : {}),
    ...(body.maxRedemptions !== undefined ? { maxRedemptions } : {}),
    ...(body.active !== undefined ? { active: body.active !== false } : {}),
  };
}

async function audit(db, decoded, action, code, details = {}) {
  await db.collection('adminAuditLogs').add({
    action,
    resource: 'career_coupon',
    resourceId: code,
    actorUid: decoded.uid,
    actorEmail: decoded.email || null,
    details,
    createdAt: new Date().toISOString(),
  });
}

export default async function handler(req, res) {
  try {
    const { db, decoded } = await requireAdmin(req);
    const collection = db.collection('careerCoupons');

    if (req.method === 'GET') {
      const snap = await collection.orderBy('createdAt', 'desc').limit(500).get();
      return res.status(200).json({
        coupons: snap.docs.map(normaliseCoupon),
        products: Object.entries(CAREER_PRICING).map(([key, value]) => ({ key, sku: value.sku, label: value.label })),
        customerTypes: CAREER_CUSTOMER_TYPES,
      });
    }

    if (req.method === 'POST') {
      const payload = validatePayload(req.body || {});
      const ref = collection.doc(payload.code);
      if ((await ref.get()).exists) return res.status(409).json({ error: 'A coupon with this code already exists.' });
      const now = new Date().toISOString();
      await ref.set({
        ...payload,
        active: payload.active !== false,
        redemptions: 0,
        createdBy: decoded.uid,
        createdAt: now,
        updatedAt: now,
      });
      await audit(db, decoded, 'coupon.created', payload.code, { type: payload.type, valuePaise: payload.valuePaise || 0 });
      return res.status(201).json({ coupon: normaliseCoupon(await ref.get()) });
    }

    if (req.method === 'PUT') {
      const code = normaliseCouponCode(req.body?.code);
      if (!code) return res.status(400).json({ error: 'Coupon code is required.' });
      const ref = collection.doc(code);
      const existing = await ref.get();
      if (!existing.exists) return res.status(404).json({ error: 'Coupon not found.' });
      const payload = validatePayload(req.body || {}, { partial: true });
      const now = new Date().toISOString();
      await ref.set({ ...payload, updatedBy: decoded.uid, updatedAt: now }, { merge: true });
      await audit(db, decoded, 'coupon.updated', code, { fields: Object.keys(payload) });
      return res.status(200).json({ coupon: normaliseCoupon(await ref.get()) });
    }

    if (req.method === 'DELETE') {
      const code = normaliseCouponCode(req.query?.code || req.body?.code);
      if (!code) return res.status(400).json({ error: 'Coupon code is required.' });
      const ref = collection.doc(code);
      const existing = await ref.get();
      if (!existing.exists) return res.status(404).json({ error: 'Coupon not found.' });
      const now = new Date().toISOString();
      await ref.set({ active: false, updatedBy: decoded.uid, updatedAt: now }, { merge: true });
      await audit(db, decoded, 'coupon.disabled', code);
      return res.status(200).json({ success: true, code, active: false });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Unable to manage coupons.' });
  }
}
