import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveDomainRelationship } from '../../../../src/security/relationshipResolver.js';
import { resolveServiceConsent, CONSENT_TYPES } from '../../../../src/security/consentResolver.js';
import { canAccessCounsellingScope, COUNSELLING_SCOPES } from '../../../../src/security/counsellingAccessPolicy.js';

const NOTE_FIELDS = ['subjective', 'objective', 'assessment', 'plan'];

function cleanSoap(input = {}) {
  const soap = {};
  for (const field of NOTE_FIELDS) if (typeof input[field] === 'string') soap[field] = input[field].trim();
  return soap;
}

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();
    const studentId = String(req.query.studentId || req.body?.studentId || '').trim();
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const requesterId = decoded.uid;
    const relationship = await resolveDomainRelationship({ db, subjectPersonId: studentId, relatedPersonId: requesterId, domain: 'counselling' });
    const access = canAccessCounsellingScope({ role: decoded.role, scope: COUNSELLING_SCOPES.SESSION, assignedCase: relationship.allowed, activeRelationship: relationship.allowed });
    if (!access.allowed) return res.status(403).json({ error: 'Counselling session access denied', code: 'COUNSELLING_SCOPE_DENIED' });

    const consent = await resolveServiceConsent({ db, userId: studentId, serviceType: CONSENT_TYPES.COUNSELLING });
    if (!consent.allowed) return res.status(403).json({ error: 'Required counselling consent is not active', code: 'CONSENT_REQUIRED' });

    const sessionCollection = db.collection('students').doc(studentId).collection('counsellingSessions');
    if (req.method === 'GET') {
      const snapshot = await sessionCollection.orderBy('createdAt', 'desc').limit(50).get();
      return res.status(200).json({ sessions: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
    }
    if (req.method === 'POST') {
      const soap = cleanSoap(req.body?.soap);
      if (!NOTE_FIELDS.some(field => soap[field])) return res.status(400).json({ error: 'Cannot save an empty clinical note' });
      const now = new Date();
      const ref = await sessionCollection.add({ providerId: requesterId, domain: 'counselling', format: 'SOAP', soap, createdAt: now, updatedAt: now });
      return res.status(201).json({ id: ref.id, createdAt: now.toISOString() });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Counselling session API error:', error);
    return res.status(500).json({ error: 'Unable to process counselling session request' });
  }
}
