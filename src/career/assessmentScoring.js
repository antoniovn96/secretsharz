import { RIASEC_ITEMS, BIG5_ITEMS, VALUE_ITEMS, REASONING_ITEMS, READINESS_ITEMS, ENVIRONMENT_ITEMS, ADAPTABILITY_ITEMS, scoreLikert } from './careerAssessmentBlueprint.js';

export const SCORING_SCHEMA_VERSION = '2.1.0';
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;
export const RIASEC_CODES = Object.freeze(['R','I','A','S','E','C']);
export const BIG5_CODES = Object.freeze(['O','C','E','A','N']);

// Deliberately conservative: a scale is scored only when every item belonging
// to that scale has a valid response. This avoids silently prorating a missing
// item into a psychometric-looking score. The platform can still save partial
// progress, but partial progress is not reported as an assessed scale.
export const COMPLETION_RULES = Object.freeze({
  multiItemScale: 'all_items_required',
  objectiveSampler: 'all_items_required',
  singleItemPreference: 'single_item_descriptive_only',
  missingItemHandling: 'do_not_score',
});

function validAnswer(value) {
  if (value === undefined || value === null || value === '') return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= LIKERT_MIN && n <= LIKERT_MAX;
}

function answeredCount(items, answers) {
  return items.reduce((n, item) => n + (item.type === 'objective'
    ? (answers?.[item.id] !== undefined && answers?.[item.id] !== null && answers?.[item.id] !== '' ? 1 : 0)
    : (validAnswer(answers?.[item.id]) ? 1 : 0)), 0);
}

function scaleSummary(items, answers) {
  const answered = answeredCount(items, answers);
  const total = items.length;
  return {
    answered,
    total,
    completionPct: total ? Math.round((answered / total) * 100) : 0,
    complete: total > 0 && answered === total,
  };
}

function meanToPercent(mean) {
  if (mean == null) return null;
  return Math.round(((mean - LIKERT_MIN) / (LIKERT_MAX - LIKERT_MIN)) * 100);
}

function scoreLikertScale(items, answers) {
  const completion = scaleSummary(items, answers);
  if (!completion.complete) return { ...completion, rawMean: null, percent: null, status: 'not_scored' };
  const scores = items.map(item => scoreLikert(answers[item.id], item.reverse)).filter(value => value != null);
  const rawMean = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : null;
  return { ...completion, rawMean, percent: meanToPercent(rawMean), status: 'scored' };
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] ||= []).push(item);
    return groups;
  }, {});
}

function scoreLikertDomain(items, answers, keyFn) {
  const groups = groupBy(items, keyFn);
  const result = {};
  for (const [key, group] of Object.entries(groups)) result[key] = scoreLikertScale(group, answers);
  return result;
}

function topCodes(scores) {
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1] || RIASEC_CODES.indexOf(a[0]) - RIASEC_CODES.indexOf(b[0]));
  return ordered.slice(0, 3).map(([code]) => code);
}

function topCodeTieStatus(scores) {
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1] || RIASEC_CODES.indexOf(a[0]) - RIASEC_CODES.indexOf(b[0]));
  if (ordered.length < 4) return 'unknown';
  return ordered[2][1] === ordered[3][1] ? 'tied_at_third' : 'clear';
}

function scoreReasoning(items, answers) {
  const completion = scaleSummary(items, answers);
  if (!completion.complete) {
    return { ...completion, rawScore: null, maxScore: items.length, percent: null, subscales: {}, status: 'not_scored' };
  }
  let correct = 0;
  const subscales = {};
  for (const item of items) {
    const isCorrect = Number(answers[item.id]) === Number(item.correct);
    if (isCorrect) correct += 1;
    subscales[item.construct] ||= { correct: 0, total: 0 };
    subscales[item.construct].total += 1;
    if (isCorrect) subscales[item.construct].correct += 1;
  }
  for (const sub of Object.values(subscales)) sub.percent = Math.round((sub.correct / sub.total) * 100);
  return { ...completion, rawScore: correct, maxScore: items.length, percent: Math.round((correct / items.length) * 100), subscales, status: 'scored', marking: '1 mark per correct response; no negative marking' };
}

function scorePreferenceItems(items, answers, keyField) {
  const result = {};
  for (const item of items) {
    const value = scoreLikert(answers?.[item.id], item.reverse);
    result[item[keyField]] = value == null ? null : value;
  }
  return result;
}

export function scoreAssessmentV21(answers = {}, { selectedFamilyIds = [], fullGuidance = false } = {}) {
  const selected = new Set(selectedFamilyIds);
  const includeGuidance = fullGuidance || selected.size === 5;
  const result = {
    scoringSchemaVersion: SCORING_SCHEMA_VERSION,
    completionRule: COMPLETION_RULES,
    selectedFamilyIds: [...selected],
    assessmentStatus: 'incomplete',
    riasec: null,
    riasecMeans: null,
    riasecPercent: null,
    riasecCode: null,
    riasecCodeStatus: 'not_assessed',
    big5: null,
    big5Means: null,
    big5Percent: null,
    values: null,
    reasoning: null,
    skills: null,
    learning: null,
    readiness: null,
    readinessPercent: null,
    environment: null,
    adaptability: null,
    adaptabilityPercent: null,
    quality: {},
  };

  if (selected.has('interest')) {
    const scales = scoreLikertDomain(RIASEC_ITEMS, answers, item => item.riasecKey);
    const complete = RIASEC_CODES.every(code => scales[code]?.complete);
    result.quality.riasec = { complete, scales };
    if (complete) {
      result.riasecMeans = Object.fromEntries(RIASEC_CODES.map(code => [code, Number(scales[code].rawMean.toFixed(3))]));
      result.riasecPercent = Object.fromEntries(RIASEC_CODES.map(code => [code, scales[code].percent]));
      result.riasec = Object.fromEntries(RIASEC_CODES.map(code => [code, Math.round(scales[code].rawMean * 6)]));
      result.riasecCode = topCodes(result.riasecMeans).join('');
      result.riasecCodeStatus = topCodeTieStatus(result.riasecMeans);
    }
  }

  if (selected.has('personality')) {
    const scales = scoreLikertDomain(BIG5_ITEMS, answers, item => item.big5Key);
    const complete = BIG5_CODES.every(code => scales[code]?.complete);
    result.quality.big5 = { complete, scales };
    if (complete) {
      result.big5Means = Object.fromEntries(BIG5_CODES.map(code => [code, Number(scales[code].rawMean.toFixed(3))]));
      result.big5Percent = Object.fromEntries(BIG5_CODES.map(code => [code, scales[code].percent]));
      result.big5 = Object.fromEntries(BIG5_CODES.map(code => [code, Math.round(scales[code].rawMean * 6)]));
    }
  }

  if (selected.has('work_values')) {
    const completion = scaleSummary(VALUE_ITEMS, answers);
    result.quality.values = completion;
    result.values = scorePreferenceItems(VALUE_ITEMS, answers, 'valueKey');
  }

  if (selected.has('aptitude_skills')) {
    result.reasoning = scoreReasoning(REASONING_ITEMS, answers);
    const skillScales = scoreLikertDomain(itemsForSkillAnswers(), answers, item => item.skillKey);
    const skillComplete = Object.values(skillScales).every(scale => scale.complete);
    result.quality.skills = { complete: skillComplete, scales: skillScales };
    if (skillComplete) {
      result.skills = Object.fromEntries(Object.entries(skillScales).map(([key, scale]) => [key, scale.percent]));
      result.skills.percent = Math.round(Object.values(skillScales).reduce((sum, scale) => sum + scale.percent, 0) / Object.keys(skillScales).length);
    }
  }

  if (selected.has('learning')) {
    const learningItems = itemsForLearningAnswers();
    const scales = scoreLikertDomain(learningItems, answers, item => item.learningKey);
    const complete = Object.values(scales).every(scale => scale.complete);
    result.quality.learning = { complete, scales };
    if (complete) result.learning = Object.fromEntries(Object.entries(scales).map(([key, scale]) => [key, scale.percent]));
  }

  if (includeGuidance) {
    const readiness = scoreLikertDomain(READINESS_ITEMS, answers, item => item.construct.replace('readiness_', ''));
    const environment = scoreLikertDomain(ENVIRONMENT_ITEMS, answers, item => item.environmentKey);
    const adaptability = scoreLikertDomain(ADAPTABILITY_ITEMS, answers, item => item.construct.replace('adaptability_', ''));
    result.quality.readiness = { complete: Object.values(readiness).every(x => x.complete), scales: readiness };
    result.quality.environment = { complete: Object.values(environment).every(x => x.complete), scales: environment };
    result.quality.adaptability = { complete: Object.values(adaptability).every(x => x.complete), scales: adaptability };
    if (result.quality.readiness.complete) {
      result.readiness = Object.fromEntries(Object.entries(readiness).map(([key, scale]) => [key, Math.round(scale.rawMean)]));
      result.readinessPercent = Math.round(Object.values(readiness).reduce((sum, scale) => sum + scale.percent, 0) / Object.keys(readiness).length);
    }
    if (result.quality.environment.complete) result.environment = Object.fromEntries(Object.entries(environment).map(([key, scale]) => [key, Math.round(scale.rawMean)]));
    if (result.quality.adaptability.complete) {
      result.adaptability = Object.fromEntries(Object.entries(adaptability).map(([key, scale]) => [key, Math.round(scale.rawMean)]));
      result.adaptabilityPercent = Math.round(Object.values(adaptability).reduce((sum, scale) => sum + scale.percent, 0) / Object.keys(adaptability).length);
    }
  }

  const familyStatuses = [];
  if (selected.has('interest')) familyStatuses.push(Boolean(result.quality.riasec?.complete));
  if (selected.has('personality')) familyStatuses.push(Boolean(result.quality.big5?.complete));
  if (selected.has('work_values')) familyStatuses.push(Boolean(result.quality.values?.complete));
  if (selected.has('aptitude_skills')) familyStatuses.push(Boolean(result.quality.skills?.complete && result.reasoning?.status === 'scored'));
  if (selected.has('learning')) familyStatuses.push(Boolean(result.quality.learning?.complete));
  result.assessmentStatus = familyStatuses.length && familyStatuses.every(Boolean) && (!includeGuidance || (result.quality.readiness?.complete && result.quality.environment?.complete && result.quality.adaptability?.complete)) ? 'complete' : 'incomplete';
  return result;
}

// assessmentSelection.js owns these optional families so the core blueprint
// remains the single source of truth for the primary assessment families.
function itemsForSkillAnswers() {
  return [
    ['communication','I can explain ideas clearly to people with different levels of knowledge.'],
    ['problemSolving','I can break an unfamiliar problem into smaller steps.'],
    ['digital','I can learn and use digital tools needed for study or work.'],
    ['teamwork','I can contribute reliably when working as part of a team.'],
    ['initiative','I can identify a useful next step without always waiting for instructions.'],
    ['organisation','I can organise tasks, information and deadlines effectively.'],
    ['research','I can find, compare and evaluate information before using it.'],
    ['presentation','I can present my ideas in a structured way.'],
    ['adaptation','I can learn a new method when the previous approach is no longer effective.'],
    ['selfManagement','I can manage my effort and attention across a longer task.'],
  ].map(([key, question], i) => ({ id:`skill_${i+1}`, domain:'skills', type:'likert5', question, construct:`skill_${key}`, skillKey:key, scaleMin:1, scaleMax:5 }));
}

function itemsForLearningAnswers() {
  return [
    ['active','I learn better when I can practise a concept rather than only read or listen to it.'],
    ['visual','Diagrams, demonstrations or visual examples help me understand new ideas.'],
    ['discussion','Talking through an idea with another person helps me develop my understanding.'],
    ['independent','I prefer having time to explore and practise a topic independently.'],
    ['structure','I learn best when the task has clear steps and expectations.'],
    ['feedback','Timely feedback helps me improve how I learn or practise.'],
    ['application','I understand ideas more deeply when I can connect them to real situations.'],
    ['pace','I prefer learning experiences that let me revisit difficult material at my own pace.'],
    ['collaboration','Working with others can improve my learning when the roles are clear.'],
    ['challenge','I enjoy learning activities that require me to solve unfamiliar problems.'],
  ].map(([key, question], i) => ({ id:`learning_${i+1}`, domain:'learning', type:'likert5', question, construct:`learning_${key}`, learningKey:key, scaleMin:1, scaleMax:5 }));
}
