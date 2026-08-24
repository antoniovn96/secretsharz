import { getAssessmentEvidenceCoverage } from '../career/assessmentCoverage.js';
import { buildDecisionSupportCoverage } from '../career/decisionSupportCoverage.js';

// Canonical Student Career Report -> Institution/Admin field contract.
// This list mirrors STUDENT_PREMIUM_REPORT exactly. Supporting V2 outputs such
// as careerExploration are handled separately and must not inflate the
// canonical 20-section report coverage count.
export const STUDENT_CAREER_ADMIN_CONTRACT = Object.freeze([
  ['executive_snapshot','Executive Snapshot',['executiveSnapshot','executiveSummary','snapshot','reflection.statement','bundleTitle']],
  ['interest_personality','Interests & Personality Tendencies',['scores.riasecCode','scores.big5']],
  ['strengths_values','Strengths, Values & Preferences',['intake.likedSubjects','intake.hobbies','intake.curiosity','scores.values']],
  ['developmental_context','Developmental & Academic Context',['intake']],
  ['riasec_profile','Career Interest Profile',['scores.riasecCode','scores.riasec']],
  ['personality_profile','Personality Tendencies',['scores.big5']],
  ['career_values','Career Values',['scores.values']],
  ['reasoning_profile','Reasoning Sampler',['scores.reasoning']],
  ['decision_readiness','Career Decision Readiness',['scores.readinessPercent','scores.readiness']],
  ['adaptability','Adaptability & Career Resilience',['scores.adaptabilityPercent','scores.adaptability']],
  ['work_environment','Preferred Work Environment',['scores.environment','scores.workEnvironment','workEnvironment']],
  ['top_career_directions','Top Career Directions',['topCareerDirections']],
  ['alternative_careers','Alternative & Unexpected Careers',['alternativeCareers']],
  ['pathway_analysis','Non-Linear Pathway Analysis',['pathwayAnalysis','pathways']],
  ['stream_analysis','Stream & Subject Scenarios',['streamAnalysis','streamScenarios']],
  ['education_roadmap','Education Roadmap',['educationRoadmap','education']],
  ['skills_evidence','Skills & Evidence Plan',['skillsEvidence','skillsPlan']],
  ['affordability','Affordability, Scholarships & Friction',['affordability','friction']],
  ['action_roadmap','90-Day Career Action Roadmap',['reflection.recommendedNextStep','actionRoadmap','actionPlan']],
  ['counsellor_review','Counsellor Conversation & Limitations',['counsellorReview','reviewLimitations']]
]);

const ASSESSMENT_GATED_SECTIONS = new Set([
  'interest_personality','riasec_profile','personality_profile','career_values','reasoning_profile',
  'decision_readiness','adaptability','work_environment'
]);

function readPath(source, path) { return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source); }

// A serialized field is only available when it contains substantive evidence.
// The serializer intentionally normalizes absent objects/arrays to {} / [], so
// `value !== undefined` is not sufficient to establish report coverage.
function hasMeaningfulValue(value) {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

export function readReportField(source, paths=[]) {
  for (const path of paths) {
    const value = readPath(source, path);
    if (hasMeaningfulValue(value)) return value;
  }
  return undefined;
}

function assessmentSource(report, id) {
  const coverage = getAssessmentEvidenceCoverage(report);
  return coverage.sections.find(section => section.id === id)?.assessed ? 'assessed' : null;
}

export function buildInstitutionCareerReflection(report) {
  const source = report || {};
  const decision = buildDecisionSupportCoverage(source);
  return STUDENT_CAREER_ADMIN_CONTRACT.map(([id,title,paths]) => {
    const value = readReportField(source, paths);
    const gated = ASSESSMENT_GATED_SECTIONS.has(id);
    const assessedSource = assessmentSource(source, id);
    let evidenceSource = assessedSource;

    // Assessment-gated sections may contain stale/legacy serialized values even
    // when the current V2 evidence layer says the assessment was not produced.
    // Never promote those values into an assessed or derived result.
    if (gated && !assessedSource) {
      evidenceSource = 'not_assessed';
    } else if (!evidenceSource && id === 'education_roadmap' && decision.education_roadmap.source === 'career_catalogue') {
      evidenceSource = 'career_catalogue';
    } else if (!evidenceSource && id === 'stream_analysis' && decision.stream_subject_scenarios.source === 'career_catalogue') {
      evidenceSource = 'career_catalogue';
    } else if (!evidenceSource && id === 'affordability') {
      evidenceSource = decision.affordability.source;
    } else if (!evidenceSource && value !== undefined) {
      evidenceSource = 'derived_from_assessment';
    } else if (!evidenceSource) {
      evidenceSource = 'unavailable';
    }

    const available = value !== undefined && (!gated || Boolean(assessedSource));
    return { id, title, available, source: evidenceSource, value: available ? value : undefined };
  });
}

export const INSTITUTION_CAREER_EXPLORATION_FIELD = Object.freeze({
  id: 'career_directions_supporting_output',
  title: 'Career Directions to Explore',
  paths: ['careerExploration']
});

export function readInstitutionCareerExploration(report) {
  return readReportField(report || {}, INSTITUTION_CAREER_EXPLORATION_FIELD.paths);
}
