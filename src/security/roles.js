// Secret Sharz — central role model
//
// This module is intentionally declarative. It is a client-side UX aid only;
// Firestore Security Rules and trusted server code remain the real security boundary.

export const ROLES = Object.freeze({
  STUDENT: 'student',
  PARENT: 'parent',
  COUNSELLOR: 'counsellor',
  PSYCHOLOGIST: 'psychologist',
  EDUCATOR: 'educator',
  SUPER_ADMIN: 'super_admin',
});

export const STAFF_ROLES = Object.freeze([
  ROLES.COUNSELLOR,
  ROLES.PSYCHOLOGIST,
  ROLES.EDUCATOR,
]);

export const PRIVILEGED_ROLES = Object.freeze([
  ...STAFF_ROLES,
  ROLES.SUPER_ADMIN,
]);

export const isKnownRole = (role) => Object.values(ROLES).includes(role);
export const isStaffRole = (role) => STAFF_ROLES.includes(role);
export const isAdminRole = (role) => role === ROLES.SUPER_ADMIN;

// UI capabilities. These MUST NOT be treated as authorisation.
export const ROLE_CAPABILITIES = Object.freeze({
  [ROLES.STUDENT]: ['own_profile', 'own_services'],
  [ROLES.PARENT]: ['own_profile', 'linked_child_view'],
  [ROLES.COUNSELLOR]: ['assigned_student_cases', 'professional_notes'],
  [ROLES.PSYCHOLOGIST]: ['assigned_student_cases', 'professional_notes'],
  [ROLES.EDUCATOR]: ['assigned_student_cases', 'sen_support'],
  [ROLES.SUPER_ADMIN]: ['admin_console', 'user_management', 'system_management'],
});

export const hasCapability = (role, capability) =>
  ROLE_CAPABILITIES[role]?.includes(capability) === true;
