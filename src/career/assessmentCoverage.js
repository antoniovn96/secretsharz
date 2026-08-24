// Evidence coverage for the current Student Career Assessment V2 payload.
// This is intentionally conservative: a section is only considered assessed
// when the persisted V2 payload contains the corresponding evidence family.
export const ASSESSMENT_EVIDENCE_FAMILIES = Object.freeze([
  ['developmental_context', 'Academic / developmental context', r => Boolean(r?.intake)],
  ['riasec_profile', 'RIASEC', r => Boolean(r?.scores?.riasec || r?.scores?.riasecCode)],
  ['reasoning_profile', 'Reasoning', r => Boolean(r?.scores?.reasoning)],
  ['decision_readiness', 'Decision readiness', r => r?.scores?.readinessPercent != null || r?.scores?.readiness != null],
  ['adaptability', 'Adaptability', r => r?.scores?.adaptabilityPercent != null || r?.scores?.adaptability != null],
  ['career_directions', 'Career exploration', r => Array.isArray(r?.careerExploration) && r.careerExploration.length > 0],
  ['career_values', 'Career values', r => Boolean(r?.scores?.values)],
  ['personality_profile', 'Big Five personality', r => Boolean(r?.scores?.big5)],
  ['action_roadmap', 'Career reflection / next action', r => Boolean(r?.reflection)]
]);

export function getAssessmentEvidenceCoverage(report = {}) {
  const sections = ASSESSMENT_EVIDENCE_FAMILIES.map(([id, label, predicate]) => ({ id, label, assessed: Boolean(predicate(report)) }));
  const assessed = sections.filter(x => x.assessed).length;
  return { totalFamilies: sections.length, assessedFamilies: assessed, unassessedFamilies: sections.length - assessed, sections };
}
