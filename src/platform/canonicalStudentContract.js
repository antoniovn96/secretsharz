/**
 * Canonical Student Integration Contract
 *
 * Identity rule:
 * - authUid: internal Firebase Auth identity
 * - ssStudentId: external/domain-facing Secret Sharz Student ID
 *
 * This module is deliberately a NORMALIZER/CONTRACT only. It does not grant
 * access. Server/API authorization remains authoritative for cross-user data.
 */

export const CANONICAL_STUDENT_VERSION = '1.0.0';

const asString = (value) => (value == null ? '' : String(value).trim());

const normalizePhone = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'string') return { number: raw.trim(), countryCode: '' };
  return {
    number: asString(raw.number),
    countryCode: asString(raw.countryCode || raw.country || ''),
  };
};

const normalizeInstitutionMemberships = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((membership) => ({
      membershipId: asString(membership.membershipId || membership.id),
      institutionId: asString(membership.institutionId),
      institutionName: asString(membership.institutionName || membership.name),
      status: asString(membership.status || 'active'),
      joinedAt: membership.joinedAt || null,
      leftAt: membership.leftAt || null,
    }));
};

const normalizeGuardians = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((guardian) => ({
      relationshipId: asString(guardian.relationshipId || guardian.id),
      guardianUid: asString(guardian.guardianUid || guardian.uid || guardian.userId),
      relationship: asString(guardian.relationship),
      status: asString(guardian.status || 'active'),
    }));
};

export function normalizeCanonicalStudent(raw = {}, authUid = '') {
  const identity = raw.identity || {};
  const academic = raw.academic || {};
  const currentAcademic = academic.current || {};

  const resolvedAuthUid = asString(
    authUid || raw.authUid || raw.uid || raw.userId || ''
  );

  const resolvedSsStudentId = asString(
    raw.ssStudentId || identity.ssStudentId || raw.studentId || ''
  );

  return {
    contractVersion: CANONICAL_STUDENT_VERSION,
    authUid: resolvedAuthUid,
    ssStudentId: resolvedSsStudentId,
    identity: {
      legalName: asString(identity.legalName || raw.legalName || raw.name),
      preferredName: asString(identity.preferredName || raw.preferredName),
      phone: normalizePhone(identity.phone || raw.phone),
    },
    academic: {
      current: {
        grade: asString(currentAcademic.grade || raw.grade),
        section: asString(currentAcademic.section || raw.section),
        academicYear: asString(currentAcademic.academicYear || raw.academicYear),
      },
    },
    institutionMemberships: normalizeInstitutionMemberships(
      raw.institutionMemberships || raw.institutions
    ),
    guardians: normalizeGuardians(raw.guardians || raw.guardianRelationships),
  };
}

export function assertCanonicalStudentIdentity(student) {
  if (!student?.authUid) throw new Error('Canonical student authUid is required');
  if (!student?.ssStudentId) throw new Error('Canonical SS Student ID is required');
  return true;
}

export function getActiveInstitutionMemberships(student) {
  return (student?.institutionMemberships || []).filter(
    (membership) => membership.status === 'active'
  );
}

export function getHistoricalInstitutionMemberships(student) {
  return (student?.institutionMemberships || []).filter(
    (membership) => membership.status === 'historical' || membership.status === 'inactive'
  );
}
