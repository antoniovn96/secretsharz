import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

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
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const db = getAdminFirestore();
  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const institutionId = String(req.query?.institutionId || decoded.institutionId || '').trim();
  const rosterId = String(req.query?.rosterId || '').trim();

  if (!institutionId || !rosterId) {
    return res.status(400).json({ error: 'Institution and student record are required.' });
  }

  // The Institution Dashboard and every institution API use the same trusted
  // coordinator relationship. Never fall back to mutable Firestore user.role.
  const hasInstitutionAccess = (
    decoded.role === 'institution_member' &&
    decoded.institutionRole === 'coordinator' &&
    decoded.institutionId === institutionId
  );
  if (!isFounder && !hasInstitutionAccess) {
    return res.status(403).json({ error: 'Institution coordinator access required.' });
  }

  const institutionRef = db.collection('institutions').doc(institutionId);
  const institution = await institutionRef.get();
  if (!institution.exists) return res.status(404).json({ error: 'Institution not found.' });

  const institutionData = institution.data();
  if (institutionData.status !== 'active') {
    return res.status(409).json({ error: 'This institution is not active.' });
  }
  if (institutionData.licenses?.paymentStatus !== 'paid' && !isFounder) {
    return res.status(409).json({ error: 'Institutional reports are locked until the entitlement is activated.' });
  }

  const roster = await institutionRef.collection('roster').doc(rosterId).get();
  if (!roster.exists) return res.status(404).json({ error: 'Student record not found.' });

  const rosterData = roster.data();
  if (!rosterData.claimedBy) {
    return res.status(409).json({ error: 'This student has not yet claimed the assessment code.' });
  }
  if (rosterData.assessmentStatus !== 'completed' && rosterData.reportStatus !== 'ready') {
    return res.status(409).json({ error: 'The student career assessment has not been completed.' });
  }

  const studentSnap = await db.collection('users').doc(rosterData.claimedBy).get();
  if (!studentSnap.exists) return res.status(404).json({ error: 'Student account not found.' });

  const student = studentSnap.data();

  // Explicitly scope the institution-facing report to the career-guidance
  // domain. Do not return the complete student document, counselling notes,
  // SEN records, consent records, or other sensitive domains.
  const careerReport = student.careerAssessmentV2;
  if (!careerReport) return res.status(409).json({ error: 'Assessment report is not ready yet.' });

  return res.status(200).json({
    student: {
      fullName: rosterData.fullName || '',
      className: rosterData.className || '',
      section: rosterData.section || '',
      rollNumber: rosterData.rollNumber || '',
    },
    report: careerReport,
    dataScope: 'institutional_career_guidance',
  });
}
