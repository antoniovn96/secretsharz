import crypto from 'crypto';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 200) {
  return String(value || '').trim().slice(0, max);
}

function slug(value) {
  return clean(value, 60).toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 12) || 'INSTITUTION';
}

function institutionCode(name) {
  return `SSZ-${slug(name)}-${String(new Date().getFullYear()).slice(-2)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function requireAdmin(req) {
  const token = bearerToken(req);
  if (!token) throw Object.assign(new Error('Authentication required.'), { statusCode: 401 });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    throw Object.assign(new Error('Invalid or expired authentication token.'), { statusCode: 401 });
  }

  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const isSuperAdmin = decoded.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) throw Object.assign(new Error('Super Admin access required.'), { statusCode: 403 });
  return decoded;
}

function normaliseInstitution(doc) {
  const data = doc.data();
  const licenses = data.licenses || {};
  const coordinator = data.coordinator || {};
  return {
    id: doc.id,
    name: data.name || '',
    institutionCode: data.institutionCode || data.tenantCode || '',
    tenantCode: data.tenantCode || '',
    status: data.status || 'pending',
    address: data.address || '',
    contactPerson: data.contactPerson || '',
    contactEmail: data.contactEmail || '',
    contactPhone: data.contactPhone || '',
    coordinator: {
      uid: coordinator.uid || null,
      name: coordinator.name || data.contactPerson || '',
      email: coordinator.email || data.contactEmail || '',
      activatedAt: coordinator.activatedAt || null,
      role: coordinator.role || null,
      activated: Boolean(coordinator.uid),
    },
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    licenses: {
      purchased: Number(licenses.purchased || 0),
      used: Number(licenses.used || 0),
      available: Number(licenses.available ?? Math.max(0, Number(licenses.purchased || 0) - Number(licenses.used || 0))),
      pricePerLicense: Number(licenses.pricePerLicense || 0),
      discountType: licenses.discountType || 'none',
      discountValue: Number(licenses.discountValue || 0),
      totalAmount: Number(licenses.totalAmount || 0),
      paymentStatus: licenses.paymentStatus || 'pending',
    },
  };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    await requireAdmin(req);
    const db = getAdminFirestore();

    if (req.method === 'GET') {
      const snapshot = await db.collection('institutions').orderBy('createdAt', 'desc').limit(1000).get();
      const institutions = snapshot.docs.map(normaliseInstitution);
      const totals = institutions.reduce((acc, institution) => {
        acc.totalInstitutions += 1;
        acc.totalLicenses += institution.licenses.purchased;
        acc.usedLicenses += institution.licenses.used;
        acc.availableLicenses += institution.licenses.available;
        if (institution.status === 'active') acc.activeInstitutions += 1;
        if (institution.licenses.paymentStatus === 'pending') acc.pendingPayments += 1;
        if (institution.coordinator.activated) acc.activeCoordinators += 1;
        return acc;
      }, { totalInstitutions: 0, activeInstitutions: 0, totalLicenses: 0, usedLicenses: 0, availableLicenses: 0, pendingPayments: 0, activeCoordinators: 0 });

      return res.status(200).json({ institutions, totals, generatedAt: new Date().toISOString() });
    }

    const body = req.body || {};
    const name = clean(body.name);
    if (!name) return res.status(400).json({ error: 'Institution name is required.' });

    const purchased = Number(body.licenseCount);
    if (!Number.isInteger(purchased) || purchased < 1 || purchased > 100000) {
      return res.status(400).json({ error: 'License count must be a whole number between 1 and 100,000.' });
    }

    const pricePerLicense = Number(body.pricePerLicense || 0);
    const discountType = body.discountType === 'percentage' || body.discountType === 'fixed' ? body.discountType : 'none';
    const discountValue = Math.max(0, Number(body.discountValue || 0));
    const gross = purchased * Math.max(0, pricePerLicense);
    const discountAmount = discountType === 'percentage'
      ? Math.min(gross, gross * Math.min(100, discountValue) / 100)
      : Math.min(gross, discountValue * purchased);
    const totalAmount = Math.max(0, Math.round(gross - discountAmount));

    const ref = db.collection('institutions').doc();
    const now = new Date().toISOString();
    const code = institutionCode(name);
    const record = {
      id: ref.id,
      name,
      institutionCode: code,
      tenantCode: code.replace(/^SSZ-/, '').slice(0, 20),
      status: body.status === 'active' ? 'active' : 'pending',
      address: clean(body.address, 500),
      contactPerson: clean(body.contactPerson, 160),
      contactEmail: clean(body.contactEmail, 180).toLowerCase(),
      contactPhone: clean(body.contactPhone, 30),
      coordinator: null,
      licenses: {
        purchased,
        used: 0,
        available: purchased,
        pricePerLicense: Math.max(0, Math.round(pricePerLicense)),
        discountType,
        discountValue,
        grossAmount: gross,
        discountAmount,
        totalAmount,
        paymentStatus: body.paymentStatus === 'paid' ? 'paid' : 'pending',
        createdAt: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    await ref.set(record);
    return res.status(201).json({ institution: normaliseInstitution(await ref.get()) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Unable to manage institutions.' });
  }
}
