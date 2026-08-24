// Evidence coverage for Student Career Assessment V2.
// New V2 payloads are assessed only when the canonical scoring layer marks the
// relevant family complete. Legacy payloads retain conservative field checks.
export const ASSESSMENT_EVIDENCE_FAMILIES = Object.freeze([
  ['developmental_context', 'Academic / developmental context', r => Boolean(r?.intake)],
  ['riasec_profile', 'RIASEC', r => familySelected(r, 'interest') && familyScored(r, 'riasec', Boolean(r?.scores?.riasec || r?.scores?.riasecCode))],
  ['reasoning_profile', 'Reasoning', r => familySelected(r, 'aptitude_skills') && (r?.scores?.reasoning?.status === 'scored' || (!r?.scores?.scoringSchemaVersion && Boolean(r?.scores?.reasoning)))],
  ['decision_readiness', 'Decision readiness', r => fullGuidanceSelected(r) && familyScored(r, 'readiness', Boolean(r?.scores?.readinessPercent != null || (r?.scores?.readiness && Object.keys(r.scores.readiness).length > 0)))],
  ['adaptability', 'Adaptability & resilience', r => fullGuidanceSelected(r) && familyScored(r, 'adaptability', Boolean(r?.scores?.adaptabilityPercent != null || (r?.scores?.adaptability && Object.keys(r.scores.adaptability).length > 0)))],
  ['work_environment', 'Work-environment preferences', r => fullGuidanceSelected(r) && familyScored(r, 'environment', Boolean((r?.scores?.environment && Object.keys(r.scores.environment).length > 0) || (r?.scores?.workEnvironment && Object.keys(r.scores.workEnvironment).length > 0) || (r?.workEnvironment && Object.keys(r.workEnvironment).length > 0)))],
  ['career_directions', 'Career exploration', r => familySelected(r, 'interest') && familyScored(r, 'riasec', Array.isArray(r?.careerExploration) && r.careerExploration.length > 0)],
  ['career_values', 'Career values', r => familySelected(r, 'work_values') && familyScored(r, 'values', Boolean(r?.scores?.values && Object.keys(r.scores.values).length > 0))],
  ['personality_profile', 'Big Five personality', r => familySelected(r, 'personality') && familyScored(r, 'big5', Boolean(r?.scores?.big5 && Object.keys(r.scores.big5).length > 0))],
  ['skills_profile', 'Skills', r => familySelected(r, 'aptitude_skills') && familyScored(r, 'skills', Boolean(r?.scores?.skills && r.scores.skills.percent != null))],
  ['learning_preferences', 'Learning preferences', r => familySelected(r, 'learning') && familyScored(r, 'learning', Boolean(r?.scores?.learning && r.scores.learning.percent != null))],
  ['action_roadmap', 'Career reflection / next action', r => Boolean(r?.reflection && Object.keys(r.reflection).length > 0)]
]);

const BASE_FAMILIES = Object.freeze(['interest', 'personality', 'aptitude_skills', 'work_values', 'learning']);
const hasExplicitFamilySelection = report => Array.isArray(report?.selectedFamilyIds) && report.selectedFamilyIds.length > 0;
function familySelected(report, familyId) { if (!hasExplicitFamilySelection(report)) return true; return report.selectedFamilyIds.includes(familyId); }
function fullGuidanceSelected(report) { if (!hasExplicitFamilySelection(report)) return true; return BASE_FAMILIES.every(familyId => report.selectedFamilyIds.includes(familyId)); }
function familyScored(report, qualityKey, legacyFallback) {
  if (report?.scores?.scoringSchemaVersion) return report?.scores?.quality?.[qualityKey]?.complete === true;
  return legacyFallback;
}

export function getAssessmentEvidenceCoverage(report = {}) {
  const sections = ASSESSMENT_EVIDENCE_FAMILIES.map(([id, label, predicate]) => ({ id, label, assessed: Boolean(predicate(report)) }));
  const assessed = sections.filter(x => x.assessed).length;
  return { totalFamilies: sections.length, assessedFamilies: assessed, unassessedFamilies: sections.length - assessed, sections };
}
