import { normalizeStudentRecord } from './studentRecordNormalizer.js';

const clean = (value) => typeof value === 'string' ? value.trim() : value;
const strings = (value) => Array.isArray(value) ? value.map(String).map(v => v.trim()).filter(Boolean) : [];

function educationTier(tier = {}) {
  return { schoolName: clean(tier.schoolName || ''), marksType: clean(tier.marksType || 'percentage'), marksValue: clean(tier.marksValue || ''), marksMax: clean(tier.marksMax || ''), marksObtained: clean(tier.marksObtained || ''), subjects: strings(tier.subjects) };
}

export function profileEditorToCanonicalPatch(payload = {}, currentProfile = {}) {
  const currentAcademic = currentProfile.academic?.current || {};
  const currentHistory = currentProfile.academic?.history || {};
  const currentPersonal = currentProfile.personal || {};
  const currentPreferences = currentPersonal.preferences || {};
  const education = payload.education || {};
  const guardians = Array.isArray(currentProfile.family?.guardians) ? [...currentProfile.family.guardians] : [];

  const upsertGuardian = (relationship, patch) => {
    const index = guardians.findIndex(g => String(g.relationship || '').toLowerCase() === relationship);
    const existing = index >= 0 ? guardians[index] : {};
    const next = {
      accountId: existing.accountId ?? null,
      relationship,
      name: clean(patch.name ?? existing.name ?? ''),
      email: clean(patch.email ?? existing.email ?? ''),
      phone: clean(patch.phone ?? existing.phone ?? ''),
      countryCode: patch.countryCode ?? existing.countryCode ?? null,
      legalGuardian: patch.legalGuardian ?? existing.legalGuardian ?? false,
      invitationStatus: patch.invitationStatus ?? existing.invitationStatus ?? null,
      consentStatus: patch.consentStatus ?? existing.consentStatus ?? null,
    };
    if (index >= 0) guardians[index] = { ...existing, ...next };
    else if (next.name || next.email || next.phone) guardians.push(next);
  };

  upsertGuardian('father', { name: payload.fatherName, email: payload.fatherEmail, phone: payload.fatherPhone });
  upsertGuardian('mother', { name: payload.motherName, email: payload.motherEmail, phone: payload.motherPhone });

  const services = { ...(currentProfile.services || {}) };
  const track = String(payload.studentTrack || '').toLowerCase();
  if (track === 'both') {
    services.career = { ...(services.career || {}), status: 'active' };
    services.wellbeing = { ...(services.wellbeing || {}), status: 'active' };
  } else if (track === 'career_guidance' || track === 'career') {
    services.career = { ...(services.career || {}), status: 'active' };
    services.wellbeing = { ...(services.wellbeing || {}), status: 'inactive' };
  } else if (track === 'counselling' || track === 'wellbeing') {
    services.career = { ...(services.career || {}), status: 'inactive' };
    services.wellbeing = { ...(services.wellbeing || {}), status: 'active' };
  }

  const history = { ...currentHistory };
  ['tenth', 'twelfth', 'graduate', 'postGraduate'].forEach((tier) => { if (education[tier]) history[tier] = educationTier(education[tier]); });
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

  const identity = {
    ...(currentProfile.identity || {}),
    gender: clean(payload.gender ?? currentProfile.identity?.gender ?? ''),
  };
  // ProfileEditor explicitly owns this field. null/empty therefore means
  // the student intentionally removed the picture, not "preserve old value".
  if (Object.prototype.hasOwnProperty.call(payload, 'profilePicture')) {
    identity.photoURL = clean(payload.profilePicture || '');
  } else if (currentProfile.identity?.photoURL !== undefined) {
    identity.photoURL = currentProfile.identity.photoURL;
  }

  return {
    identity,
    contact: { ...(currentProfile.contact || {}), email: clean(payload.email ?? currentProfile.contact?.email ?? ''), mobile: { ...(currentProfile.contact?.mobile || {}), number: clean(payload.phone ?? currentProfile.contact?.mobile?.number ?? '') } },
    family: { guardians },
    academic: { current: { ...currentAcademic, institutionName: clean(education.schoolName || currentAcademic.institutionName || ''), grade: clean(payload.grade ?? currentAcademic.grade ?? ''), stream: clean(payload.stream ?? currentAcademic.stream ?? ''), subjects: strings(education.subjects ?? currentAcademic.subjects) }, history, highestLevel: clean(education.highestLevel ?? currentProfile.academic?.highestLevel ?? ''), address: clean(education.address ?? currentProfile.academic?.address ?? ''), yearOfPassing: clean(education.yearOfPassing ?? currentProfile.academic?.yearOfPassing ?? ''), isPursuing: typeof education.isPursuing === 'boolean' ? education.isPursuing : (currentProfile.academic?.isPursuing ?? true), electives: strings(education.electives ?? currentProfile.academic?.electives) },
    personal,
    services,
    governance: {
      ...(currentProfile.governance || {}),
      consent: {
        ...(currentProfile.governance?.consent && typeof currentProfile.governance.consent === 'object' ? currentProfile.governance.consent : {}),
        wellbeing: Boolean(payload.counsellingConsentAgreed ?? currentProfile.governance?.consent?.wellbeing),
      },
    },
  };
}

export function mergeCanonicalStudentProfile(currentProfile = {}, patch = {}) {
  const merged = normalizeStudentRecord({ ...currentProfile, ...patch }, currentProfile.id || null);
  const currentServices = currentProfile.services || {};
  const patchServices = patch.services || {};
  const services = Object.keys({ ...currentServices, ...patchServices }).reduce((result, key) => {
    result[key] = { ...(currentServices[key] || {}), ...(patchServices[key] || {}) };
    return result;
  }, {});
  return {
    ...currentProfile,
    ...merged,
    identity: { ...(currentProfile.identity || {}), ...(patch.identity || {}) },
    contact: { ...(currentProfile.contact || {}), ...(patch.contact || {}) },
    family: { ...(currentProfile.family || {}), ...(patch.family || {}) },
    academic: { ...(currentProfile.academic || {}), ...(patch.academic || {}), current: { ...(currentProfile.academic?.current || {}), ...(patch.academic?.current || {}) }, history: { ...(currentProfile.academic?.history || {}), ...(patch.academic?.history || {}) } },
    personal: { ...(currentProfile.personal || {}), ...(patch.personal || {}) },
    services,
    governance: { ...(currentProfile.governance || {}), ...(patch.governance || {}), consent: { ...(currentProfile.governance?.consent || {}), ...(patch.governance?.consent || {}) } },
  };
}
