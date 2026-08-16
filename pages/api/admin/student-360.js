// Secret Sharz — Sanitised Student 360 read API
//
// Student 360 must never read the raw users/{uid} document from the browser.
// This endpoint deliberately returns continuity/administrative metadata only.
// Specialist notes, safeguarding content and other domain records are excluded.
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isPrivilegedAdmin(decodedToken) {
  return decodedToken?.email_verified === true && decodedToken?.email === 'antonio.antonio.noronha@gmail.com'
    || decodedToken?.role === 'super_admin';
}

function toIso(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (typeof value.toMillis === 'function') return new Date(value.toMillis()).toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function sanitiseStudent(snapshot) {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    name: data.name || data.fullName || '',
    email: data.email || '',
    photoURL: data.photoURL || data.photoUrl || data.profilePicture || '',
    age: data.age ?? null,
    grade: data.grade || data.gradeOrCourse || '',
    schoolName: data.schoolName || '',
    institutionName: data.institutionName || '',
    primary_path: getStudentPath(data) || data.primary_path || '',
    primaryJourneyDecisionAt: toIso(data.primaryJourneyDecisionAt),
    profileComplete: data.profileComplete === true,
    onboardingCompleted: data.onboardingCompleted === true,
    parentId: data.parentId || '',
    parentName: data.parentName || '',
    assignedCounsellorId: data.assignedCounsellorId || '',
    sessionsAttended: Number(data.sessionsAttended || 0),
    assessmentsCompleted: Number(data.assessmentsCompleted || 0),
    riasecCode: data.riasecCode || data.careerDNA?.riasec?.code || '',
    xp: Number(data.xp || data.exPoints || 0),
    serviceMemberships: Array.isArray(data.serviceMemberships)
      ? data.serviceMemberships.map(item => typeof item === 'string' ? item : item?.service).filter(Boolean)
      : [],
    goals: Array.isArray(data.goals)
      ? data.goals.map(goal => ({ id: goal?.id || null, title: goal?.title || goal?.name || '' })).filter(goal => goal.title)
      : [],
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function sanitiseEvent(snapshot) {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    eventType: data.eventType || 'PRIMARY_JOURNEY_CHANGED',
    previousPath: data.previousPath || null,
    nextPath: data.nextPath || null,
    reason: data.reason || '',
    actorEmail: data.actorEmail || null,
    source: data.source || 'ADMIN_STUDENT_360',
    createdAt: toIso(data.createdAt),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  if (!isPrivilegedAdmin(decodedToken)) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentUid = typeof req.query?.id === 'string' ? req.query.id.trim() : '';
  if (!studentUid || studentUid.length > 128) return res.status(400).json({ error: 'A valid student id is required.' });

  try {
    const db = getAdminFirestore();
    const studentRef = db.collection('users').doc(studentUid);
    const studentSnapshot = await studentRef.get();
    if (!studentSnapshot.exists || !isStudentProfile(studentSnapshot.data() || {})) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    const historySnapshot = await studentRef.collection('decisionHistory').orderBy('createdAt', 'desc').limit(50).get();
    const decisionHistory = historySnapshot.docs.map(sanitiseEvent);

    return res.status(200).json({
      student: sanitiseStudent(studentSnapshot),
      decisionHistory,
    });
  } catch (error) {
    console.error('[admin student 360] failed:', error);
    return res.status(500).json({ error: 'Unable to load the Student 360 record.' });
  }
}
