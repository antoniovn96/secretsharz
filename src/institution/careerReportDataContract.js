// Canonical Student Career Report -> Institution/Admin field contract.
// The institution API returns careerAssessmentV2 directly as `report`, so the
// contract reads fields from that exact persisted report shape. Missing
// evidence remains missing; the Admin must never manufacture it.
export const STUDENT_CAREER_ADMIN_CONTRACT = Object.freeze([
  ['executive_snapshot','Executive Snapshot',['bundleTitle','bundle','reflection']],
  ['interest_personality','Interests & Personality Tendencies',['scores.riasecCode','scores']],
  ['strengths_values','Strengths, Values & Preferences',['intake.likedSubjects','intake.hobbies','intake.curiosity']],
  ['developmental_context','Developmental & Academic Context',['intake']],
  ['riasec_profile','Career Interest Profile',['scores.riasecCode','scores.riasec']],
  ['personality_profile','Personality Tendencies',['scores.bigFive','scores.personality']],
  ['career_values','Career Values',['scores.careerValues','scores.values']],
  ['reasoning_profile','Reasoning Sampler',['scores.reasoning','scores.reasoningProfile']],
  ['decision_readiness','Career Decision Readiness',['scores.readinessPercent','scores.decisionReadiness']],
  ['adaptability','Adaptability & Career Resilience',['scores.adaptability','scores.resilience']],
  ['work_environment','Preferred Work Environment',['scores.workEnvironment','intake.goal']],
  ['career_directions','Career Directions to Explore',['careerExploration']],
  ['top_career_directions','Top Career Directions',['careerExploration']],
  ['alternative_careers','Alternative & Unexpected Careers',['careerExploration']],
  ['pathway_analysis','Non-Linear Pathway Analysis',['pathwayAnalysis','pathways']],
  ['stream_analysis','Stream & Subject Scenarios',['intake.stream','streamAnalysis','streamScenarios']],
  ['education_roadmap','Education Roadmap',['educationRoadmap','education']],
  ['skills_evidence','Skills & Evidence Plan',['skillsEvidence','skillsPlan']],
  ['affordability','Affordability, Scholarships & Friction',['affordability','friction']],
  ['action_roadmap','90-Day Career Action Roadmap',['reflection.recommendedNextStep','actionRoadmap','actionPlan']],
  ['counsellor_review','Counsellor Conversation & Limitations',['reflection','counsellorReview','reviewLimitations']]
]);

function readPath(source, path) {
  return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source);
}

export function readReportField(report, paths=[]) {
  for (const path of paths) {
    const value = readPath(report, path);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

export function buildInstitutionCareerReflection(report) {
  const source = report || {};
  return STUDENT_CAREER_ADMIN_CONTRACT.map(([id,title,paths]) => {
    const value = readReportField(source, paths);
    return { id, title, available: value !== undefined, value };
  });
}
