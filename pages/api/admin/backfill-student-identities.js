import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { getExistingStudentId } from '../../../src/platform/studentIdentity.js';
import { allocateStudentId, seedStudentIdentityCounter } from '../../../src/platform/studentIdentityAllocator.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';

function resolveName(raw, authUser) {
  return String(
    raw?.studentProfile?.identity?.fullName ||
    raw?.studentProfile?.identity?.legalName ||
    raw?.studentProfile?.fullName ||
    raw?.fullName ||
    raw?.name ||
    authUser?.displayName ||
    ''
  ).trim();
}

function resolvePreferredName(raw) {
  return String(raw?.studentProfile?.identity?.preferredName || raw?.studentProfile?.preferredName || raw?.preferredName || '').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  const db = getAdminFirestore();
  const auth = getAdminAuth();

  try {
    const snapshot = await db.collection('users').get();
    const studentDocs = snapshot.docs.filter(doc => isStudentProfile(doc.data() || {}));
    const existingIds = studentDocs.map(doc => getExistingStudentId(doc.data() || {})).filter(Boolean);
    await seedStudentIdentityCounter(db, existingIds);

    const results = [];
    for (const doc of studentDocs) {
      const raw = doc.data() || {};
      const existingId = getExistingStudentId(raw);
      let authUser = null;
      try { authUser = await auth.getUser(doc.id); }
      catch (error) { console.warn('[student identity backfill] auth lookup failed:', doc.id, error?.code || error?.message); }

      const ssStudentId = existingId || await allocateStudentId(db);
      const fullName = resolveName(raw, authUser);
      const preferredName = resolvePreferredName(raw);
      const existingProfile = raw.studentProfile && typeof raw.studentProfile === 'object' ? raw.studentProfile : {};
      const existingIdentity = existingProfile.identity && typeof existingProfile.identity === 'object' ? existingProfile.identity : {};
      const identity = { ...existingIdentity, ssStudentId };
      if (!existingIdentity.fullName && fullName) identity.fullName = fullName;
      if (!existingIdentity.preferredName && preferredName) identity.preferredName = preferredName;

      await doc.ref.set({
        ssStudentId,
        studentProfile: { ...existingProfile, identity },
        identityContractVersion: '1.1.0',
      }, { merge: true });

      results.push({
        studentDocumentId: doc.id,
        ssStudentId,
        name: fullName,
        nameSource: existingIdentity.fullName ? 'canonical' : (authUser?.displayName ? 'firebase-auth' : 'missing'),
        idSource: existingId ? 'existing' : 'allocated',
      });
    }

    return res.status(200).json({
      ok: true,
      processed: results.length,
      assigned: results.filter(item => item.idSource === 'allocated').length,
      namesRecovered: results.filter(item => item.nameSource === 'firebase-auth').length,
      namesMissing: results.filter(item => item.nameSource === 'missing').length,
      students: results,
    });
  } catch (error) {
    console.error('[student identity backfill] failed:', error);
    return res.status(500).json({ error: 'Unable to backfill canonical student identities.' });
  }
}
