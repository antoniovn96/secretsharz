import { createRelationship, getActiveRelationship } from './relationshipStore.js';

export const INSTITUTION_MEMBERSHIP_STATUS = Object.freeze({ ACTIVE: 'active', ENDED: 'ended', SUSPENDED: 'suspended' });
export const INSTITUTION_RELATIONSHIP_TYPE = 'institution_member';
export const INSTITUTION_DOMAIN = 'institution';

export function normalizeInstitutionMembership(raw = {}) {
  return {
    relationshipId: String(raw.relationshipId || raw.id || '').trim(),
    studentAuthUid: String(raw.subjectPersonId || raw.studentAuthUid || '').trim(),
    institutionUserUid: String(raw.relatedPersonId || raw.institutionUserUid || '').trim(),
    institutionId: String(raw.institutionId || raw.metadata?.institutionId || '').trim(),
    role: String(raw.role || raw.metadata?.role || 'member').trim(),
    status: String(raw.status || '').toLowerCase(),
    startsAt: raw.startsAt || null,
    endsAt: raw.endsAt || null,
  };
}

export function isActiveInstitutionMembership(raw) {
  return normalizeInstitutionMembership(raw).status === INSTITUTION_MEMBERSHIP_STATUS.ACTIVE;
}

export async function getActiveInstitutionMembership({ db, studentAuthUid, institutionUserUid, institutionId }) {
  if (!db || !studentAuthUid || !institutionUserUid) return null;
  const relationship = await getActiveRelationship({
    db,
    subjectPersonId: studentAuthUid,
    relatedPersonId: institutionUserUid,
    type: INSTITUTION_RELATIONSHIP_TYPE,
    domain: INSTITUTION_DOMAIN,
  });
  if (!relationship) return null;
  const normalized = normalizeInstitutionMembership(relationship);
  if (institutionId && normalized.institutionId !== String(institutionId)) return null;
  return normalized;
}

export async function createInstitutionMembership({ db, studentAuthUid, institutionUserUid, institutionId, role = 'member', startsAt = new Date().toISOString(), metadata = {} }) {
  if (!institutionId) throw new Error('institutionId is required.');
  if (!studentAuthUid || !institutionUserUid) throw new Error('Student and institution user IDs are required.');
  return createRelationship({
    db,
    subjectPersonId: studentAuthUid,
    relatedPersonId: institutionUserUid,
    type: INSTITUTION_RELATIONSHIP_TYPE,
    domain: INSTITUTION_DOMAIN,
    status: INSTITUTION_MEMBERSHIP_STATUS.ACTIVE,
    startsAt,
    endsAt: null,
    consentRequired: true,
    metadata: { ...metadata, institutionId, role },
  });
}

export async function listActiveInstitutionStudents({ db, institutionId, institutionUserUid = null, limit = 100 }) {
  if (!db || !institutionId) return [];
  let query = db.collection('relationships')
    .where('type', '==', INSTITUTION_RELATIONSHIP_TYPE)
    .where('domain', '==', INSTITUTION_DOMAIN)
    .where('status', '==', INSTITUTION_MEMBERSHIP_STATUS.ACTIVE)
    .where('metadata.institutionId', '==', String(institutionId))
    .limit(Math.min(Number(limit) || 100, 200));
  if (institutionUserUid) query = query.where('relatedPersonId', '==', institutionUserUid);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => normalizeInstitutionMembership({ id: doc.id, ...doc.data() }));
}
