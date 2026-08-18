import { normaliseStudentRecord } from './studentRecordNormalizer.js';

export const ONBOARDING_STATES = Object.freeze({
  NEW: 'new',
  MIGRATE: 'migrate',
  RESUME: 'resume',
  COMPLETE: 'complete',
});

function hasMeaningful(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function hasLegacyStudentSignals(raw = {}) {
  return Boolean(
    raw.profileType === 'student' ||
    raw.role === 'student' ||
    raw.name ||
    raw.fullName ||
    raw.studentId ||
    raw.grade ||
    raw.gradeOrCourse ||
    raw.schoolName ||
    raw.institutionId ||
    raw.parentUid ||
    raw.parentId ||
    raw.primary_path ||
    raw.studentTrack ||
    raw.careerAssessment ||
    raw.careerDNA ||
    raw.riasecCode ||
    raw.riasecScores
  );
}

function missingCoreFields(profile = {}) {
  const identity = profile.identity || {};
  const contact = profile.contact || {};
  const academic = profile.academic || {};
  const missing = [];

  if (!hasMeaningful(identity.fullName)) missing.push('identity.fullName');
  if (!hasMeaningful(identity.dateOfBirth)) missing.push('identity.dateOfBirth');
  if (!hasMeaningful(contact.email)) missing.push('contact.email');
  if (!hasMeaningful(contact.mobile?.number)) missing.push('contact.mobile.number');
  if (!hasMeaningful(academic.grade)) missing.push('academic.grade');

  return missing;
}

export function getOnboardingState(rawStudent = null) {
  if (!rawStudent) {
    return {
      state: ONBOARDING_STATES.NEW,
      needsMigration: false,
      missingCoreFields: [],
      hasExistingRecord: false,
    };
  }

  const profile = rawStudent.studentProfile || normaliseStudentRecord(rawStudent);
  const missing = missingCoreFields(profile);
  const completed = rawStudent.onboardingCompleted === true || profile.onboarding?.completed === true;
  const legacy = hasLegacyStudentSignals(rawStudent);

  if (completed && missing.length === 0) {
    return {
      state: ONBOARDING_STATES.COMPLETE,
      needsMigration: legacy && !rawStudent.studentProfile,
      missingCoreFields: [],
      hasExistingRecord: true,
    };
  }

  if (legacy) {
    return {
      state: ONBOARDING_STATES.MIGRATE,
      needsMigration: true,
      missingCoreFields: missing,
      hasExistingRecord: true,
    };
  }

  return {
    state: ONBOARDING_STATES.RESUME,
    needsMigration: false,
    missingCoreFields: missing,
    hasExistingRecord: true,
  };
}

export function getOnboardingRoute({ rawStudent = null, isInstitutionProvisioned = false } = {}) {
  const result = getOnboardingState(rawStudent);

  if (result.state === ONBOARDING_STATES.COMPLETE) return { ...result, route: 'dashboard' };
  if (result.state === ONBOARDING_STATES.MIGRATE) return { ...result, route: 'student-onboarding', mode: 'migration' };
  if (result.state === ONBOARDING_STATES.RESUME) return { ...result, route: 'student-onboarding', mode: 'resume' };

  return {
    ...result,
    route: 'student-onboarding',
    mode: isInstitutionProvisioned ? 'institution-provisioned' : 'new',
  };
}

export function isProfessionalSelfSignupAllowed() {
  return false;
}

export default getOnboardingRoute;
