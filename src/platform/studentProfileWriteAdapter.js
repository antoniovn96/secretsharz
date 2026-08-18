import { normalizeStudentRecord } from './studentRecordNormalizer.js';

const clean = (value) => typeof value === 'string' ? value.trim() : value;
const strings = (value) => Array.isArray(value) ? value.map(String).map(v => v.trim()).filter(Boolean) : [];

function educationTier(tier = {}) {
  return {
    schoolName: clean(tier.schoolName || ''),
    marksType: clean(tier.marksType || 'percentage'),
    marksValue: clean(tier.marksValue || ''),
    marksMax: clean(tier.marksMax || ''),
    marksObtained: clean(tier.marksObtained || ''),
    subjects: strings(tier.subjects),
  };
}

/**
 * Converts the legacy ProfileEditor payload into a canonical partial profile.
 * This function deliberately does not write to Firebase. The server endpoint
 * is responsible for authentication, authorization and persistence.
 */
export function profileEditorToCanonicalPatch(payload = {}, currentProfile = {}) {
  const currentAcademic = currentProfile.academic?.current || {};
  const currentHistory = currentProfile.academic?.history || {};
  const currentPersonal = currentProfile.personal || {};
  const currentPreferences = currentPersonal.preferences || {};

  const education = payload.education || {};
  const guardians = Array.isArray(currentProfile.family?.guardians) ? [...currentProfile.family.guardians] : [];

  const upsertGuardian = (relationship, patch) => {
    const index = guardians.findIndex(g => String(g.relationship || '').toLowerCase() === relationship);
    const next = {
      accountId: null,
      relationship,
      name: clean(patch.name || ''),
      email: clean(patch.email || ''),
      phone: clean(patch.phone || ''),
      countryCode: patch.countryCode || null,
      legalGuardian: Boolean(patch.legalGuardian),
      invitationStatus: patch.invitationStatus || null,
      consentStatus: patch.consentStatus || null,
    };
    if (index >= 0) guardians[index] = { ...guardians[index], ...next };
    else if (next.name || next.email || next.phone) guardians.push(next);
  };

  upsertGuardian('father', {
    name: payload.fatherName,
    email: payload.fatherEmail,
    phone: payload.fatherPhone,
  });
  upsertGuardian('mother', {
    name: payload.motherName,
    email: payload.motherEmail,
    phone: payload.motherPhone,
  });

  const services = { ...(currentProfile.services || {}) };
  const track = String(payload.studentTrack || '').toLowerCase();
  if (track === 'both') {
    services.career = { ...(services.career || {}), status: 'active' };
    services.wellbeing = { ...(services.wellbeing || {}), status: 'active' };
  } else if (track === 'career_guidance' || track === 'career') {
    services.career = { ...(services.career || {}), status: 'active' };
  } else if (track === 'counselling' || track === 'wellbeing') {
    services.wellbeing = { ...(services.wellbeing || {}), status: 'active' };
  }

  const history = { ...currentHistory };
  ['tenth', 'twelfth', 'graduate', 'postGraduate'].forEach((tier) => {
    if (education[tier]) history[tier] = educationTier(education[tier]);
  });

  const personal = {
    interests: strings(payload.interests ?? currentPersonal.interests),
    hobbies: strings(payload.hobbies ?? currentPersonal.hobbies),
    preferences: {
      tvShows: strings(payload.tvShows ?? currentPreferences.tvShows),
      movies: strings(payload.movies ?? currentPreferences.movies),
      games: strings(payload.games ?? currentPreferences.games),
      sports: strings(payload.sports ?? currentPreferences.sports),
    },
  };

  return {
    identity: {
      ...(currentProfile.identity || {}),
      gender: clean(payload.gender ?? currentProfile.identity?.gender ?? ''),
      photoURL: payload.profilePicture || currentProfile.identity?.photoURL || '',
    },
    contact: {
      ...(currentProfile.contact || {}),
      email: clean(payload.email ?? currentProfile.contact?.email ?? ''),
      mobile: {
        ...(currentProfile.contact?.mobile || {}),
        number: clean(payload.phone ?? currentProfile.contact?.mobile?.number ?? ''),
      },
    },
    family: { guardians },
    academic: {
      current: {
        ...currentAcademic,
        institutionName: clean(education.schoolName || currentAcademic.institutionName || ''),
        grade: clean(payload.grade ?? currentAcademic.grade ?? ''),
        stream: clean(payload.stream ?? currentAcademic.stream ?? ''),
        subjects: strings(education.subjects ?? currentAcademic.subjects),
      },
      history,
      highestLevel: clean(education.highestLevel ?? currentProfile.academic?.highestLevel ?? ''),
      address: clean(education.address ?? currentProfile.academic?.address ?? ''),
      yearOfPassing: clean(education.yearOfPassing ?? currentProfile.academic?.yearOfPassing ?? ''),
      isPursuing: typeof education.isPursuing === 'boolean' ? education.isPursuing : (currentProfile.academic?.isPursuing ?? true),
      electives: strings(education.electives ?? currentProfile.academic?.electives),
    },
    personal,
    services,
    governance: {
      ...(currentProfile.governance || {}),
      serviceConsent: {
        ...(currentProfile.governance?.serviceConsent || {}),
        wellbeing: Boolean(payload.counsellingConsentAgreed ?? currentProfile.governance?.serviceConsent?.wellbeing),
      },
    },
  };
}

/** Merge a partial canonical patch without allowing empty legacy values to erase data. */
export function mergeCanonicalStudentProfile(currentProfile = {}, patch = {}) {
  const merged = normalizeStudentRecord({ ...currentProfile, ...patch }, currentProfile.id || null);
  return {
    ...currentProfile,
    ...merged,
    identity: { ...(currentProfile.identity || {}), ...(patch.identity || {}) },
    contact: { ...(currentProfile.contact || {}), ...(patch.contact || {}) },
    family: { ...(currentProfile.family || {}), ...(patch.family || {}) },
    academic: {
      ...(currentProfile.academic || {}),
      ...(patch.academic || {}),
      current: { ...(currentProfile.academic?.current || {}), ...(patch.academic?.current || {}) },
      history: { ...(currentProfile.academic?.history || {}), ...(patch.academic?.history || {}) },
    },
    personal: { ...(currentProfile.personal || {}), ...(patch.personal || {}) },
    services: { ...(currentProfile.services || {}), ...(patch.services || {}) },
    governance: { ...(currentProfile.governance || {}), ...(patch.governance || {}) },
  };
}
