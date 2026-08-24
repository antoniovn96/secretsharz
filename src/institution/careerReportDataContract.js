import { getAssessmentEvidenceCoverage } from '../career/assessmentCoverage.js';
import { buildDecisionSupportCoverage } from '../career/decisionSupportCoverage.js';

// Canonical Student Career Report -> Institution/Admin field contract.
// Paths mirror the persisted Student Career Assessment V2 report. Missing
// evidence remains missing; the Admin must never manufacture it.
export const STUDENT_CAREER_ADMIN_CONTRACT = Object.freeze([
  ['executive_snapshot','Executive Snapshot',['bundleTitle','reflection.statement']],
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
  ['career_directions','Career Directions to Explore',['careerExploration']],
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

function readPath(source, path) { return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source); }

export function readReportField(report, paths=[]) {
  for (const path of paths) {
    const value = readPath(report, path);
    if (value !== undefined && value !== null && value !== '') return value;
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
    let evidenceSource = value === undefined ? 'unavailable' : assessmentSource(source, id);

    if (!evidenceSource && id === 'career_directions' && decision.career_directions.source === 'derived_from_assessment') {
      evidenceSource = 'derived_from_assessment';
    } else if (!evidenceSource && id === 'education_roadmap' && decision.education_roadmap.source === 'career_catalogue') {
      evidenceSource = 'career_catalogue';
    } else if (!evidenceSource && id === 'stream_analysis' && decision.stream_subject_scenarios.source === 'career_catalogue') {
      evidenceSource = 'career_catalogue';
    } else if (!evidenceSource && value !== undefined) {
      // These are report outputs, not independently assessed test domains.
      evidenceSource = 'derived_from_assessment';
    }

    return { id, title, available: value !== undefined, source: evidenceSource, value };
  });
}
