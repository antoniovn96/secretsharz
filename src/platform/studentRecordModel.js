// Canonical student discovery rules shared by admin-facing data flows.
// A student is not identified only by the legacy `role` field: newer profiles
// may use profileType and career assessment data without a student role.

const NON_STUDENT_ROLES = new Set([
  'super_admin',
  'admin',
  'parent',
  'counsellor',
  'psychologist',
  'educator',
  'mentor',
  'employer',
  'professional',
]);

export function isStudentProfile(data = {}) {
  const role = String(data.role || '').trim().toLowerCase();
  const profileType = String(data.profileType || '').trim().toLowerCase();

  if (NON_STUDENT_ROLES.has(role)) return false;
  if (profileType === 'student') return true;
  if (role === 'student') return true;

  // Legacy / career users may not have been assigned a role or profileType.
  if (data.careerAssessment && typeof data.careerAssessment === 'object') return true;
  if (data.careerDNA?.riasec) return true;
  if (data.riasecCode) return true;
  if (data.primary_path || data.studentTrack) return true;
  if (data.grade || data.gradeOrCourse || data.schoolName) return true;

  return false;
}

export function getStudentPath(data = {}) {
  const raw = data.primary_path || data.studentTrack || '';
  const path = String(raw).trim().toLowerCase();
  if (path === 'career') return 'Career';
  if (path === 'sen') return 'SEN';
  if (path === 'wellbeing') return 'Wellbeing';
  return 'Unassigned';
}
