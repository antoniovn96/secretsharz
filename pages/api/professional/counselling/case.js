import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveDomainRelationship } from '../../../../src/security/relationshipResolver.js';
import { canAccessCounsellingScope, COUNSELLING_SCOPES } from '../../../../src/security/counsellingAccessPolicy.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const studentId = String(req.query.studentId || '').trim();
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const db = getAdminFirestore();
    const relationship = await resolveDomainRelationship({ db, subjectPersonId: studentId, relatedPersonId: decoded.uid, domain: 'counselling' });
    const access = canAccessCounsellingScope({ role: decoded.role, scope: COUNSELLING_SCOPES.CASE, assignedCase: relationship.allowed, activeRelationship: relationship.allowed });
    if (!access.allowed) return res.status(403).json({ error: 'Counselling case access denied', code: 'COUNSELLING_SCOPE_DENIED' });
    const studentSnap = await db.collection('users').doc(studentId).get();
    if (!studentSnap.exists) return res.status(404).json({ error: 'Student not found' });
    const student = studentSnap.data() || {};
    return res.status(200).json({ student: { id: studentId, name: student.name || null, grade: student.grade || null, schoolName: student.schoolName || null }, authorization: { source: relationship.source, migrationFallback: Boolean(relationship.migrationFallback) } });
  } catch (error) {
    console.error('Counselling case access error:', error);
    return res.status(500).json({ error: 'Unable to authorise counselling case access' });
  }
}
