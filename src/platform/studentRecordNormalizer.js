import { getStudentPath } from './studentRecordModel.js';

const SERVICE_KEYS = ['career', 'wellbeing', 'sen'];

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

function normalisePath(data = {}) {
  const raw = String(firstDefined(data.primary_path, data.studentTrack, data.path, data.service, '')).trim().toLowerCase();
  if (raw === 'psychology' || raw === 'psychologist' || raw === 'counselling' || raw === 'counseling') return 'wellbeing';
  if (raw === 'special_education' || raw === 'special education' || raw === 'educator') return 'sen';
  if (raw === 'career_guidance' || raw === 'career guidance') return 'career';
  return SERVICE_KEYS.includes(raw) ? raw : getStudentPath(data);
}

function normaliseGuardian(data = {}) {
  const guardians = [];
  const existing = asArray(data.family?.guardians || data.guardians || data.parents);
  existing.forEach((guardian) => {
    if (!guardian || typeof guardian !== 'object') return;
    guardians.push({
      accountId: firstDefined(guardian.accountId, guardian.uid, guardian.id, null),
      relationship: firstDefined(guardian.relationship, guardian.parentType, guardian.relation, 'guardian'),
      name: firstDefined(guardian.name, guardian.fullName, ''),
      email: firstDefined(guardian.email, ''),
      phone: firstDefined(guardian.phone, guardian.contactNumber, guardian.parentContact, ''),
      countryCode: firstDefined(guardian.countryCode, guardian.contactCountryCode, null),
      invitationStatus: firstDefined(guardian.invitationStatus, guardian.accountStatus, null),
      consentStatus: firstDefined(guardian.consentStatus, null),
    });
  });

  const legacyAccountId = firstDefined(data.parentUid, data.parentId, data.parent?.uid, null);
  const legacyName = firstDefined(data.parentName, data.parent?.name, '');
  const legacyPhone = firstDefined(data.parentContact, data.parent?.phone, '');
  const legacyEmail = firstDefined(data.parentEmail, data.parent?.email, '');

  if (legacyAccountId || legacyName || legacyPhone || legacyEmail) {
    const exists = guardians.some((guardian) => guardian.accountId === legacyAccountId && guardian.name === legacyName);
    if (!exists) {
      guardians.push({
        accountId: legacyAccountId,
        relationship: firstDefined(data.parentRelationship, 'guardian'),
        name: legacyName,
        email: legacyEmail,
        phone: legacyPhone,
        countryCode: firstDefined(data.contactCountryCode, null),
        invitationStatus: null,
        consentStatus: null,
      });
    }
  }

  return guardians;
}

function normaliseAssignments(data = {}) {
  const staff = data.assignedStaff || {};
  return {
    career: firstDefined(staff.careerId, data.assignedCareerCounsellorId, data.assignedCounsellorId, data.assignedProfessionalId, null),
    wellbeing: firstDefined(staff.psychologistId, staff.psychologyId, data.assignedPsychologistId, null),
    sen: firstDefined(staff.senId, staff.educatorId, data.assignedSENEducatorId, null),
  };
}

function normaliseServices(data = {}) {
  const services = {};
  const existing = data.services || {};
  const activePath = normalisePath(data);

  SERVICE_KEYS.forEach((service) => {
    const current = existing[service];
    const explicit = current && typeof current === 'object' ? current : {};
    const active = explicit.status === 'active' || explicit.active === true || service === activePath;
    services[service] = {
      status: active ? 'active' : firstDefined(explicit.status, 'inactive'),
      enrolledAt: firstDefined(explicit.enrolledAt, data.serviceEnrollment?.[service]?.enrolledAt, null),
      source: firstDefined(explicit.source, data.serviceEnrollment?.[service]?.source, null),
      consentStatus: firstDefined(explicit.consentStatus, data.serviceEnrollment?.[service]?.consentStatus, null),
    };
  });

  return services;
}

export function normalizeStudentRecord(data = {}, id = null) {
  const guardians = normaliseGuardian(data);
  const assignments = normaliseAssignments(data);
  const path = normalisePath(data);
  const services = normaliseServices(data);
  const dob = firstDefined(data.identity?.dateOfBirth, data.dob, data.dateOfBirth, null);

  return {
    schemaVersion: 1,
    id,
    identity: {
      fullName: firstDefined(data.identity?.fullName, data.name, data.fullName, ''),
      preferredName: firstDefined(data.identity?.preferredName, data.preferredName, ''),
      photoURL: firstDefined(data.identity?.photoURL, data.photoURL, ''),
      dateOfBirth: dob,
      gender: firstDefined(data.identity?.gender, data.gender, ''),
      pronouns: firstDefined(data.identity?.pronouns, data.pronouns, ''),
      country: firstDefined(data.identity?.country, data.country, 'India'),
      city: firstDefined(data.identity?.city, data.city, ''),
    },
    contact: {
      email: firstDefined(data.contact?.email, data.email, ''),
      mobile: {
        countryCode: firstDefined(data.contact?.mobile?.countryCode, data.contactCountryCode, null),
        number: firstDefined(data.contact?.mobile?.number, data.contactNumber, data.phone, ''),
      },
    },
    family: { guardians },
    institution: {
      id: firstDefined(data.institution?.id, data.institutionId, data.institutionID, ''),
      name: firstDefined(data.institution?.name, data.institutionName, data.schoolName, ''),
      academicYear: firstDefined(data.institution?.academicYear, data.academicYear, ''),
      enrollmentStatus: firstDefined(data.institution?.enrollmentStatus, data.enrollmentStatus, null),
    },
    academic: {
      grade: firstDefined(data.academic?.grade, data.grade, data.gradeOrCourse, ''),
      section: firstDefined(data.academic?.section, data.section, ''),
      curriculum: firstDefined(data.academic?.curriculum, data.curriculum, data.board, ''),
      stream: firstDefined(data.academic?.stream, data.stream1112, data.stream, ''),
      subjects: asArray(firstDefined(data.academic?.subjects, data.subjects, [])),
    },
    services,
    career: data.career || {
      status: services.career.status,
      interests: asArray(data.careerInterests || data.interests),
      aspirations: asArray(data.careerAspirations || data.careerGoals),
      profile: data.careerDNA || null,
      riasec: {
        code: firstDefined(data.riasecCode, data.careerDNA?.riasec?.code, ''),
        scores: firstDefined(data.riasecScores, data.careerDNA?.riasec?.scores, {}),
      },
      roadmap: data.roadmap || null,
    },
    wellbeing: data.wellbeing || { status: services.wellbeing.status },
    sen: data.sen || { status: services.sen.status },
    assessments: asArray(data.assessments || data.assessmentHistory || data.careerAssessment).map((assessment) => assessment),
    goals: asArray(data.goals),
    relationships: {
      parents: guardians.map((guardian) => guardian.accountId).filter(Boolean),
      institutionId: firstDefined(data.institution?.id, data.institutionId, data.institutionID, null),
      assignments,
    },
    onboarding: {
      profileComplete: data.profileComplete === true || data.onboarding?.profileComplete === true,
      completed: data.onboardingCompleted === true || data.onboarding?.completed === true,
    },
    governance: {
      consent: data.consent || data.consentStatus || null,
      createdAt: firstDefined(data.governance?.createdAt, data.createdAt, null),
      updatedAt: firstDefined(data.governance?.updatedAt, data.updatedAt, null),
    },
    legacy: {
      primary_path: firstDefined(data.primary_path, null),
      studentTrack: firstDefined(data.studentTrack, null),
      assignedCounsellorId: firstDefined(data.assignedCounsellorId, null),
      parentUid: firstDefined(data.parentUid, null),
    },
  };
}

export default normalizeStudentRecord;
