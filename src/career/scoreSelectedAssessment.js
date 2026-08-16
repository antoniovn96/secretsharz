import { ASSESSMENT_VERSION, scoreLikert, cosineSimilarity } from './careerAssessmentBlueprint.js';
import { getItemsForBundle, getItemsForFamilies, resolveBundle } from './assessmentSelection.js';

const emptyResult = () => ({
  version: ASSESSMENT_VERSION,
  selectedFamilyIds: [],
  riasec: null,
  riasecCode: null,
  big5: null,
  values: null,
  reasoning: null,
  skills: null,
  learning: null,
});

export function scoreSelectedAssessment(answers = {}, { bundleId = null, familyIds = null } = {}) {
  const bundle = bundleId ? resolveBundle(bundleId) : null;
  const selectedFamilyIds = [...new Set(familyIds || bundle?.familyIds || [])];
  const items = bundleId ? getItemsForBundle(bundleId) : getItemsForFamilies(selectedFamilyIds);
  const result = emptyResult();
  result.selectedFamilyIds = selectedFamilyIds;

  const has = domain => selectedFamilyIds.includes(domain);
  if (has('interest')) result.riasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  if (has('personality')) result.big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  if (has('work_values')) result.values = {};
  if (has('aptitude_skills')) result.reasoning = { correct: 0, total: 0, verbal: 0, numerical: 0, logical: 0 };
  if (has('aptitude_skills')) result.skills = {};
  if (has('learning')) result.learning = {};

  for (const item of items) {
    const value = answers?.[item.id];
    if (value === undefined || value === null || value === '') continue;

    if (item.type === 'objective') {
      if (!result.reasoning) continue;
      result.reasoning.total += 1;
      if (Number(value) === item.correct) {
        result.reasoning.correct += 1;
        result.reasoning[item.construct] += 1;
      }
      continue;
    }

    if (item.type === 'likert5') {
      const score = scoreLikert(Number(value), item.reverse === true);
      if (item.domain === 'interest' && result.riasec && item.riasecCode) result.riasec[item.riasecCode] += score;
      else if (item.domain === 'personality' && result.big5 && item.trait) result.big5[item.trait] += score;
      else if (item.domain === 'work_values' && result.values && item.valueKey) result.values[item.valueKey] = (result.values[item.valueKey] || 0) + score;
      else if (item.domain === 'skills' && result.skills && item.skillKey) result.skills[item.skillKey] = (result.skills[item.skillKey] || 0) + score;
      else if (item.domain === 'learning' && result.learning && item.learningKey) result.learning[item.learningKey] = (result.learning[item.learningKey] || 0) + score;
    }
  }

  if (result.riasec) {
    result.riasecCode = Object.entries(result.riasec)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code]) => code)
      .join('');
  }

  if (result.reasoning && result.reasoning.total > 0) {
    result.reasoning.accuracy = result.reasoning.correct / result.reasoning.total;
  }

  return result;
}

export { cosineSimilarity };
