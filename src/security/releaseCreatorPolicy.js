import { RELEASE_AUDIENCES, RELEASE_SERVICES } from './releaseAuthority.js';

const SERVICE_BY_ROLE = Object.freeze({
  career_counsellor: RELEASE_SERVICES.CAREER,
  sen_educator: RELEASE_SERVICES.SEN,
  psychologist: RELEASE_SERVICES.WELLBEING,
});

const PURPOSES_BY_SERVICE = Object.freeze({
  [RELEASE_SERVICES.CAREER]: new Set(['parent_sharing', 'institution_sharing']),
  [RELEASE_SERVICES.SEN]: new Set(['parent_sharing', 'institution_sharing']),
  [RELEASE_SERVICES.WELLBEING]: new Set(['parent_sharing', 'institution_sharing']),
});

const SCOPES_BY_SERVICE = Object.freeze({
  [RELEASE_SERVICES.CAREER]: new Set(['career_roadmap_summary', 'career_progress_summary']),
  [RELEASE_SERVICES.SEN]: new Set(['iep_summary', 'sen_progress_summary', 'accommodations_summary']),
  [RELEASE_SERVICES.WELLBEING]: new Set(['wellbeing_progress_summary', 'support_summary']),
});

export function canCreateRelease({ role, service, purpose, audience, scope, relationshipAuthorized, institutionId, targetInstitutionId }) {
  if (role === 'super_admin') return true;
  if (!relationshipAuthorized) return false;
  if (SERVICE_BY_ROLE[role] !== service) return false;
  if (!PURPOSES_BY_SERVICE[service]?.has(purpose)) return false;
  if (![RELEASE_AUDIENCES.PARENT, RELEASE_AUDIENCES.INSTITUTION].includes(audience)) return false;
  if (!SCOPES_BY_SERVICE[service]?.has(scope)) return false;
  if (audience === RELEASE_AUDIENCES.INSTITUTION && (!institutionId || institutionId !== targetInstitutionId)) return false;
  return true;
}

export function canRevokeRelease({ role, release, relationshipAuthorized, institutionId }) {
  if (role === 'super_admin') return true;
  if (!relationshipAuthorized || !release) return false;
  if (SERVICE_BY_ROLE[role] !== release.service) return false;
  if (release.audience === RELEASE_AUDIENCES.INSTITUTION && release.institutionId !== institutionId) return false;
  return true;
}

export function isClinicalScope(scope = '') {
  return ['clinical_notes', 'soap_notes', 'private_notes', 'formulation', 'risk_assessment'].includes(String(scope).toLowerCase());
}
