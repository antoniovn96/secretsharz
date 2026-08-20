import normalizeStudentRecord from './studentRecordNormalizer.js';

/**
 * Compatibility normalizer for specialist APIs that need the canonical
 * person-centric student contract plus a few legacy identity aliases.
 */
export function normalizeCanonicalStudent(raw = {}, id = null) {
  const source = raw.studentProfile && typeof raw.studentProfile === 'object'
    ? { ...raw, ...raw.studentProfile }
    : raw;
  const profile = normalizeStudentRecord(source, id || source.id || source.uid || null);
  const authUid = source.authUid || source.uid || source.userId || profile.id || null;
  const ssStudentId = source.ssStudentId || source.studentId || source.student_id || profile.id || null;
  const existingMemberships = Array.isArray(source.institutionMemberships) ? source.institutionMemberships : [];
  const institutionMemberships = existingMemberships.length > 0
    ? existingMemberships
    : profile.institution?.id || profile.institution?.name
      ? [{
          institutionId: profile.institution.id || null,
          institutionName: profile.institution.name || '',
          status: profile.institution.enrollmentStatus || 'active',
        }]
      : [];

  return {
    ...profile,
    authUid,
    ssStudentId,
    identity: {
      ...profile.identity,
      legalName: profile.identity.fullName || '',
    },
    institutionMemberships,
  };
}

export default normalizeCanonicalStudent;
