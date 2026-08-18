import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const db = getAdminFirestore();
  const institutionId = String(req.query?.institutionId || decoded.institutionId || '').trim();
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';
  const hasAccess = decoded.role === 'institution_member' && decoded.institutionRole === 'coordinator' && decoded.institutionId === institutionId;
  if (!isFounder && !hasAccess) return res.status(403).json({ error: 'Institution coordinator access required.' });
  if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });

  const institutionSnap = await db.collection('institutions').doc(institutionId).get();
  if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });

  // Deliberately use a single indexed role query and filter the institutional
  // relationship in application code. This avoids requiring a composite
  // Firestore index just for the coordinator parent directory.
  const snapshot = await db.collection('users').where('role', '==', 'parent').limit(5000).get();
  const parents = snapshot.docs.filter((doc) => {
    const data = doc.data() || {};
    return Array.isArray(data.institutionIds) && data.institutionIds.includes(institutionId);
  }).map((doc) => {
    const data = doc.data() || {};
    const linkedRosterIds = Array.isArray(data.linkedRosterIds) ? data.linkedRosterIds : [];
    const linkedStudentIds = Array.isArray(data.linkedStudentIds) ? data.linkedStudentIds : [];
    return {
      id: doc.id,
      name: data.name || '',
      email: data.email || '',
      relationship: data.parentRelationship || 'guardian',
      consentStatus: data.consentStatus || 'pending',
      accountStatus: data.accountProvisioning?.status || 'invited',
      linkedStudents: linkedStudentIds.length,
      linkedRosterRecords: linkedRosterIds.length,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return res.status(200).json({
    institution: { id: institutionId, name: institutionSnap.data()?.name || '' },
    parents,
    summary: {
      total: parents.length,
      invited: parents.filter((parent) => parent.accountStatus === 'invited').length,
      consentPending: parents.filter((parent) => parent.consentStatus === 'pending').length,
      linkedStudents: parents.reduce((sum, parent) => sum + parent.linkedStudents, 0),
    },
  });
}
