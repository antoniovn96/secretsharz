/** Canonical institution + staff membership authority. */

export const INSTITUTION_MEMBERSHIP_STATUS = Object.freeze({ ACTIVE: 'active', ENDED: 'ended', SUSPENDED: 'suspended' });
export const INSTITUTION_STAFF_ROLES = Object.freeze(['institution_admin', 'teacher', 'school_counsellor', 'sen_educator', 'career_counsellor', 'institution_member']);

function active(value) { return String(value || '').toLowerCase() === INSTITUTION_MEMBERSHIP_STATUS.ACTIVE; }

export function normalizeInstitutionMembership(raw = {}) {
  return {
    membershipId: String(raw.membershipId || raw.id || '').trim(),
    institutionId: String(raw.institutionId || '').trim(),
    studentAuthUid: String(raw.studentAuthUid || '').trim(),
    ssStudentId: String(raw.ssStudentId || '').trim(),
    status: String(raw.status || '').toLowerCase(),
    startsAt: raw.startsAt || null,
    endsAt: raw.endsAt || null,
  };
}

export function normalizeInstitutionStaffMembership(raw = {}) {
  return {
    membershipId: String(raw.membershipId || raw.id || '').trim(),
    institutionId: String(raw.institutionId || '').trim(),
    userAuthUid: String(raw.userAuthUid || raw.uid || '').trim(),
    role: String(raw.role || 'institution_member').trim().toLowerCase(),
    status: String(raw.status || '').toLowerCase(),
    startsAt: raw.startsAt || null,
    endsAt: raw.endsAt || null,
  };
}

export function canInstitutionUserAccessStudent({ institutionMembership, staffMembership, institutionId, studentAuthUid, studentId }) {
  const student = normalizeInstitutionMembership(institutionMembership);
  const staff = normalizeInstitutionStaffMembership(staffMembership);
  if (!active(student.status) || !active(staff.status)) return false;
  if (!institutionId || student.institutionId !== institutionId || staff.institutionId !== institutionId) return false;
  if (studentAuthUid && student.studentAuthUid !== studentAuthUid) return false;
  if (studentId && !student.studentAuthUid && student.ssStudentId !== studentId) return false;
  if (!INSTITUTION_STAFF_ROLES.includes(staff.role)) return false;
  return true;
}

export function canInstitutionRelease({ staffMembership, institutionId, targetInstitutionId }) {
  const staff = normalizeInstitutionStaffMembership(staffMembership);
  return active(staff.status) && staff.institutionId === institutionId && institutionId === targetInstitutionId && INSTITUTION_STAFF_ROLES.includes(staff.role);
}
