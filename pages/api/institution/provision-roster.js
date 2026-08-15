import crypto from 'crypto';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

function slug(value) {
  return clean(value, 80).toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 10) || 'SCHOOL';
}

function makeCode(tenantCode) {
  const random = crypto.randomBytes(6).toString('hex').toUpperCase();
  const year = String(new Date().getFullYear()).slice(-2);
  return `SSZ-${tenantCode}-${year}-${random}`;
}

function normaliseRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row, index) => ({
    rowNumber: index + 2,
    fullName: clean(row.fullName || row.name || row.studentName, 180),
    className: clean(row.className || row.class || row.grade, 80),
    section: clean(row.section || row.division, 40),
    rollNumber: clean(row.rollNumber || row.roll || '', 50),
  })).filter(row => row.fullName);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const db = getAdminFirestore();
  let caller = {};
  try {
    const callerSnap = await db.collection('users').doc(decoded.uid).get();
    caller = callerSnap.exists ? callerSnap.data() : {};
  } catch (_) {}

  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const requestedInstitutionId = clean(req.body?.institutionId, 120);
  const requestedName = clean(req.body?.institutionName, 180);
  const rows = normaliseRows(req.body?.rows);

  if (!rows.length) return res.status(400).json({ error: 'No valid student rows were supplied.' });
  if (rows.length > 1000) return res.status(400).json({ error: 'A single roster upload is limited to 1,000 students.' });

  const institutionId = requestedInstitutionId || (isFounder ? `${slug(requestedName)}-${crypto.randomBytes(3).toString('hex')}` : clean(caller.institutionId, 120));
  if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });

  const isInstitutionCoordinator = caller.role === 'institution_member' && caller.institutionId === institutionId;
  if (!isFounder && !isInstitutionCoordinator) return res.status(403).json({ error: 'Institution coordinator access required.' });

  const institutionRef = db.collection('institutions').doc(institutionId);
  const institutionSnap = await institutionRef.get();
  const existing = institutionSnap.exists ? institutionSnap.data() : null;

  const institutionName = requestedName || clean(existing?.name, 180) || clean(caller.institutionName, 180);
  if (!institutionName) return res.status(400).json({ error: 'Institution name is required.' });

  const requestedLicenseCount = Number(req.body?.licenseCount || existing?.licenses?.purchased || 0);
  if (isFounder && (!Number.isInteger(requestedLicenseCount) || requestedLicenseCount < rows.length)) {
    return res.status(400).json({ error: `License allocation must cover all uploaded students. You supplied ${rows.length} students.` });
  }

  const purchased = Number(existing?.licenses?.purchased || (isFounder ? requestedLicenseCount : 0));
  const used = Number(existing?.licenses?.used || 0);
  const available = purchased - used;
  if (!purchased) return res.status(400).json({ error: 'This institution has no purchased assessment licenses yet.' });
  if (rows.length > available) return res.status(409).json({ error: `Only ${available} licenses are available, but ${rows.length} students were uploaded.` });

  const tenantCode = clean(existing?.tenantCode || slug(institutionName), 20);
  const batchId = `batch_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const createdAt = new Date().toISOString();
  const codes = [];
  const batch = db.batch();

  for (const row of rows) {
    let code = makeCode(tenantCode);
    let codeRef = db.collection('institutionCodes').doc(code);
    // Cryptographic random generation makes collision extremely unlikely; this
    // second check keeps the uniqueness guarantee explicit at the database layer.
    let exists = (await codeRef.get()).exists;
    while (exists) {
      code = makeCode(tenantCode);
      codeRef = db.collection('institutionCodes').doc(code);
      exists = (await codeRef.get()).exists;
    }

    const rosterRef = institutionRef.collection('roster').doc();
    const rosterRecord = {
      id: rosterRef.id,
      batchId,
      institutionId,
      institutionName,
      fullName: row.fullName,
      className: row.className,
      section: row.section,
      rollNumber: row.rollNumber,
      accessCode: code,
      status: 'unclaimed',
      assessmentStatus: 'not_started',
      reportStatus: 'locked_until_completion',
      createdAt,
      claimedBy: null,
      claimedAt: null,
    };

    batch.set(rosterRef, rosterRecord);
    batch.set(codeRef, {
      code,
      institutionId,
      institutionName,
      rosterId: rosterRef.id,
      batchId,
      status: 'available',
      createdAt,
      redeemedBy: null,
      redeemedAt: null,
    });
    codes.push(rosterRecord);
  }

  batch.set(institutionRef, {
    id: institutionId,
    name: institutionName,
    tenantCode,
    status: existing?.status || 'active',
    licenses: {
      purchased,
      used: used + rows.length,
      available: purchased - used - rows.length,
      lastProvisionedAt: createdAt,
      lastBatchId: batchId,
    },
    updatedAt: createdAt,
    ...(existing ? {} : { createdAt }),
  }, { merge: true });

  await batch.commit();

  return res.status(200).json({
    success: true,
    institution: { id: institutionId, name: institutionName, tenantCode, purchased, used: used + rows.length, available: purchased - used - rows.length },
    batchId,
    students: codes,
  });
}
