/**
 * Compatibility adapter for the existing DashboardContext.
 * The canonical Student Profile remains the source of truth.
 */

export const EMPTY_CANONICAL_STUDENT = Object.freeze({
  id: null, identity: {}, contact: {}, family: { guardians: [] }, academic: {}, institution: {}, services: {}, career: {}, wellbeing: {}, sen: {}, assessments: [], goals: [], relationships: { assignments: {} }, governance: {}, onboarding: {},
});

function guardiansByRelationship(guardians = [], relationship) {
  return guardians.find(item => String(item?.relationship || '').toLowerCase() === relationship) || {};
}

function deriveStudentTrack(services = {}) {
  const active = ['career', 'wellbeing', 'sen'].filter(service => services?.[service]?.status === 'active');
  if (active.length === 0) return 'unassigned';
  if (active.length === 1) return active[0];
  return 'multiple';
}

function deriveCounsellingConsent(profile = {}) {
  return Boolean(profile.governance?.consents?.wellbeing || profile.governance?.consent?.counselling || profile.governance?.serviceConsent?.wellbeing);
}

export function toLegacyDashboardProfile(profile = EMPTY_CANONICAL_STUDENT) {
  const identity = profile.identity || {};
  const contact = profile.contact || {};
  const academic = profile.academic || {};
  const institution = profile.institution || {};
  const guardians = profile.family?.guardians || [];
  const father = guardiansByRelationship(guardians, 'father');
  const mother = guardiansByRelationship(guardians, 'mother');
  const assignments = profile.relationships?.assignments || {};
  const currentAcademic = academic.current || {};

  return {
    id: profile.id || null,
    name: identity.fullName || '',
    preferredName: identity.preferredName || '',
    dob: identity.dateOfBirth || '',
    gender: identity.gender || '',
    pronouns: identity.pronouns || '',
    profilePicture: identity.photoURL || identity.photoUrl || null,
    email: contact.email || '',
    phone: contact.mobile?.number || '',
    fatherName: father.name || '', fatherPhone: father.phone || '', fatherEmail: father.email || '',
    motherName: mother.name || '', motherPhone: mother.phone || '', motherEmail: mother.email || '',
    schoolName: currentAcademic.institutionName || academic.institutionName || institution.name || '',
    gradeLevel: currentAcademic.grade || academic.grade || '',
    section: currentAcademic.section || '',
    academicYear: currentAcademic.academicYear || institution.academicYear || '',
    stream1112: currentAcademic.stream || academic.stream || '',
    subjects: currentAcademic.subjects || academic.subjects || [],
    studentTrack: deriveStudentTrack(profile.services),
    assignedCounsellorId: assignments.wellbeing || assignments.psychology || null,
    assignedCareerCoachId: assignments.career || null,
    assignedSENEducatorId: assignments.sen || null,
    interests: profile.career?.interests || [],
    hobbies: profile.personal?.hobbies || profile.career?.hobbies || [],
    counsellingConsentAgreed: deriveCounsellingConsent(profile),
    profileComplete: Boolean(profile.onboarding?.profileComplete || profile.onboarding?.completed),
    onboardingCompleted: Boolean(profile.onboarding?.completed),
    canonicalProfile: profile,
  };
}

export function fromStudentDetailResponse(payload) {
  if (!payload) return EMPTY_CANONICAL_STUDENT;
  return payload.studentProfile || payload.profile || payload.student || EMPTY_CANONICAL_STUDENT;
}

export async function fetchCanonicalDashboardStudent(user) {
  if (!user) return EMPTY_CANONICAL_STUDENT;
  const token = await user.getIdToken();
  const response = await fetch(`/api/admin/student-detail?studentId=${encodeURIComponent(user.uid)}`, { headers: { Authorization: `Bearer ${token}` } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Unable to load the canonical student profile.');
  return fromStudentDetailResponse(payload);
}

export default { EMPTY_CANONICAL_STUDENT, toLegacyDashboardProfile, fromStudentDetailResponse, fetchCanonicalDashboardStudent };
