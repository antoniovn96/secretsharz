// Secret Sharz — counselling access policy (SERVER-ONLY).
// Counselling records are independently protected from profile, SEN and career data.
import { grantCoversScope, isSafeguardingGrantActive, SAFEGUARDING_ROLE } from './safeguardingGrant.js';

export const COUNSELLING_SCOPES = Object.freeze({
  CASE: 'counselling.case', SESSION: 'counselling.session', PROGRESS: 'counselling.progress',
  PARENT_SUMMARY: 'counselling.parent_summary', SAFEGUARDING: 'counselling.safeguarding',
});
const PROFESSIONAL_ROLES = new Set(['counsellor', 'psychologist', 'clinical_psychologist', 'counselling_psychologist']);

export function canAccessCounsellingScope({ role, scope, assignedCase = false, activeRelationship = false, parentSummaryConsent = false, safeguarding = false, subjectPersonId = null, safeguardingGrant = null }) {
  if (!role || !scope) return { allowed: false, reason: 'missing_counselling_access_context' };
  if (scope === COUNSELLING_SCOPES.SAFEGUARDING) {
    if (role !== SAFEGUARDING_ROLE) return { allowed: false, reason: 'safeguarding_role_required' };
    if (!subjectPersonId) return { allowed: false, reason: 'safeguarding_subject_required' };
    if (!isSafeguardingGrantActive(safeguardingGrant)) return { allowed: false, reason: 'safeguarding_grant_required_or_expired' };
    if (safeguardingGrant.subjectPersonId !== subjectPersonId) return { allowed: false, reason: 'safeguarding_grant_subject_mismatch' };
    if (!grantCoversScope(safeguardingGrant, 'counselling') && !grantCoversScope(safeguardingGrant, 'safeguarding')) return { allowed: false, reason: 'safeguarding_grant_scope_denied' };
    return { allowed: true, reason: 'trusted_safeguarding_grant' };
  }
  // Legacy `safeguarding` boolean is intentionally ignored; it cannot grant access.
  void safeguarding;
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
