/** Student-specific service assignment authority. */

const CONFIG = Object.freeze({
  wellbeing: { primaryMax: 1, backupMax: 1, roles: ['psychologist', 'counsellor', 'wellbeing_counsellor'] },
  career_guidance: { primaryMax: 1, backupMax: 0, roles: ['career_counsellor'] },
  sen: { primaryMax: 1, backupMax: 0, roles: ['sen_educator', 'sen_teacher'], multidisciplinary: true },
});

export function assignmentConfig(service) { return CONFIG[String(service || '').toLowerCase()] || null; }

export function canAssignProfessional({ service, role, institutionId, targetInstitutionId, professionalInstitutionActive, studentInstitutionActive }) {
  const config = assignmentConfig(service);
  if (!config || !config.roles.includes(String(role || '').toLowerCase())) return false;
  if (!professionalInstitutionActive || !studentInstitutionActive) return false;
  if (!institutionId || institutionId !== targetInstitutionId) return false;
  return true;
}

export function validateAssignmentCounts({ service, primaryCount = 0, backupCount = 0 }) {
  const config = assignmentConfig(service);
  if (!config) return { valid: false, reason: 'Unsupported service.' };
  if (primaryCount > config.primaryMax) return { valid: false, reason: `Maximum primary assignments exceeded for ${service}.` };
  if (backupCount > config.backupMax) return { valid: false, reason: `Maximum backup assignments exceeded for ${service}.` };
  return { valid: true };
}

export function canAccessAssignedService({ assignmentActive, service, role }) {
  const config = assignmentConfig(service);
  return Boolean(assignmentActive && config?.roles.includes(String(role || '').toLowerCase()));
}
