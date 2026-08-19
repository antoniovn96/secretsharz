import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { SHARED_INFORMATION_AUDIENCES, SHARED_INFORMATION_STATUS } from '../../../src/platform/sharedInformation.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 180) {
  return String(value || '').trim().slice(0, max);
}

function isCoordinator(decoded, institutionId) {
  return decoded.role === 'institution_member'
    && decoded.institutionRole === 'coordinator'
    && decoded.institutionId === institutionId;
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

  const institutionId = clean(req.query?.institutionId || decoded.institutionId, 120);
  if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });

  const isFounder = decoded.email_verified === true
    && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  if (!isFounder && !isCoordinator(decoded, institutionId)) {
    return res.status(403).json({ error: 'Institution coordinator access required.' });
  }

  const db = getAdminFirestore();
  const institutionRef = db.collection('institutions').doc(institutionId);
  const institutionSnap = await institutionRef.get();
  if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });

  const institution = institutionSnap.data() || {};
  if (!isFounder && institution.status !== 'active') {
    return res.status(403).json({ error: 'Institution programme is not active.' });
  }

  // Query only by institutionId so the endpoint does not depend on a new
  // composite Firestore index. shareType/status/audience are security filters.
  const [sharedSnap, rosterSnap] = await Promise.all([
    db.collection('sharedInformation')
      .where('institutionId', '==', institutionId)
      .limit(2000)
      .get(),
    institutionRef.collection('roster').limit(2000).get(),
  ]);

  const rosterByStudentId = new Map();
  rosterSnap.docs.forEach((doc) => {
    const record = doc.data() || {};
    if (record.claimedBy) rosterByStudentId.set(String(record.claimedBy), {
      rosterId: doc.id,
      fullName: clean(record.fullName),
      className: clean(record.className, 80),
      section: clean(record.section, 40),
      rollNumber: clean(record.rollNumber, 50),
      assessmentStatus: clean(record.assessmentStatus, 50),
    });
  });

  const roadmaps = sharedSnap.docs
    .map((doc) => doc.data() || {})
    .filter((share) => (
      share.status === SHARED_INFORMATION_STATUS.ACTIVE
      && share.shareType === 'CAREER_ROADMAP_SUMMARY'
      && Array.isArray(share.audiences)
      && share.audiences.includes(SHARED_INFORMATION_AUDIENCES.INSTITUTION)
      && share.institutionId === institutionId
      && rosterByStudentId.has(String(share.studentId || ''))
    ))
    .map((share) => {
      const studentId = String(share.studentId);
      const roster = rosterByStudentId.get(studentId);
      const phases = share.data?.phases && typeof share.data.phases === 'object' ? share.data.phases : {};
      return {
        studentId,
        rosterId: roster.rosterId,
        fullName: roster.fullName,
        className: roster.className,
        section: roster.section,
        rollNumber: roster.rollNumber,
        assessmentStatus: roster.assessmentStatus,
        sourceRecordId: share.sourceRecordId || null,
        publishedAt: share.updatedAt || share.createdAt || null,
        summary: clean(share.data?.summary, 1200),
        phases: {
          phase1_unlock: clean(phases.phase1_unlock, 5000),
          phase2_explore: clean(phases.phase2_explore, 5000),
          phase3_expand: clean(phases.phase3_expand, 5000),
          phase4_inspire: clean(phases.phase4_inspire, 5000),
          phase5_ignite: clean(phases.phase5_ignite, 5000),
        },
      };
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  return res.status(200).json({
    success: true,
    institution: {
      id: institutionId,
      name: clean(institution.name),
      tenantCode: clean(institution.tenantCode, 30),
    },
    summary: {
      publishedRoadmaps: roadmaps.length,
      studentsWithRoadmaps: roadmaps.length,
    },
    roadmaps,
  });
}
