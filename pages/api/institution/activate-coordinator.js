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

  const code = clean(req.body?.code, 120).toUpperCase();
  if (!code) return res.status(400).json({ error: 'Please enter the institution coordinator code.' });

  const db = getAdminFirestore();
  const snapshot = await db.collection('institutions')
    .where('institutionCode', '==', code)
    .limit(1)
    .get();

  if (snapshot.empty) return res.status(404).json({ error: 'This institution coordinator code was not found.' });

  const institutionRef = snapshot.docs[0].ref;
  const institution = snapshot.docs[0].data();
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;

  if (institution.status !== 'active') {
    return res.status(409).json({ error: 'This institution is not active yet. Please contact the Secret Sharz administrator.' });
  }

  if (institution.licenses?.paymentStatus !== 'paid' && !isFounder) {
    return res.status(409).json({ error: 'The institution entitlement has not been activated because payment is still pending.' });
  }

  const coordinatorEmail = clean(institution.contactEmail, 254).toLowerCase();
  const currentEmail = clean(decoded.email, 254).toLowerCase();
  if (coordinatorEmail && currentEmail !== coordinatorEmail && !isFounder) {
    return res.status(403).json({ error: `Please sign in with the coordinator email registered for ${institution.name}.` });
  }

  const now = new Date().toISOString();
  const userRef = db.collection('users').doc(decoded.uid);

  // Preserve every existing custom claim. The previous implementation rebuilt
  // the claim object from decoded.role, which could silently discard unrelated
  // trusted claims when coordinator access was activated.
  const existingUser = await getAdminAuth().getUser(decoded.uid);
  await getAdminAuth().setCustomUserClaims(decoded.uid, {
    ...(existingUser.customClaims || {}),
    role: 'institution_member',
    institutionId: institutionRef.id,
    institutionRole: 'coordinator',
  });

  await userRef.set({
    institutionId: institutionRef.id,
    institutionName: institution.name || '',
    institutionRole: 'coordinator',
    role: 'institution_member',
    status: 'active',
    profileComplete: true,
    institutionAccess: {
      type: 'institutional_career_guidance',
      status: 'active',
      grantedAt: now,
    },
    updatedAt: now,
  }, { merge: true });

  await institutionRef.set({
    coordinator: {
      uid: decoded.uid,
      name: decoded.name || decoded.email || '',
      email: decoded.email || '',
      activatedAt: now,
      role: 'coordinator',
    },
    updatedAt: now,
  }, { merge: true });

  return res.status(200).json({
    success: true,
    institution: {
      id: institutionRef.id,
      name: institution.name || '',
      tenantCode: institution.tenantCode || '',
    },
    message: `Coordinator access activated for ${institution.name || 'this institution'}.`,
    refreshToken: true,
  });
}
