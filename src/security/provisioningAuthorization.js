import { isRequesterAdmin } from './roleAssignment.js';

const PROFESSIONAL_ROLES = new Set(['counsellor', 'career_counsellor', 'psychologist', 'educator']);

export function getRequesterRole(decodedToken) {
  if (!decodedToken) return null;
  if (isRequesterAdmin(decodedToken)) return 'super_admin';
  const role = typeof decodedToken.role === 'string' ? decodedToken.role : null;
  if (role === 'institution') return 'institution';
  if (PROFESSIONAL_ROLES.has(role)) return role;
  return null;
}

export function canProvisionRole(decodedToken, targetRole) {
  const requesterRole = getRequesterRole(decodedToken);
  if (!requesterRole) return false;
  if (requesterRole === 'super_admin') return true;
  return (requesterRole === 'institution' || PROFESSIONAL_ROLES.has(requesterRole)) &&
    (targetRole === 'student' || targetRole === 'parent');
}

export function assertInstitutionScope(decodedToken, institutionId) {
  if (getRequesterRole(decodedToken) !== 'institution') return true;
  const requesterInstitutionId = decodedToken.institutionId || decodedToken.institution_id || null;
  return Boolean(requesterInstitutionId && institutionId && requesterInstitutionId === institutionId);
}
