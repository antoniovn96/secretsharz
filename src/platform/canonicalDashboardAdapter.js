/**
 * Compatibility adapter for the existing DashboardContext.
 *
 * The dashboard can continue to consume its legacy `userProfile` shape while
 * the underlying source of truth is the canonical Student Profile. This keeps
 * migration incremental: consumers can migrate field-by-field without making
 * the old context authoritative again.
 */

export const EMPTY_CANONICAL_STUDENT = Object.freeze({
  id: null,
  identity: {},
  contact: {},
  family: { guardians: [] },
  academic: {},
  institution: {},
  services: {},
  career: {},
  wellbeing: {},
  sen: {},
  assessments: [],
  goals: [],
  relationships: { assignments: {} },
  governance: {},
  onboarding: {},
});

function guardiansByRelationship(guardians = [], relationship) {
  return guardians.find(item => String(item?.relationship || '').toLowerCase() === relationship) || {};
}

/**
 * Converts canonical profile data into the legacy context shape.
 * This is a READ adapter only. Do not persist this object as a new source.
 */
export function toLegacyDashboardProfile(profile = EMPTY_CANONICAL_STUDENT) {
  const identity = profile.identity || {};
  const contact = profile.contact || {};
  const academic = profile.academic || {};
  const institution = profile.institution || {};
  const guardians = profile.family?.guardians || [];
  const father = guardiansByRelationship(guardians, 'father');
  const mother = guardiansByRelationship(guardians, 'mother');
  const assignments = profile.relationships?.assignments || {};

  return {
    id: profile.id || null,
    name: identity.fullName || '',
    preferredName: identity.preferredName || '',
    dob: identity.dateOfBirth || '',
    gender: identity.gender || '',
    pronouns: identity.pronouns || '',
    profilePicture: identity.photoUrl || null,
    email: contact.email || '',
    phone: contact.mobile?.number || '',

    // Family compatibility fields
    fatherName: father.name || '',
    fatherPhone: father.phone || '',
    fatherEmail: father.email || '',
    motherName: mother.name || '',
    motherPhone: mother.phone || '',
    motherEmail: mother.email || '',

    // Academic compatibility fields
    schoolName: academic.institutionName || institution.name || '',
    gradeLevel: academic.grade || '',
    stream1112: academic.stream || '',
    subjects: academic.subjects || [],

    // Service/relationship compatibility fields
    studentTrack: profile.services?.primary || 'unassigned',
    assignedCounsellorId: assignments.psychology || null,
    assignedCareerCoachId: assignments.career || null,
    assignedSENEducatorId: assignments.sen || null,

    interests: profile.career?.interests || [],
    hobbies: profile.career?.hobbies || [],
    counsellingConsentAgreed: Boolean(profile.governance?.consents?.wellbeing),
    profileComplete: Boolean(profile.onboarding?.completed),
    onboardingCompleted: Boolean(profile.onboarding?.completed),

    // Canonical source remains available to progressively migrated components.
    canonicalProfile: profile,
  };
}

/**
 * Extracts a canonical profile from supported secure API response shapes.
 */
export function fromStudentDetailResponse(payload) {
  if (!payload) return EMPTY_CANONICAL_STUDENT;
  return payload.studentProfile || payload.profile || payload.student || EMPTY_CANONICAL_STUDENT;
}

/**
 * Loads the authenticated student's canonical profile through the secure API.
 * This function intentionally never reads Firestore directly from the browser.
 */
export async function fetchCanonicalDashboardStudent(user) {
  if (!user) return EMPTY_CANONICAL_STUDENT;

  const token = await user.getIdToken();
  const response = await fetch(`/api/admin/student-detail?studentId=${encodeURIComponent(user.uid)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to load the canonical student profile.');
  }

  return fromStudentDetailResponse(payload);
}

export default {
  EMPTY_CANONICAL_STUDENT,
  toLegacyDashboardProfile,
  fromStudentDetailResponse,
  fetchCanonicalDashboardStudent,
};
