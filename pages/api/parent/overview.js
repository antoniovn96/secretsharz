import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveStudentProfile } from '../../../src/platform/studentProfileResolver.js';
import { hasActiveRelationship } from '../../../src/security/relationshipStore.js';
import { careerRoadmapShareId, SHARED_INFORMATION_AUDIENCES, SHARED_INFORMATION_STATUS } from '../../../src/platform/sharedInformation.js';

function bearerToken(req) { const header = req.headers.authorization || req.headers.Authorization; if (typeof header !== 'string') return null; const match = header.match(/^Bearer\s+(.+)$/i); return match ? match[1] : null; }
function clean(value, max = 180) { return String(value || '').trim().slice(0, max); }
function relationshipLabel(value) { return ({ father: 'Father', mother: 'Mother', guardian: 'Guardian' })[value] || 'Guardian'; }

async function latestReleasedCareer(db, childId) {
  const sharedSnap = await db.collection('sharedInformation').doc(careerRoadmapShareId(childId)).get();
  if (!sharedSnap.exists) return null;
  const shared = sharedSnap.data() || {};
  const audiences = Array.isArray(shared.audiences) ? shared.audiences : [];
  if (shared.status !== SHARED_INFORMATION_STATUS.ACTIVE || !audiences.includes(SHARED_INFORMATION_AUDIENCES.PARENT)) return null;
  return shared.data || null;
}

function activeServices(profile) {
  const services = profile?.services || {};
  return {
    career: services.career?.status === 'active',
    wellbeing: services.wellbeing?.status === 'active',
    sen: services.sen?.status === 'active',
  };
}

function sanitizeChild(profile, id, careerReport, relationship) {
  const services = activeServices(profile);
  const careerDNA = profile.career?.profile?.riasec || profile.career?.riasec || {};
  return {
    id,
    name: clean(profile.identity?.fullName || 'Your child'),
    classLevel: clean(profile.academic?.current?.grade || ''),
    section: clean(profile.academic?.current?.section || ''),
    guardianRelationship: relationshipLabel(relationship),
    services,
    career: services.career ? {
      released: Boolean(careerReport),
      hollandCode: clean(careerReport?.riasecCode || careerDNA.code || ''),
      roadmapSummary: clean(careerReport?.phases?.phase2_explore || careerReport?.summary || '', 1200),
    } : null,
    sen: services.sen ? { released: false, goals: [], accommodations: [] } : null,
    wellbeing: services.wellbeing ? { released: false, specialistDetailsHidden: true } : null,
  };
}

async function canonicalGuardianRelationship(db, parentUid, childId) {
  const guardian = await hasActiveRelationship({
    db,
    subjectPersonId: childId,
    relatedPersonId: parentUid,
    types: ['guardian', 'parent'],
    domain: null,
  });
  return guardian;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); } catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  if (decoded.role !== 'parent') return res.status(403).json({ error: 'Parent access required.' });

  const db = getAdminFirestore();
  const parentSnap = await db.collection('users').doc(decoded.uid).get();
  if (!parentSnap.exists) return res.status(404).json({ error: 'Parent profile not found.' });
  const parent = parentSnap.data() || {};
  if (parent.role !== 'parent') return res.status(403).json({ error: 'Parent access required.' });

  // linkedStudentIds is now a migration-only compatibility projection. It is
  // never sufficient to authorize a child. Canonical guardian/parent
  // relationships are the authority.
  const legacyCandidateIds = Array.isArray(parent.linkedStudentIds) ? parent.linkedStudentIds : [];
  const children = [];

  for (const childId of [...new Set(legacyCandidateIds.filter(Boolean))]) {
    const authorized = await canonicalGuardianRelationship(db, decoded.uid, childId);
    if (!authorized) continue;

    const childSnap = await db.collection('students').doc(childId).get();
    const fallbackSnap = childSnap.exists ? null : await db.collection('users').doc(childId).get();
    const resolvedSnap = childSnap.exists ? childSnap : fallbackSnap;
    if (!resolvedSnap?.exists) continue;
    const child = resolvedSnap.data() || {};

    const resolved = resolveStudentProfile(child, { role: 'parent', uid: decoded.uid, relationshipAuthorized: true });
    if (!resolved.allowed) continue;

    const relationship = resolved.profile.family?.guardians?.find((guardian) => guardian.accountId === decoded.uid)?.relationship
      || parent.childRelationships?.[childId]
      || 'guardian';
    const services = activeServices(resolved.profile);
    let careerReport = null;
    if (services.career) {
      try { careerReport = await latestReleasedCareer(db, childId); } catch (error) { console.error('[parent/overview] Career release lookup failed:', error?.message || error); }
    }

    children.push(sanitizeChild(resolved.profile, childId, careerReport, relationship));
  }

  return res.status(200).json({
    success: true,
    parent: {
      uid: decoded.uid,
      name: clean(parent.name || decoded.name || 'Parent'),
      email: clean(parent.email || decoded.email || '', 254),
      relationship: relationshipLabel(parent.parentRelationship),
      institutionId: parent.institutionId || null,
      institutionName: clean(parent.institutionName || ''),
    },
    children,
  });
}
