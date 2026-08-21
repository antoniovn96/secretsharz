import normalizeCanonicalStudent from './canonicalStudentContract.js';

// Canonical presentation helpers for admin student directories.
// Business meaning belongs here rather than in table components so every admin
// surface interprets student state consistently.

export function getStudentId(student = {}) {
  return String(student.ssStudentId || student.studentId || student.id || '').trim();
}

export function getStudentPath(student = {}) {
  const services = student.services || {};
  if (services.career?.status === 'active') return 'career';
  if (services.wellbeing?.status === 'active') return 'wellbeing';
  if (services.sen?.status === 'active') return 'sen';
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
  const code = String(student.assessmentCode || student.riasecCode || student.career?.riasec?.code || student.careerDNA?.riasec?.code || '').trim().toUpperCase();
  return /^[RIASEC]{3,6}$/.test(code) ? code : '';
}

export function getAssessmentStatus(student = {}) {
  if (student.assessmentStatus === 'complete' || student.assessmentStatus === 'pending') return student.assessmentStatus;
  return getAssessmentCode(student) ? 'complete' : 'pending';
}

export function getProfileStatus(student = {}) {
  if (student.profileStatus === 'complete' || student.profileStatus === 'incomplete') return student.profileStatus;
  if (student.onboarding?.profileComplete === true || student.profileComplete === true) return 'complete';
  return 'incomplete';
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

function getCoreProfileState(student = {}) {
  const missing = [];
  if (!String(student.identity?.fullName || student.identity?.preferredName || '').trim()) missing.push('name');
  if (!String(student.contact?.email || '').trim()) missing.push('email');
  if (!String(student.institution?.name || student.academic?.current?.institutionName || '').trim()) missing.push('institution');
  if (!String(student.academic?.current?.grade || '').trim()) missing.push('grade');
  return { status: missing.length ? 'incomplete' : 'complete', missing };
}

export function toAdminStudentDirectoryRecord(raw = {}, id = null) {
  const student = normalizeCanonicalStudent(raw, id || raw.id || raw.uid || null);
  const assessmentCode = getAssessmentCode(student);
  const assessmentStatus = getAssessmentStatus({ ...student, assessmentCode });
  const coreProfile = getCoreProfileState(student);
  const profileStatus = coreProfile.status;
  const assignments = student.relationships?.assignments || {};
  const activeServices = Object.entries(student.services || {})
    .filter(([, value]) => value?.status === 'active')
    .map(([service]) => service);
  const assignmentIds = Object.fromEntries(
    Object.entries(assignments).map(([service, professionalId]) => [service, professionalId || null])
  );
  const assignedService = activeServices.find(service => Boolean(assignmentIds[service]));
  const assignmentStatus = assignedService ? 'assigned' : activeServices.length ? 'unassigned' : 'unassigned';

  const lastActivityMs = [student.governance?.updatedAt, raw.updatedAt, raw.lastActivityAt]
    .map(value => {
      if (typeof value?.toMillis === 'function') return value.toMillis();
      if (typeof value === 'number') return value;
      const parsed = Date.parse(value || '');
      return Number.isNaN(parsed) ? 0 : parsed;
    }).find(Boolean) || 0;

  const createdAtMs = (() => {
    const value = student.governance?.createdAt || raw.createdAt;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    if (typeof value === 'number') return value;
    const parsed = Date.parse(value || '');
    return Number.isNaN(parsed) ? 0 : parsed;
  })();

  return {
    id: student.authUid || student.id || id || '',
    authUid: student.authUid || student.id || id || '',
    ssStudentId: getStudentId(student),
    name: student.identity?.fullName || '',
    preferredName: student.identity?.preferredName || '',
    photoURL: student.identity?.photoURL || '',
    email: student.contact?.email || '',
    institutionId: student.institution?.id || student.academic?.current?.institutionId || '',
    institutionName: student.institution?.name || student.academic?.current?.institutionName || '',
    schoolName: student.institution?.name || student.academic?.current?.institutionName || '',
    academicYear: student.academic?.current?.academicYear || student.institution?.academicYear || '',
    grade: student.academic?.current?.grade || '',
    classLevel: student.academic?.current?.grade || '',
    section: student.academic?.current?.section || '',
    path: getStudentPath(student),
    primary_path: getStudentPath(student),
    studentTrack: getStudentPath(student),
    activeServices,
    services: student.services,
    assessmentCode,
    assessmentStatus,
    riasecCode: assessmentCode,
    riasecScores: student.career?.riasec?.scores || {},
    careerAssessment: raw.careerAssessment || null,
    profileStatus,
    profileMissing: coreProfile.missing,
    profileComplete: profileStatus === 'complete',
    onboardingCompleted: student.onboarding?.completed === true,
    enrollmentStatus: student.institution?.enrollmentStatus || 'active',
    assignmentStatus,
    assignments: assignmentIds,
    assignedCareerCoachId: assignmentIds.career || null,
    assignedCounsellorId: assignmentIds.wellbeing || null,
    assignedSENEducatorId: assignmentIds.sen || null,
    assignedProfessionalId: assignmentIds[assignedService] || null,
    assignedProfessionalName: '',
    createdAt: createdAtMs ? new Date(createdAtMs).toISOString() : null,
    updatedAt: lastActivityMs ? new Date(lastActivityMs).toISOString() : null,
    lastActivityAt: lastActivityMs ? new Date(lastActivityMs).toISOString() : null,
    createdAtMs,
    updatedAtMs: lastActivityMs,
    lastActivityMs,
    needsAttention: getNeedsAttention({ profileStatus, assessmentStatus, assignmentStatus, enrollmentStatus: student.institution?.enrollmentStatus || 'active' }),
  };
}
