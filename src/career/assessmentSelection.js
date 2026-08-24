import {
  RIASEC_ITEMS,
  BIG5_ITEMS,
  VALUE_ITEMS,
  REASONING_ITEMS,
  READINESS_ITEMS,
  ENVIRONMENT_ITEMS,
  ADAPTABILITY_ITEMS,
  calculateAge,
  ageBandFor,
  PATHWAYS,
} from './careerAssessmentBlueprint.js';
import { getBundleByFamilies as getCanonicalBundleByFamilies, getTestBundle, TEST_BUNDLES } from './testBundleCatalogue.js';

export const CONTEXT_FIELDS = Object.freeze([
  'dob', 'age', 'ageBand', 'educationStage', 'board', 'className', 'stream',
  'academicAverage', 'institutionName', 'likedSubjects', 'dislikedSubjects',
  'hobbies', 'curiosity', 'goal', 'currentRole', 'employer', 'experienceYears',
  'qualification', 'dailyDuties', 'skills', 'professionalIntent', 'workMode',
  'goodParts', 'badParts', 'targetDirection', 'targetRole', 'department',
  'roleResponsibilities', 'roleTechnical', 'roleBehavioural'
]);

export const LEARNING_ITEMS = Object.freeze([
  ['active', 'I learn better when I can practise a concept rather than only read or listen to it.'],
  ['visual', 'Diagrams, demonstrations or visual examples help me understand new ideas.'],
  ['discussion', 'Talking through an idea with another person helps me develop my understanding.'],
  ['independent', 'I prefer having time to explore and practise a topic independently.'],
  ['structure', 'I learn best when the task has clear steps and expectations.'],
  ['feedback', 'Timely feedback helps me improve how I learn or practise.'],
  ['application', 'I understand ideas more deeply when I can connect them to real situations.'],
  ['pace', 'I prefer learning experiences that let me revisit difficult material at my own pace.'],
  ['collaboration', 'Working with others can improve my learning when the roles are clear.'],
  ['challenge', 'I enjoy learning activities that require me to solve unfamiliar problems.'],
].map(([key, question], i) => ({
  id: `learning_${i + 1}`,
  domain: 'learning',
  type: 'likert5',
  question,
  construct: `learning_${key}`,
  learningKey: key,
  options: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
  scaleMin: 1,
  scaleMax: 5,
})));

export const SKILL_ITEMS = Object.freeze([
  ['communication', 'I can explain ideas clearly to people with different levels of knowledge.'],
  ['problemSolving', 'I can break an unfamiliar problem into smaller steps.'],
  ['digital', 'I can learn and use digital tools needed for study or work.'],
  ['teamwork', 'I can contribute reliably when working as part of a team.'],
  ['initiative', 'I can identify a useful next step without always waiting for instructions.'],
  ['organisation', 'I can organise tasks, information and deadlines effectively.'],
  ['research', 'I can find, compare and evaluate information before using it.'],
  ['presentation', 'I can present my ideas in a structured way.'],
  ['adaptation', 'I can learn a new method when the previous approach is no longer effective.'],
  ['selfManagement', 'I can manage my effort and attention across a longer task.'],
].map(([key, question], i) => ({
  id: `skill_${i + 1}`,
  domain: 'skills',
  type: 'likert5',
  question,
  construct: `skill_${key}`,
  skillKey: key,
  options: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
  scaleMin: 1,
  scaleMax: 5,
})));

const FAMILY_ITEMS = Object.freeze({ interest: RIASEC_ITEMS, personality: BIG5_ITEMS, aptitude_skills: [...REASONING_ITEMS, ...SKILL_ITEMS], work_values: VALUE_ITEMS, learning: LEARNING_ITEMS });

// Guidance indicators are not separate commercial test families. They are
// embedded only in the complete five-family bundle because the full Career
// Intelligence report explicitly promises evidence for these dimensions.
// Partial bundles never collect or interpret them silently.
export const FULL_GUIDANCE_ITEMS = Object.freeze([
  ...READINESS_ITEMS,
  ...ENVIRONMENT_ITEMS,
  ...ADAPTABILITY_ITEMS,
]);

export function getSelectedFamilyIds(bundleId) { const bundle = getTestBundle(bundleId); return bundle ? [...bundle.familyIds] : []; }
export function getItemsForFamilies(familyIds = []) { const ids = [...new Set(familyIds)]; return ids.flatMap(id => FAMILY_ITEMS[id] || []); }
export function isFullCareerIntelligenceBundle(bundleId) { const bundle = getTestBundle(bundleId); return Boolean(bundle && bundle.familyCount === 5); }
export function getItemsForBundle(bundleId) {
  const base = getItemsForFamilies(getSelectedFamilyIds(bundleId));
  return isFullCareerIntelligenceBundle(bundleId) ? [...base, ...FULL_GUIDANCE_ITEMS] : base;
}
export function getBundleByFamilies(familyIds = []) { return getCanonicalBundleByFamilies(familyIds); }
export function getDefaultBundle() { return TEST_BUNDLES.find(bundle => bundle.familyCount === 5) || TEST_BUNDLES[TEST_BUNDLES.length - 1]; }
export function resolveBundle(bundleId) { return getTestBundle(bundleId) || getDefaultBundle(); }
export function prepareContext(intake = {}) { const age = intake.age || calculateAge(intake.dob); return { ...intake, age: age == null ? null : Number(age), ageBand: intake.ageBand || (age == null ? null : ageBandFor(Number(age))) }; }
export function pathwayAllowsBundle(pathway, bundle) { if (!bundle) return false; if (pathway === PATHWAYS.HR) return bundle.familyIds.some(id => ['personality','aptitude_skills','work_values','learning'].includes(id)); return bundle.familyIds.length > 0; }
export const TEST_FAMILY_ITEM_COUNTS = Object.freeze(Object.fromEntries(Object.entries(FAMILY_ITEMS).map(([key, items]) => [key, items.length])));
export const FULL_GUIDANCE_ITEM_COUNT = FULL_GUIDANCE_ITEMS.length;
