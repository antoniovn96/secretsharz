// Canonical Student Career Report -> Institution/Admin field contract.
// This module is deliberately declarative: it maps report sections to the
// evidence paths the institutional UI may read. Missing evidence remains missing.
export const STUDENT_CAREER_ADMIN_CONTRACT = Object.freeze([
  ['executive_snapshot','Executive Snapshot',['executiveSnapshot','snapshot']],
  ['interest_personality','Interests & Personality Tendencies',['interestPersonality','interestsPersonality']],
  ['strengths_values','Strengths, Values & Preferences',['strengthsValues','strengths_values']],
  ['developmental_context','Developmental & Academic Context',['developmentalContext','academicContext']],
  ['riasec_profile','Career Interest Profile',['riasecProfile','riasec','careerInterest']],
  ['personality_profile','Personality Tendencies',['personalityProfile','bigFive','personality']],
  ['career_values','Career Values',['careerValues','values']],
  ['reasoning_profile','Reasoning Sampler',['reasoningProfile','reasoning']],
  ['decision_readiness','Career Decision Readiness',['decisionReadiness','readiness']],
  ['adaptability','Adaptability & Career Resilience',['adaptability','resilience']],
  ['work_environment','Preferred Work Environment',['workEnvironment','preferredWorkEnvironment']],
  ['career_directions','Career Directions to Explore',['careerDirections','careerExploration']],
  ['top_career_directions','Top Career Directions',['topCareerDirections','topCareers']],
  ['alternative_careers','Alternative & Unexpected Careers',['alternativeCareers','alternatives']],
  ['pathway_analysis','Non-Linear Pathway Analysis',['pathwayAnalysis','pathways']],
  ['stream_analysis','Stream & Subject Scenarios',['streamAnalysis','streamScenarios']],
  ['education_roadmap','Education Roadmap',['educationRoadmap','education']],
  ['skills_evidence','Skills & Evidence Plan',['skillsEvidence','skillsPlan']],
  ['affordability','Affordability, Scholarships & Friction',['affordability','friction']],
  ['action_roadmap','90-Day Career Action Roadmap',['actionRoadmap','actionPlan']],
  ['counsellor_review','Counsellor Conversation & Limitations',['counsellorReview','reviewLimitations']]
]);

export function readReportField(report, paths=[]) {
  for (const path of paths) {
    const value = report?.[path];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

export function buildInstitutionCareerReflection(report) {
  const source = report || {};
  return STUDENT_CAREER_ADMIN_CONTRACT.map(([id,title,paths]) => ({
    id,title,available: readReportField(source,paths) !== undefined,
    value: readReportField(source,paths)
  }));
}
