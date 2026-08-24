// Evidence coverage for the current Student Career Assessment V2 payload.
// This is intentionally conservative: a section is only considered assessed
// when the persisted V2 payload contains the corresponding evidence family.
export const ASSESSMENT_EVIDENCE_FAMILIES = Object.freeze([
  ['developmental_context', 'Academic / developmental context', r => Boolean(r?.intake)],
  ['riasec_profile', 'RIASEC', r => Boolean(r?.scores?.riasec || r?.scores?.riasecCode)],
  ['reasoning_profile', 'Reasoning', r => Boolean(r?.scores?.reasoning)],
  ['decision_readiness', 'Decision readiness', r => r?.scores?.readinessPercent != null || Boolean(r?.scores?.readiness && Object.keys(r.scores.readiness).length > 0)],
  ['adaptability', 'Adaptability & resilience', r => r?.scores?.adaptabilityPercent != null || Boolean(r?.scores?.adaptability && Object.keys(r.scores.adaptability).length > 0)],
  ['work_environment', 'Work-environment preferences', r => Boolean((r?.scores?.environment && Object.keys(r.scores.environment).length > 0) || (r?.scores?.workEnvironment && Object.keys(r.scores.workEnvironment).length > 0) || (r?.workEnvironment && Object.keys(r.workEnvironment).length > 0))],
  ['career_directions', 'Career exploration', r => Array.isArray(r?.careerExploration) && r.careerExploration.length > 0],
  ['career_values', 'Career values', r => Boolean(r?.scores?.values && Object.keys(r.scores.values).length > 0)],
  ['personality_profile', 'Big Five personality', r => Boolean(r?.scores?.big5 && Object.keys(r.scores.big5).length > 0)],
  ['skills_profile', 'Skills', r => Boolean(r?.scores?.skills && r.scores.skills.percent != null)],
  ['learning_preferences', 'Learning preferences', r => Boolean(r?.scores?.learning && r.scores.learning.percent != null)],
  ['action_roadmap', 'Career reflection / next action', r => Boolean(r?.reflection && Object.keys(r.reflection).length > 0)]
]);

export function getAssessmentEvidenceCoverage(report = {}) {
  const sections = ASSESSMENT_EVIDENCE_FAMILIES.map(([id, label, predicate]) => ({ id, label, assessed: Boolean(predicate(report)) }));
  const assessed = sections.filter(x => x.assessed).length;
  return { totalFamilies: sections.length, assessedFamilies: assessed, unassessedFamilies: sections.length - assessed, sections };
}
