// Bridge between the existing assessment question bank and the versioned
// career-v1.0 assessment engine. This keeps the legacy question content intact
// while giving the new engine one canonical question-map shape.

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

const RIASEC_BANKS = [
  realisticQuestions,
  investigativeQuestions,
  artisticQuestions,
  socialQuestions,
  enterprisingQuestions,
  conventionalQuestions,
];

const DEMOGRAPHIC_DIMENSIONS = Object.freeze({
  dem_05: 'decision_maturity',
  dem_06: 'values',
  dem_07: 'values',
  dem_08: 'work_style',
  dem_09: 'resilience',
  dem_10: 'resilience',
});

function toQuestionEntry(question, overrides = {}) {
  return {
    id: question.id,
    dimension: overrides.dimension,
    code: question.riasecKey,
    weight: Number(question.weight) || 1,
    type: question.type,
    scaleMin: question.scaleMin,
    scaleMax: question.scaleMax,
    options: question.options,
  };
}

export function buildCanonicalQuestionMap() {
  const map = {};

  demographicQuestions.forEach((question) => {
    const dimension = DEMOGRAPHIC_DIMENSIONS[question.id];
    if (dimension) map[question.id] = toQuestionEntry(question, { dimension });
  });

  RIASEC_BANKS.flat().forEach((question) => {
    map[question.id] = toQuestionEntry(question, { dimension: 'interests' });
  });

  extracurricularQuestions.forEach((question) => {
    // Existing extracurricular items do not carry a RIASEC key consistently;
    // preserve them in the map only when they already declare a scored key or
    // dimension. Unclassified items remain available to the legacy UI.
    if (question.riasecKey || question.dimension) {
      map[question.id] = toQuestionEntry(question, {
        dimension: question.dimension || 'interests',
      });
    }
  });

  return Object.freeze(map);
}

export const CANONICAL_QUESTION_MAP = buildCanonicalQuestionMap();

export function getCanonicalQuestion(questionId) {
  return CANONICAL_QUESTION_MAP[questionId] || null;
}
