/**
 * Canonical service assignment contract.
 * Assignment is service-specific; it is not derived from primary_path or
 * assignedStaff.*. Authorization must still be enforced server-side.
 */

export const SERVICE_KEYS = Object.freeze({
  WELLBEING: 'wellbeing',
  CAREER: 'career_guidance',
  SEN: 'sen',
});

const asString = (value) => (value == null ? '' : String(value).trim());

export function normalizeServiceAssignment(raw = {}, service) {
  const team = Array.isArray(raw.team) ? raw.team : [];

  return {
    service: asString(raw.service || service),
    status: asString(raw.status || 'active'),
    institutionMembershipId: asString(raw.institutionMembershipId),
    primaryProfessionalId: asString(
      raw.primaryProfessionalId || raw.primaryCounsellorId || raw.primaryEducatorId
    ),
    backupProfessionalId: asString(raw.backupProfessionalId || raw.backupCounsellorId),
    team: team.filter(Boolean).map((member) => ({
      professionalId: asString(member.professionalId || member.uid || member.id),
      role: asString(member.role),
      status: asString(member.status || 'active'),
    })),
    effectiveFrom: raw.effectiveFrom || null,
    effectiveTo: raw.effectiveTo || null,
  };
}

export function isActiveServiceAssignment(assignment) {
  return assignment?.status === 'active';
}

export function isAssignedProfessional(assignment, professionalId) {
  if (!assignment || !professionalId || !isActiveServiceAssignment(assignment)) return false;
  const id = asString(professionalId);
  if (assignment.primaryProfessionalId === id) return true;
  if (assignment.backupProfessionalId === id) return true;
  return assignment.team.some(
    (member) => member.status === 'active' && member.professionalId === id
  );
}
