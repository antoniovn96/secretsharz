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
  const profile = data.studentProfile && typeof data.studentProfile === 'object'
    ? { ...data, ...data.studentProfile }
    : data;

  const role = String(profile.role || '').trim().toLowerCase();
  const profileType = String(profile.profileType || '').trim().toLowerCase();

  if (NON_STUDENT_ROLES.has(role)) return false;
  if (profileType === 'student') return true;
  if (role === 'student') return true;

  // Legacy / career users may not have been assigned a role or profileType.
  if (profile.careerAssessment && typeof profile.careerAssessment === 'object') return true;
  if (profile.careerDNA?.riasec) return true;
  if (profile.career?.riasec && typeof profile.career.riasec === 'object') return true;
  if (profile.riasecCode) return true;
  if (profile.primary_path || profile.studentTrack) return true;
  if (profile.grade || profile.gradeOrCourse || profile.schoolName) return true;

  return false;
}

export function getStudentPath(data = {}) {
  const profile = data.studentProfile && typeof data.studentProfile === 'object'
    ? { ...data, ...data.studentProfile }
    : data;
  const raw = profile.primary_path || profile.studentTrack || profile.career?.path || '';
  const path = String(raw).trim().toLowerCase();
  if (path === 'career' || path === 'career_guidance' || path === 'career guidance') return 'Career';
  if (path === 'sen' || path === 'special_education' || path === 'special education') return 'SEN';
  if (path === 'wellbeing' || path === 'psychology' || path === 'psychologist' || path === 'counselling' || path === 'counseling') return 'Wellbeing';
  return 'Unassigned';
}
