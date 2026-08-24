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
  readiness: null,
  readinessPercent: null,
  environment: null,
  adaptability: null,
  adaptabilityPercent: null,
});

export function scoreSelectedAssessment(answers = {}, { bundleId = null, familyIds = null } = {}) {
  const bundle = bundleId ? resolveBundle(bundleId) : null;
  const selectedFamilyIds = [...new Set(familyIds || bundle?.familyIds || [])];
  const items = bundleId ? getItemsForBundle(bundleId) : getItemsForFamilies(selectedFamilyIds);
  const result = emptyResult();

  result.selectedFamilyIds = selectedFamilyIds;
  const isFullBundle = Boolean(bundle && bundle.familyCount === 5);
  if (selectedFamilyIds.includes('interest')) result.riasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  if (selectedFamilyIds.includes('personality')) result.big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  if (selectedFamilyIds.includes('work_values')) result.values = {};
  if (selectedFamilyIds.includes('aptitude_skills')) result.reasoning = { correct: 0, total: 0, verbal: 0, numerical: 0, logical: 0 };
  if (selectedFamilyIds.includes('aptitude_skills')) result.skills = {};
  if (selectedFamilyIds.includes('learning')) result.learning = {};

  // These indicators are intentionally available only in the complete bundle.
  // They are not presented as separately purchased psychometric families.
  if (isFullBundle) {
    result.readiness = {};
    result.environment = {};
    result.adaptability = {};
  }

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

    const score = scoreLikert(value, item.reverse);
    if (score == null) continue;
    if (item.riasecKey && result.riasec) result.riasec[item.riasecKey] += score;
    if (item.big5Key && result.big5) result.big5[item.big5Key] += score;
    if (item.valueKey && result.values) result.values[item.valueKey] = score;
    if (item.skillKey && result.skills) result.skills[item.skillKey] = score;
    if (item.learningKey && result.learning) result.learning[item.learningKey] = score;
    if (item.domain === 'readiness' && result.readiness) result.readiness[item.construct.replace('readiness_', '')] = score;
    if (item.environmentKey && result.environment) result.environment[item.environmentKey] = score;
    if (item.domain === 'adaptability' && result.adaptability) result.adaptability[item.construct.replace('adaptability_', '')] = score;
  }

  if (result.riasec) {
    const completed = Object.values(result.riasec).some(v => v > 0);
    result.riasecCode = completed
      ? Object.entries(result.riasec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k).join('')
      : null;
  }
  if (result.reasoning) {
    result.reasoning.percent = result.reasoning.total
      ? Math.round((result.reasoning.correct / result.reasoning.total) * 100)
      : null;
  }
  if (result.skills) {
    const vals = Object.values(result.skills);
    result.skills.percent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null;
  }
  if (result.learning) {
    const vals = Object.values(result.learning);
    result.learning.percent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null;
  }
  if (result.readiness) {
    const vals = Object.values(result.readiness);
    result.readinessPercent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null;
  }
  if (result.adaptability) {
    const vals = Object.values(result.adaptability);
    result.adaptabilityPercent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null;
  }
  return result;
}

export function createSelectedUserVector(scored, context = {}) {
  return {
    riasec_R: scored?.riasec?.R || 0,
    riasec_I: scored?.riasec?.I || 0,
    riasec_A: scored?.riasec?.A || 0,
    riasec_S: scored?.riasec?.S || 0,
    riasec_E: scored?.riasec?.E || 0,
    riasec_C: scored?.riasec?.C || 0,
    big5_O: scored?.big5?.O || 0,
    big5_C: scored?.big5?.C || 0,
    big5_E: scored?.big5?.E || 0,
    big5_A: scored?.big5?.A || 0,
    big5_N: scored?.big5?.N || 0,
    reasoning: scored?.reasoning?.percent || 0,
    skills: scored?.skills?.percent || 0,
    learning: scored?.learning?.percent || 0,
    academicAverage: Number(context.academicAverage || 0),
  };
}

export function matchCareerToSelectedProfile(career, scored, context = {}) {
  const v = createSelectedUserVector(scored, context);
  const p = {
    riasec_R: (career.riasec || []).includes('R') ? 5 : 1,
    riasec_I: (career.riasec || []).includes('I') ? 5 : 1,
    riasec_A: (career.riasec || []).includes('A') ? 5 : 1,
    riasec_S: (career.riasec || []).includes('S') ? 5 : 1,
    riasec_E: (career.riasec || []).includes('E') ? 5 : 1,
    riasec_C: (career.riasec || []).includes('C') ? 5 : 1,
    big5_O: 3,
    big5_C: 3,
    big5_E: 3,
    big5_A: 3,
    big5_N: 3,
    reasoning: 60,
    skills: 60,
    learning: 60,
    academicAverage: Number(context.academicAverage || 60),
  };
  const similarity = cosineSimilarity(v, p);
  return {
    similarity,
    explorationIndex: Math.round(Math.max(0, Math.min(1, (similarity + 1) / 2)) * 100),
  };
}
