import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin';
import { assertCollegePublication } from '../../../../src/career/catalogueRepository';

const COLLECTIONS = new Set(['careerFamilies', 'careers', 'courses', 'colleges', 'catalogueRelationships']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7), true);
    const role = decoded.role;
    const isAdmin = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com'
      || role === 'super_admin';
    if (!isAdmin) return res.status(403).json({ error: 'Administrator access required.' });

    const { collection, id } = req.body || {};
    if (!COLLECTIONS.has(collection) || !id) return res.status(400).json({ error: 'Valid collection and id are required.' });

    const db = getAdminFirestore();
    const ref = db.collection(collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Catalogue record not found.' });
    const record = snap.data();

    if (collection === 'colleges') assertCollegePublication(record);
    await ref.update({ status: 'published', publishedAt: new Date(), publishedBy: decoded.uid, version: Number(record.version || 1) + 1 });

    return res.status(200).json({ ok: true, id, collection });
  } catch (error) {
    console.error('catalogue publish error', error);
    return res.status(400).json({ error: error.message || 'Unable to publish catalogue record.' });
  }
}
