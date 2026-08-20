// Canonical presentation helpers for admin student directories.
// Business meaning belongs here rather than in table components so every admin
// surface interprets student state consistently.

export function getStudentId(student = {}) {
  return String(student.ssStudentId || '').trim();
}

export function getStudentPath(student = {}) {
  const value = String(student.path || student.primary_path || student.studentTrack || '').trim().toLowerCase();
  if (value === 'career' || value === 'career_guidance' || value === 'career guidance') return 'career';
  if (value === 'wellbeing' || value === 'psychology' || value === 'counselling' || value === 'counseling') return 'wellbeing';
  if (value === 'sen' || value === 'special_education' || value === 'special education') return 'sen';
  return 'unassigned';
}

export function getAssessmentCode(student = {}) {
  const holland = student.careerAssessment?.hollandCode;
  if (Array.isArray(holland) && holland.length >= 3) {
    const code = holland.slice(0, 3).map(value => String(value).trim().toUpperCase()).join('');
    if (/^[RIASEC]{3}$/.test(code)) return code;
  }
  const code = String(student.assessmentCode || student.riasecCode || student.careerDNA?.riasec?.code || '').trim().toUpperCase();
  return /^[RIASEC]{3,6}$/.test(code) ? code : '';
}

export function getAssessmentStatus(student = {}) {
  if (student.assessmentStatus === 'complete' || student.assessmentStatus === 'pending') return student.assessmentStatus;
  return getAssessmentCode(student) ? 'complete' : 'pending';
}

export function getProfileStatus(student = {}) {
  if (student.profileStatus === 'complete' || student.profileStatus === 'incomplete') return student.profileStatus;
  return student.profileComplete === true ? 'complete' : 'incomplete';
}

export function getNeedsAttention(student = {}) {
  if (typeof student.needsAttention === 'boolean') return student.needsAttention;
  return Boolean(
    getProfileStatus(student) === 'incomplete' ||
    getAssessmentStatus(student) === 'pending' ||
    student.assignmentStatus === 'unassigned' ||
    student.enrollmentStatus === 'inactive'
  );
}

export function getSortValue(student = {}, field) {
  switch (field) {
    case 'institution': return String(student.institutionName || student.schoolName || '').toLowerCase();
    case 'grade': return String(student.grade || '').toLowerCase();
    case 'assessment': return getAssessmentStatus(student);
    case 'profile': return getProfileStatus(student);
    case 'lastActivity': return Number(student.lastActivityMs || student.updatedAtMs || student.createdAtMs || 0);
    case 'name':
    default: return String(student.name || student.preferredName || '').toLowerCase();
  }
}
