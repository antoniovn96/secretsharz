/**
 * Secret Sharz / VidyaVantage Canonical Career Assessment Portfolio
 *
 * Source of product scope: Career Guidance Module Master Specification v1.0.
 *
 * The source currently defines 17 independent assessment products in section 7,
 * plus two supporting/non-test layers:
 *   - Career Narrative / Aspirations
 *   - Context & Constraints
 *
 * The founder referred to the portfolio as "about 16 tests" in the continuation
 * conversation. We therefore DO NOT remove, merge, or silently reinterpret any
 * source-defined construct here. The canonical source-defined portfolio remains
 * 17 until the founder explicitly resolves the count discrepancy.
 *
 * This manifest does not claim that all instruments are implemented or
 * psychometrically validated. It is the product-domain contract.
 */

export const CAREER_ASSESSMENT_PORTFOLIO_VERSION = '1.0.0';

const entry = ({
  id,
  title,
  shortTitle,
  construct,
  category = 'assessment',
  implementationStatus = 'planned',
  psychometricStatus = 'not_validated',
}) => Object.freeze({
  id,
  title,
  shortTitle,
  construct,
  category,
  implementationStatus,
  psychometricStatus,
  independentlyPurchasable: category === 'assessment',
  bundleEligible: category === 'assessment',
});

export const CANONICAL_CAREER_ASSESSMENTS = Object.freeze([
  entry({
    id: 'career_interest_inventory',
    title: 'Career Interest / RIASEC',
    shortTitle: 'Career Interests',
    construct: 'Vocational interests across Realistic, Investigative, Artistic, Social, Enterprising and Conventional domains.',
    implementationStatus: 'draft_implemented',
    psychometricStatus: 'draft_not_validated',
  }),
  entry({
    id: 'career_aptitude',
    title: 'Career Aptitude',
    shortTitle: 'Career Aptitude',
    construct: 'Observed performance across selected verbal, numerical, logical, analytical and related task domains.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'aptitude_confidence',
    title: 'Aptitude Confidence',
    shortTitle: 'Aptitude Confidence',
    construct: 'Self-perceived confidence in ability to perform relevant task domains.',
  }),
  entry({
    id: 'career_values',
    title: 'Career Values',
    shortTitle: 'Career Values',
    construct: 'Priorities and trade-offs in education and work.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'personality_work_style',
    title: 'Personality / Work Style',
    shortTitle: 'Personality / Work Style',
    construct: 'Non-clinical work/study tendencies relevant to career exploration.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'career_decision_readiness',
    title: 'Career Decision Readiness',
    shortTitle: 'Decision Readiness',
    construct: 'Current career exploration and decision-process readiness.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'career_decision_self_efficacy',
    title: 'Career Decision Self-Efficacy',
    shortTitle: 'Decision Self-Efficacy',
    construct: 'Confidence in self-appraisal, information gathering, option evaluation and planning.',
  }),
  entry({
    id: 'career_adaptability',
    title: 'Career Adaptability',
    shortTitle: 'Career Adaptability',
    construct: 'Adaptation to transitions and changing career conditions.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'career_resilience',
    title: 'Career Resilience',
    shortTitle: 'Career Resilience',
    construct: 'Persistence, recovery, adjustment and response to setbacks.',
  }),
  entry({
    id: 'work_environment_preferences',
    title: 'Work Environment Preferences',
    shortTitle: 'Work Environment',
    construct: 'Autonomy, structure, pace, people contact, collaboration and related environment preferences.',
    implementationStatus: 'draft_implemented',
  }),
  entry({
    id: 'academic_subject_fit',
    title: 'Academic / Subject Fit',
    shortTitle: 'Subject Fit',
    construct: 'Subject interests, confidence and academic context.',
  }),
  entry({
    id: 'career_knowledge',
    title: 'Career Knowledge',
    shortTitle: 'Career Knowledge',
    construct: 'Understanding of occupations, qualifications, routes and requirements.',
  }),
  entry({
    id: 'career_exploration_behaviour',
    title: 'Career Exploration Behaviour',
    shortTitle: 'Exploration Behaviour',
    construct: 'Research, conversation, project and exposure behaviours.',
  }),
  entry({
    id: 'career_planning_goal_setting',
    title: 'Career Planning & Goal Setting',
    shortTitle: 'Career Planning',
    construct: 'Goal clarity, action sequencing and contingency planning.',
  }),
  entry({
    id: 'employability_21st_century_skills',
    title: 'Employability / 21st-Century Skills',
    shortTitle: 'Employability Skills',
    construct: 'Communication, collaboration, critical thinking, digital fluency and related evidence.',
  }),
  entry({
    id: 'entrepreneurship_orientation',
    title: 'Entrepreneurship Orientation',
    shortTitle: 'Entrepreneurship',
    construct: 'Initiative, opportunity recognition, experimentation and related behaviours.',
  }),
  entry({
    id: 'digital_ai_career_readiness',
    title: 'Digital / AI Career Readiness',
    shortTitle: 'Digital / AI Readiness',
    construct: 'AI use, digital judgement and career-readiness behaviours.',
  }),
]);

export const CAREER_SUPPORTING_LAYERS = Object.freeze([
  entry({
    id: 'career_narrative_aspirations',
    title: 'Career Narrative / Aspirations',
    shortTitle: 'Career Narrative',
    construct: 'Aspirations and open-ended reflections.',
    category: 'supporting',
  }),
  entry({
    id: 'context_constraints',
    title: 'Context & Constraints',
    shortTitle: 'Context & Constraints',
    construct: 'Location, affordability, family/context and other planning constraints.',
    category: 'context',
  }),
]);

export const CAREER_ASSESSMENT_COUNT = CANONICAL_CAREER_ASSESSMENTS.length;

export const CAREER_DIRECTION_TRIO_MODULE_IDS = Object.freeze([
  'career_interest_inventory',
  'career_aptitude',
  'career_values',
]);

export const FULL_CAREER_INTELLIGENCE_MODULE_IDS = Object.freeze(
  CANONICAL_CAREER_ASSESSMENTS.map((assessment) => assessment.id),
);

export function getCanonicalCareerAssessment(id) {
  return CANONICAL_CAREER_ASSESSMENTS.find((assessment) => assessment.id === id) || null;
}

export function getCanonicalCareerAssessmentByTitle(title) {
  const normalized = String(title || '').trim().toLowerCase();
  return (
    CANONICAL_CAREER_ASSESSMENTS.find(
      (assessment) => assessment.title.toLowerCase() === normalized,
    ) || null
  );
}

export function isCareerDirectionTrioModule(id) {
  return CAREER_DIRECTION_TRIO_MODULE_IDS.includes(id);
}

export function isFullCareerIntelligenceModule(id) {
  return FULL_CAREER_INTELLIGENCE_MODULE_IDS.includes(id);
}

export function getCareerAssessmentPortfolioSummary() {
  return {
    version: CAREER_ASSESSMENT_PORTFOLIO_VERSION,
    assessmentCount: CANONICAL_CAREER_ASSESSMENTS.length,
    supportingLayerCount: CAREER_SUPPORTING_LAYERS.length,
    assessmentIds: FULL_CAREER_INTELLIGENCE_MODULE_IDS,
    careerDirectionTrio: CAREER_DIRECTION_TRIO_MODULE_IDS,
  };
}
