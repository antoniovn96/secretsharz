import { ASSESSMENT_VERSION, scoreLikert, cosineSimilarity } from './careerAssessmentBlueprint.js';
import { getItemsForBundle, getItemsForFamilies, resolveBundle } from './assessmentSelection.js';
import { buildCareerEvidenceProfile, buildInterestAlignmentExplanation } from './careerEvidenceProfile.js';
import { buildSkillAlignmentEvidence } from './skillAlignmentEvidence.js';

const emptyResult = () => ({
  version: ASSESSMENT_VERSION,
  selectedFamilyIds: [], riasec: null, riasecCode: null, big5: null, values: null,
  reasoning: null, skills: null, learning: null, readiness: null, readinessPercent: null,
  environment: null, adaptability: null, adaptabilityPercent: null,
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
  if (selectedFamilyIds.includes('aptitude_skills')) { result.reasoning = { correct: 0, total: 0, verbal: 0, numerical: 0, logical: 0 }; result.skills = {}; }
  if (selectedFamilyIds.includes('learning')) result.learning = {};
  if (isFullBundle) { result.readiness = {}; result.environment = {}; result.adaptability = {}; }

  for (const item of items) {
    const value = answers?.[item.id];
    if (value === undefined || value === null || value === '') continue;
    if (item.type === 'objective') {
      if (!result.reasoning) continue;
      result.reasoning.total += 1;
      if (Number(value) === item.correct) { result.reasoning.correct += 1; result.reasoning[item.construct] += 1; }
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
    result.riasecCode = completed ? Object.entries(result.riasec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k).join('') : null;
  }
  if (result.reasoning) result.reasoning.percent = result.reasoning.total ? Math.round((result.reasoning.correct / result.reasoning.total) * 100) : null;
  if (result.skills) { const vals = Object.values(result.skills); result.skills.percent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null; }
  if (result.learning) { const vals = Object.values(result.learning); result.learning.percent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null; }
  if (result.readiness) { const vals = Object.values(result.readiness); result.readinessPercent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null; }
  if (result.adaptability) { const vals = Object.values(result.adaptability); result.adaptabilityPercent = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100) : null; }
  return result;
}

export function createSelectedUserVector(scored) {
  return {
    riasec_R: scored?.riasec?.R || 0, riasec_I: scored?.riasec?.I || 0, riasec_A: scored?.riasec?.A || 0,
    riasec_S: scored?.riasec?.S || 0, riasec_E: scored?.riasec?.E || 0, riasec_C: scored?.riasec?.C || 0,
  };
}

/**
 * The current career catalogue supports a quantitative RIASEC relationship.
 * Other assessment domains remain evidence for the report/counsellor and are
 * deliberately excluded from ranking until career-side norms exist.
 */
export function matchCareerToSelectedProfile(career, scored) {
  const hasRiasecEvidence = Boolean(scored?.riasec && Object.values(scored.riasec).some(value => Number(value) > 0));
  const careerProfile = buildCareerEvidenceProfile(career);
  if (!hasRiasecEvidence) {
    return {
      similarity: null,
      interestAlignmentIndex: null,
      explorationIndex: null,
      scoreLabel: 'Interest Alignment Index',
      evidenceProfile: careerProfile,
      explanation: buildInterestAlignmentExplanation({}, careerProfile.interestProfile),
      skillAlignment: null,
      excludedFromRanking: ['big5', 'values', 'reasoning', 'skills', 'learning', 'academicAverage', 'readiness', 'environment', 'adaptability'],
      rankingStatus: 'insufficient_evidence',
      rankingLimitation: 'Complete the RIASEC assessment before calculating career interest alignment.',
    };
  }

  const v = createSelectedUserVector(scored);
  const p = Object.fromEntries(['R', 'I', 'A', 'S', 'E', 'C'].map(code => [`riasec_${code}`, careerProfile.interestProfile.includes(code) ? 5 : 1]));
  const similarity = cosineSimilarity(v, p);
  const interestAlignmentIndex = Math.round(Math.max(0, Math.min(1, (similarity + 1) / 2)) * 100);
  const explanation = buildInterestAlignmentExplanation(scored?.riasec, careerProfile.interestProfile);
  const skillAlignment = buildSkillAlignmentEvidence(scored, career);
  return {
    similarity,
    interestAlignmentIndex,
    explorationIndex: interestAlignmentIndex,
    scoreLabel: 'Interest Alignment Index',
    evidenceProfile: careerProfile,
    explanation,
    skillAlignment,
    excludedFromRanking: ['big5', 'values', 'reasoning', 'skills', 'learning', 'academicAverage', 'readiness', 'environment', 'adaptability'],
    rankingStatus: 'available',
  };
}
