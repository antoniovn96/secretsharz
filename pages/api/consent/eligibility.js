import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { evaluateConsentEligibility, getAgeBand } from '../../../src/security/consentEligibility.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const studentId = String(req.query.studentId || decoded.uid);
    const actorType = String(req.query.actorType || (studentId === decoded.uid ? 'self' : 'guardian'));
    const consentType = String(req.query.type || 'counselling');
    const db = getAdminFirestore();
    const student = await db.collection('users').doc(studentId).get();
    if (!student.exists) return res.status(404).json({ error: 'Student not found' });
    const data = student.data() || {};
    const ageBand = getAgeBand(data.dateOfBirth || data.dob || data.birthDate);
    const decision = evaluateConsentEligibility({ consentType, actorType, ageBand });
    return res.status(200).json({ studentId, consentType, actorType, ageBand, ...decision });
  } catch (error) {
    console.error('Consent eligibility error:', error);
    return res.status(400).json({ error: error.message || 'Unable to evaluate consent eligibility' });
  }
}
