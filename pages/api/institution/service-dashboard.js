import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';
const SERVICES = new Set(['wellbeing', 'sen']);

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function normaliseService(value) {
  return String(value || '').trim().toLowerCase();
}

function serviceEntitled(institution, service) {
  const services = institution?.licenses?.services;
  if (!Array.isArray(services)) return false;
  return services.map(normaliseService).includes(service);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const service = normaliseService(req.query?.service);
  if (!SERVICES.has(service)) return res.status(400).json({ error: 'Unsupported institution service.' });

  const db = getAdminFirestore();
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const institutionId = String(req.query?.institutionId || decoded.institutionId || '').trim();
  if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });

  const hasInstitutionAccess = (
    decoded.role === 'institution_member' &&
    decoded.institutionRole === 'coordinator' &&
    decoded.institutionId === institutionId
  );
  if (!isFounder && !hasInstitutionAccess) {
    return res.status(403).json({ error: 'Institution coordinator access required.' });
  }

  const institutionSnap = await db.collection('institutions').doc(institutionId).get();
  if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });
  const institution = institutionSnap.data();
  const paid = institution.licenses?.paymentStatus === 'paid';
  if (!paid && !isFounder) return res.status(403).json({ error: 'Institution entitlement is not active.' });
  if (!isFounder && !serviceEntitled(institution, service)) {
    return res.status(403).json({ error: `The ${service} institutional service is not included in this entitlement.` });
  }

  const rosterSnap = await db.collection('institutions').doc(institutionId).collection('roster').get();
  const roster = rosterSnap.docs.map((doc) => doc.data());
  const claimed = roster.filter((student) => student.status === 'claimed').length;

  // Service membership is derived from the canonical student profile, never from
  // primary_path/studentTrack legacy fields. Institutional reporting remains aggregate-only.
  const usersSnap = await db.collection('users').where('institutionId', '==', institutionId).get();
  const canonicalStudents = usersSnap.docs.map((doc) => ({ id: doc.id, profile: normalizeStudentRecord(doc.data(), doc.id) }));
  const serviceUsers = canonicalStudents.filter(({ profile }) => profile.services?.[service]?.status === 'active');
  const operationallyActive = serviceUsers.filter(({ profile }) => profile.services?.[service]?.status === 'active').length;

  // IMPORTANT: This endpoint deliberately returns aggregate operational data only.
  // It must never expose journal entries, mood logs, counselling notes, diagnoses,
  // SEN case files, IEP contents, risk labels, or other individual clinical data
  // to an institution coordinator.
  const summary = {
    rosterStudents: roster.length,
    claimedStudents: claimed,
    activationRate: roster.length ? Math.round((claimed / roster.length) * 100) : 0,
    serviceLinkedAccounts: serviceUsers.length,
    operationallyActive,
  };

  return res.status(200).json({
    institution: {
      id: institutionId,
      name: institution.name || '',
      tenantCode: institution.tenantCode || '',
      paymentStatus: institution.licenses?.paymentStatus || 'pending',
    },
    service,
    summary,
    privacy: {
      mode: 'aggregate_only',
      excluded: [
        'private journals',
        'mood logs',
        'counselling notes',
        'diagnoses',
        'risk labels',
        'SEN case files',
        'IEP contents',
        'individual clinical reports',
      ],
    },
  });
}
