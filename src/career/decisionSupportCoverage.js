export const DECISION_SUPPORT_SOURCES = Object.freeze({
  assessed: 'assessed',
  derived: 'derived_from_assessment',
  catalogue: 'career_catalogue',
  unavailable: 'unavailable',
});

const hasArray = value => Array.isArray(value) && value.length > 0;
const hasObject = value => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
const hasValue = value => value !== undefined && value !== null && value !== '';

export function buildDecisionSupportCoverage(report = {}) {
  const scores = report.scores || {};
  const intake = report.intake || {};
  const careers = Array.isArray(report.careerExploration) ? report.careerExploration : [];
  const hasRiasec = hasValue(scores.riasecCode) || hasObject(scores.riasec);
  const hasPathway = careers.some(c => hasArray(c?.decisionProfile?.pathway?.listedStreams) || hasValue(c?.decisionProfile?.pathway?.education));
  const hasEducation = careers.some(c => hasValue(c?.decisionProfile?.education?.pathway) || hasArray(c?.decisionProfile?.education?.colleges));
  const hasScenarios = hasPathway || hasArray(intake.likedSubjects) || hasArray(intake.dislikedSubjects);
  return {
    career_directions: { source: hasRiasec && careers.length ? DECISION_SUPPORT_SOURCES.derived : DECISION_SUPPORT_SOURCES.unavailable, label: hasRiasec && careers.length ? 'Derived from assessment evidence' : 'Not available' },
    education_roadmap: { source: hasEducation ? DECISION_SUPPORT_SOURCES.catalogue : DECISION_SUPPORT_SOURCES.unavailable, label: hasEducation ? 'Career catalogue information' : 'Not available' },
    stream_subject_scenarios: { source: hasScenarios ? DECISION_SUPPORT_SOURCES.catalogue : DECISION_SUPPORT_SOURCES.unavailable, label: hasScenarios ? 'Pathway/context information' : 'Not available' },
  };
}
