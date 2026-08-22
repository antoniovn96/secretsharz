// Secret Sharz — counselling access policy (SERVER-ONLY).
// Counselling records are independently protected from profile, SEN and career data.

export const COUNSELLING_SCOPES = Object.freeze({
  CASE: 'counselling.case',
  SESSION: 'counselling.session',
  PROGRESS: 'counselling.progress',
  PARENT_SUMMARY: 'counselling.parent_summary',
  SAFEGUARDING: 'counselling.safeguarding',
});

const PROFESSIONAL_ROLES = new Set(['counsellor', 'psychologist', 'clinical_psychologist', 'counselling_psychologist']);

export function canAccessCounsellingScope({ role, scope, assignedCase = false, activeRelationship = false, parentSummaryConsent = false, safeguarding = false }) {
  if (!role || !scope) return { allowed: false, reason: 'missing_counselling_access_context' };
  if (scope === COUNSELLING_SCOPES.SAFEGUARDING) {
    return safeguarding && role === 'safeguarding' ? { allowed: true, reason: 'restricted_safeguarding_scope' } : { allowed: false, reason: 'safeguarding_scope_denied' };
  }
  if (PROFESSIONAL_ROLES.has(role)) {
    if (!assignedCase) return { allowed: false, reason: 'counselling_case_not_assigned' };
    if (!activeRelationship) return { allowed: false, reason: 'counselling_relationship_not_active' };
    if ([COUNSELLING_SCOPES.CASE, COUNSELLING_SCOPES.SESSION, COUNSELLING_SCOPES.PROGRESS].includes(scope)) return { allowed: true, reason: 'assigned_active_counselling_case' };
    return { allowed: false, reason: 'professional_scope_not_permitted' };
  }
  if (role === 'parent') {
    if (scope !== COUNSELLING_SCOPES.PARENT_SUMMARY) return { allowed: false, reason: 'parent_counselling_scope_denied' };
    if (!activeRelationship) return { allowed: false, reason: 'parent_relationship_not_active' };
    if (!parentSummaryConsent) return { allowed: false, reason: 'parent_counselling_summary_consent_missing' };
    return { allowed: true, reason: 'parent_counselling_summary_authorized' };
  }
  return { allowed: false, reason: 'counselling_scope_denied' };
}
