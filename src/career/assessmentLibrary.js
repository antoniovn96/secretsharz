import { ALL_CORE_ITEMS, RIASEC_ITEMS, BIG5_ITEMS, VALUE_ITEMS, READINESS_ITEMS, ENVIRONMENT_ITEMS, ADAPTABILITY_ITEMS, REASONING_ITEMS } from './careerAssessmentBlueprint';

/**
 * VidyaVantage modular assessment catalogue.
 *
 * The modules intentionally remain separate from the combined Career Intelligence
 * battery. A completed module is a reusable result; upgrading a user should never
 * require retaking an already-valid module merely to unlock a richer report.
 */
export const ASSESSMENT_LIBRARY_VERSION = '1.0.0';

export const ASSESSMENT_MODULES = Object.freeze([
  {
    id: 'career_interest_inventory',
    sku: 'ASSESSMENT_INTERESTS',
    title: 'Career Interest Inventory',
    shortTitle: 'Career Interests',
    construct: 'RIASEC vocational interests',
    sourceDomains: ['riasec'],
    itemIds: RIASEC_ITEMS.map(item => item.id),
    reportLabel: 'Interest Profile',
    individualPriceKey: 'assessment_interest',
    recommendedFor: ['student', 'working_professional'],
  },
  {
    id: 'personality_profile',
    sku: 'ASSESSMENT_PERSONALITY',
    title: 'Personality Profile',
    shortTitle: 'Personality',
    construct: 'Big Five personality tendencies',
    sourceDomains: ['big5'],
    itemIds: BIG5_ITEMS.map(item => item.id),
    reportLabel: 'Personality Tendencies',
    individualPriceKey: 'assessment_personality',
    recommendedFor: ['student', 'working_professional', 'hr_role_alignment'],
  },
  {
    id: 'career_aptitude_sampler',
    sku: 'ASSESSMENT_APTITUDE',
    title: 'Career Aptitude & Reasoning Sampler',
    shortTitle: 'Aptitude & Reasoning',
    construct: 'Observed reasoning performance across verbal, numerical and logical tasks',
    sourceDomains: ['reasoning'],
    itemIds: REASONING_ITEMS.map(item => item.id),
    reportLabel: 'Reasoning Profile',
    individualPriceKey: 'assessment_aptitude',
    recommendedFor: ['student', 'working_professional', 'hr_role_alignment'],
  },
  {
    id: 'work_values_assessment',
    sku: 'ASSESSMENT_VALUES',
    title: 'Work Values Assessment',
    shortTitle: 'Work Values',
    construct: 'Career and work-value priorities',
    sourceDomains: ['values'],
    itemIds: VALUE_ITEMS.map(item => item.id),
    reportLabel: 'Career Values',
    individualPriceKey: 'assessment_values',
    recommendedFor: ['student', 'working_professional', 'hr_role_alignment'],
  },
  {
    id: 'career_decision_readiness',
    sku: 'ASSESSMENT_DECISION_READINESS',
    title: 'Career Decision Readiness',
    shortTitle: 'Decision Readiness',
    construct: 'Current career exploration and decision-process behaviours',
    sourceDomains: ['readiness'],
    itemIds: READINESS_ITEMS.map(item => item.id),
    reportLabel: 'Decision Readiness',
    individualPriceKey: 'assessment_readiness',
    recommendedFor: ['student', 'working_professional'],
  },
  {
    id: 'work_environment_preferences',
    sku: 'ASSESSMENT_ENVIRONMENT',
    title: 'Work-Environment Preferences',
    shortTitle: 'Work Environment',
    construct: 'Preferences for autonomy, structure, people contact, pace and collaboration',
    sourceDomains: ['environment'],
    itemIds: ENVIRONMENT_ITEMS.map(item => item.id),
    reportLabel: 'Work Environment',
    individualPriceKey: 'assessment_environment',
    recommendedFor: ['student', 'working_professional', 'hr_role_alignment'],
  },
  {
    id: 'career_adaptability_profile',
    sku: 'ASSESSMENT_ADAPTABILITY',
    title: 'Career Adaptability Profile',
    shortTitle: 'Adaptability',
    construct: 'Adaptability and resilience-related career behaviours',
    sourceDomains: ['adaptability'],
    itemIds: ADAPTABILITY_ITEMS.map(item => item.id),
    reportLabel: 'Career Adaptability',
    individualPriceKey: 'assessment_adaptability',
    recommendedFor: ['student', 'working_professional', 'hr_role_alignment'],
  },
  {
    id: 'learning_preferences',
    sku: 'ASSESSMENT_LEARNING_PREFERENCES',
    title: 'Learning Preferences Evaluation',
    shortTitle: 'Learning Preferences',
    construct: 'Preferences for learning environments and study approaches',
    sourceDomains: [],
    itemIds: [],
    reportLabel: 'Learning Preferences',
    individualPriceKey: 'assessment_learning_preferences',
    recommendedFor: ['student', 'working_professional'],
    status: 'catalogue',
    note: 'Uses learning-preference language; it does not claim that a learner has a fixed learning style.',
  },
]);

export const ASSESSMENT_BUNDLES = Object.freeze([
  {
    id: 'career_discovery',
    sku: 'CAREER_DISCOVERY',
    title: 'Career Discovery',
    audience: ['student', 'working_professional'],
    tier: 'free',
    moduleIds: ['career_interest_inventory', 'personality_profile', 'career_aptitude_sampler', 'work_values_assessment'],
    reportPages: 5,
  },
  {
    id: 'full_career_intelligence',
    sku: 'FULL_CAREER_INTELLIGENCE',
    title: 'Full Career Intelligence',
    audience: ['student', 'working_professional'],
    tier: 'premium',
    moduleIds: ASSESSMENT_MODULES.filter(module => module.status !== 'catalogue').map(module => module.id),
    reportPages: 20,
  },
  {
    id: 'professional_transition',
    sku: 'PROFESSIONAL_TRANSITION',
    title: 'Professional Career Transition',
    audience: ['working_professional'],
    tier: 'premium',
    moduleIds: ['career_interest_inventory', 'personality_profile', 'career_aptitude_sampler', 'work_values_assessment', 'career_decision_readiness', 'work_environment_preferences', 'career_adaptability_profile'],
    reportPages: 20,
  },
  {
    id: 'hr_role_alignment',
    sku: 'HR_ROLE_ALIGNMENT',
    title: 'HR Role Alignment',
    audience: ['hr_role_alignment'],
    tier: 'premium',
    moduleIds: ['personality_profile', 'career_aptitude_sampler', 'work_values_assessment', 'work_environment_preferences', 'career_adaptability_profile'],
    reportPages: 20,
  },
]);

export function getAssessmentModule(moduleId) {
  return ASSESSMENT_MODULES.find(module => module.id === moduleId) || null;
}

export function getAssessmentBundle(bundleId) {
  return ASSESSMENT_BUNDLES.find(bundle => bundle.id === bundleId) || null;
}

export function getModulesForAudience(audience) {
  return ASSESSMENT_MODULES.filter(module => module.recommendedFor.includes(audience));
}

export function getModuleProgress(answers = {}) {
  return ASSESSMENT_MODULES.map(module => {
    const ids = module.itemIds || [];
    if (!ids.length) {
      return { ...module, answered: 0, total: 0, progress: 0, status: module.status === 'catalogue' ? 'catalogue' : 'not_started' };
    }
    const answered = ids.filter(id => answers[id] !== undefined && answers[id] !== null && answers[id] !== '').length;
    const progress = Math.round((answered / ids.length) * 100);
    return {
      ...module,
      answered,
      total: ids.length,
      progress,
      status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
    };
  });
}

export function getMissingModules(bundleId, answers = {}) {
  const bundle = getAssessmentBundle(bundleId);
  if (!bundle) return [];
  const progress = getModuleProgress(answers);
  return progress.filter(module => bundle.moduleIds.includes(module.id) && module.progress < 100);
}

export function getAssessmentLibrarySummary(answers = {}) {
  const progress = getModuleProgress(answers);
  const active = progress.filter(module => module.status !== 'catalogue');
  const completed = active.filter(module => module.status === 'completed').length;
  return {
    version: ASSESSMENT_LIBRARY_VERSION,
    totalModules: active.length,
    completedModules: completed,
    completionPercent: active.length ? Math.round((completed / active.length) * 100) : 0,
    modules: progress,
    combinedBatteryAvailable: ALL_CORE_ITEMS.length > 0,
  };
}
