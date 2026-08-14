import {
  demographicQuestions,
  realisticQuestions,
  investigativeQuestions,
  artisticQuestions,
  socialQuestions,
  enterprisingQuestions,
  conventionalQuestions,
  extracurricularQuestions,
} from '../data/assessmentQuestions';

const DIMENSION_BY_DEMOGRAPHIC_ID = Object.freeze({
  dem_05: 'decision_maturity',
  dem_06: 'values',
  dem_07: 'values',
  dem_08: 'work_style',
  dem_09: 'resilience',
  dem_10: 'resilience',
});

const RIASEC_BANKS = Object.freeze([
  realisticQuestions,
  investigativeQuestions,
  artisticQuestions,
  socialQuestions,
  enterprisingQuestions,
  conventionalQuestions,
]);

function toCanonicalQuestion(question, dimension, extra = {}) {
  return Object.freeze({
    id: question.id,
    section: question.section,
    dimension,
    type: question.type,
    question: question.question,
    options: question.options || [],
    scaleMin: question.scaleMin,
    scaleMax: question.scaleMax,
    scaleLabels: question.scaleLabels,
    weight: question.weight || 1,
    ...extra,
  });
}

export const canonicalAssessmentQuestions = Object.freeze([
  ...demographicQuestions
    .filter((question) => DIMENSION_BY_DEMOGRAPHIC_ID[question.id])
    .map((question) => toCanonicalQuestion(question, DIMENSION_BY_DEMOGRAPHIC_ID[question.id])),
  ...RIASEC_BANKS.flat()
    .filter((question) => question.riasecKey)
    .map((question) => toCanonicalQuestion(question, 'interests', { code: question.riasecKey })),
  ...extracurricularQuestions
    .map((question) => toCanonicalQuestion(question, 'motivation')),
]);

export const canonicalAssessmentQuestionMap = Object.freeze(
  Object.fromEntries(canonicalAssessmentQuestions.map((question) => [question.id, question])),
);

export const questionIdsByDimension = Object.freeze(
  canonicalAssessmentQuestions.reduce((groups, question) => {
    if (!groups[question.dimension]) groups[question.dimension] = [];
    groups[question.dimension].push(question.id);
    return groups;
  }, {}),
);

export function getQuestionsForDimension(dimension) {
  return canonicalAssessmentQuestions.filter((question) => question.dimension === dimension);
}

export function getQuestion(questionId) {
  return canonicalAssessmentQuestionMap[questionId] || null;
}

export function validateAnswer(questionId, answer) {
  const question = getQuestion(questionId);
  if (!question) return { valid: false, reason: 'unknown_question' };

  if (question.type === 'scale') {
    const value = Number(answer);
    return {
      valid: Number.isFinite(value)
        && value >= question.scaleMin
        && value <= question.scaleMax,
      reason: 'invalid_scale_value',
    };
  }

  if (question.type === 'single') {
    return {
      valid: question.options.includes(answer),
      reason: 'invalid_option',
    };
  }

  if (question.type === 'multiple') {
    return {
      valid: Array.isArray(answer) && answer.every((value) => question.options.includes(value)),
      reason: 'invalid_options',
    };
  }

  return { valid: true, reason: null };
}
