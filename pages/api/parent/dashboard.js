import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeStudent(id, data, parentUid) {
  const guardianRelationships = data.guardianRelationships && typeof data.guardianRelationships === 'object'
    ? data.guardianRelationships
    : {};
  if (!Object.prototype.hasOwnProperty.call(guardianRelationships, parentUid)) return null;

  const career = data.careerAssessmentV2 || data.careerAssessment || {};
  const riasecCode = data.riasecCode || career.hollandCode?.join?.('') || career.riasecCode || null;

  return {
    uid: id,
    name: data.name || data.studentName || data.profile?.name || 'Student',
    grade: data.grade || data.class || data.school?.grade || '',
    section: data.section || '',
    institutionId: data.institutionId || null,
    institutionName: data.institutionName || data.schoolName || data.school?.name || '',
    relationship: guardianRelationships[parentUid],
    services: Array.isArray(data.services) ? data.services : [],
    primaryPath: data.primary_path || data.path || null,
    assessmentCompleted: Boolean(data.assessmentCompletedAt || data.careerAssessmentV2 || data.riasecCode),
    assessmentCompletedAt: data.assessmentCompletedAt || career.completedAt || null,
    riasecCode,
    riasecScores: data.riasecScores || career.riasecScores || career.scores?.riasec || null,
    careerExploration: Array.isArray(career.careerExploration) ? career.careerExploration.slice(0, 5).map(item => ({
      id: item.id || null,
      name: item.name || item.title || '',
      category: item.category || '',
      explorationIndex: Number(item.explorationIndex || item.matchScore || 0),
    })) : [],
    profileCompletion: Number(data.profileCompletion || 0),
    status: data.status || 'active',
    updatedAt: data.updatedAt || data.lastUpdatedAt || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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

  if (decoded.role !== 'parent') {
    return res.status(403).json({ error: 'Parent access required.' });
  }

  try {
    const db = getAdminFirestore();
    const parentSnap = await db.collection('users').doc(decoded.uid).get();
    if (!parentSnap.exists || parentSnap.data()?.role !== 'parent') {
      return res.status(404).json({ error: 'Parent profile not found.' });
    }

    const parent = parentSnap.data() || {};
    const linkedStudentIds = Array.isArray(parent.linkedStudentIds) ? Array.from(new Set(parent.linkedStudentIds.filter(Boolean))) : [];
    const students = [];

    for (const studentId of linkedStudentIds) {
      const studentSnap = await db.collection('users').doc(studentId).get();
      if (!studentSnap.exists) continue;
      const student = safeStudent(studentId, studentSnap.data() || {}, decoded.uid);
      if (student) students.push(student);
    }

    return res.status(200).json({
      parent: {
        uid: decoded.uid,
        name: parent.name || decoded.name || '',
        email: parent.email || decoded.email || '',
        relationship: parent.parentRelationship || 'guardian',
        institutionIds: Array.isArray(parent.institutionIds) ? parent.institutionIds : [],
        institutionNames: parent.institutionNames || {},
      },
      students,
      summary: {
        children: students.length,
        assessmentsCompleted: students.filter(student => student.assessmentCompleted).length,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[parent dashboard] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load the parent dashboard.' });
  }
}
