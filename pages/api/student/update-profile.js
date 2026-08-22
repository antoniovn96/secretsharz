import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { mergeCanonicalStudentProfile } from '../../../src/platform/studentProfileWriteAdapter.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isAdminLike(decoded) {
  return decoded?.role === 'super_admin' || decoded?.role === 'admin';
}

function looksLikeStudent(raw = {}) {
  return raw.role === 'student' || raw.profileType === 'student' || Boolean(raw.studentProfile?.identity) || Boolean(raw.grade || raw.gradeOrCourse || raw.schoolName || raw.studentId);
}

const GOVERNANCE_FIELDS = new Set([
  'fatherName', 'fatherEmail', 'fatherPhone',
  'motherName', 'motherEmail', 'motherPhone',
  'counsellingConsentAgreed',
  'studentTrack',
]);

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    res.setHeader('Allow', 'PATCH, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[student-update-profile] token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const requestedStudentId = String(req.body?.studentId || '').trim();
  const studentId = requestedStudentId || decoded.uid;
  if (studentId !== decoded.uid && !isAdminLike(decoded)) {
    return res.status(403).json({ error: 'You may only update your own student profile.' });
  }

  const submittedProfile = req.body?.profile && typeof req.body.profile === 'object' ? req.body.profile : {};
  const submittedGovernanceFields = Object.keys(submittedProfile).filter((key) => GOVERNANCE_FIELDS.has(key));
  if (submittedGovernanceFields.length > 0) {
    return res.status(400).json({
      error: 'Governance, guardian relationships, consent and service activation must use their dedicated backend workflows.',
      fields: submittedGovernanceFields,
    });
  }

  if (Object.prototype.hasOwnProperty.call(submittedProfile, 'family') || Object.prototype.hasOwnProperty.call(submittedProfile, 'governance') || Object.prototype.hasOwnProperty.call(submittedProfile, 'services')) {
    return res.status(400).json({
      error: 'Family relationships, consent and service memberships cannot be changed through the profile editor.',
    });
  }

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student profile not found.' });

    const rawStudent = { id: snapshot.id, ...snapshot.data() };
    if (!looksLikeStudent(rawStudent)) return res.status(403).json({ error: 'Target account is not a student profile.' });

    const existing = rawStudent.studentProfile || normalizeStudentRecord(rawStudent, studentId);
    const nextProfile = mergeCanonicalStudentProfile({ ...existing, id: studentId }, submittedProfile);

    // Deliberately preserve platform-governed sections. The profile editor is
    // not an authorization, consent, relationship, or service-membership API.
    nextProfile.family = existing.family || {};
    nextProfile.governance = existing.governance || {};
    nextProfile.services = existing.services || {};

    await ref.set({
      studentProfile: nextProfile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return res.status(200).json({ ok: true, studentId, studentProfile: nextProfile });
  } catch (error) {
    console.error('[student-update-profile] update failed:', error);
    return res.status(500).json({ error: 'Unable to update the student profile.' });
  }
}
