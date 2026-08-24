import { ASSESSMENT_VERSION } from './careerAssessmentBlueprint.js';
import { resolveBundle } from './assessmentSelection.js';
import { scoreAssessmentV21, RIASEC_CODES } from './assessmentScoring.js';
import { buildCareerEvidenceProfile, buildInterestAlignmentExplanation } from './careerEvidenceProfile.js';
import { buildSkillAlignmentEvidence } from './skillAlignmentEvidence.js';

export { RIASEC_CODES };

export function scoreSelectedAssessment(answers = {}, { bundleId = null, familyIds = null } = {}) {
  const bundle = bundleId ? resolveBundle(bundleId) : null;
  const selectedFamilyIds = [...new Set(familyIds || bundle?.familyIds || [])];
  return {
    version: ASSESSMENT_VERSION,
    ...scoreAssessmentV21(answers, { selectedFamilyIds, fullGuidance: Boolean(bundle && bundle.familyCount === 5) }),
  };
}

export function createSelectedUserVector(scored) {
  const source = scored?.riasecMeans || scored?.riasec || {};
  return Object.fromEntries(RIASEC_CODES.map(code => [`riasec_${code}`, Number(source?.[code] || 0)]));
}

function pearsonProfileSimilarity(a, b) {
  const av = RIASEC_CODES.map(code => Number(a?.[code] || 0));
  const bv = RIASEC_CODES.map(code => Number(b?.[code] || 0));
  const meanA = av.reduce((s, x) => s + x, 0) / av.length;
  const meanB = bv.reduce((s, x) => s + x, 0) / bv.length;
  let numerator = 0; let denomA = 0; let denomB = 0;
  for (let i = 0; i < av.length; i += 1) { const da = av[i] - meanA; const db = bv[i] - meanB; numerator += da * db; denomA += da * da; denomB += db * db; }
  if (!denomA || !denomB) return null;
  return numerator / Math.sqrt(denomA * denomB);
}

function careerProfileVector(codes = []) {
  const normalized = Array.isArray(codes) ? codes.map(String).map(code => code.toUpperCase()) : [];
  const weights = [3, 2, 1];
  return Object.fromEntries(RIASEC_CODES.map(code => { const rank = normalized.indexOf(code); return [code, rank >= 0 && rank < weights.length ? weights[rank] : 0]; }));
}

function hasUsableRiasec(scored) {
  if (scored?.scoringSchemaVersion) return Boolean(scored?.quality?.riasec?.complete && scored?.riasecMeans);
  return Boolean(scored?.riasec && RIASEC_CODES.every(code => Number.isFinite(Number(scored.riasec[code])) && Number(scored.riasec[code]) > 0));
}

/**
 * Quantitative career matching uses whole-profile RIASEC congruence. The
 * resulting 0-100 value is an exploratory index, not a probability of success.
 */
export function matchCareerToSelectedProfile(career, scored) {
  const hasCompleteRiasec = hasUsableRiasec(scored);
  const careerProfile = buildCareerEvidenceProfile(career);
  if (!hasCompleteRiasec) {
    return { similarity:null, interestAlignmentIndex:null, explorationIndex:null, scoreLabel:'Interest Alignment Index', scoreMeaning:'Exploratory RIASEC profile congruence; not a probability of success or suitability.', similarityMethod:'pearson_profile_congruence', evidenceProfile:careerProfile, explanation:buildInterestAlignmentExplanation({}, careerProfile.interestProfile), skillAlignment:null, excludedFromRanking:['big5','values','reasoning','skills','learning','academicAverage','readiness','environment','adaptability'], rankingStatus:'insufficient_evidence', rankingLimitation:'Complete all RIASEC items before calculating career interest alignment.' };
  }

  const student = scored.riasecMeans || scored.riasec;
  const occupation = careerProfile.numericInterestProfile || careerProfile.interestProfileObject || careerProfileVector(careerProfile.interestProfile);
  const similarity = pearsonProfileSimilarity(student, occupation);
  if (similarity == null) return { similarity:null, interestAlignmentIndex:null, explorationIndex:null, scoreLabel:'Interest Alignment Index', scoreMeaning:'Exploratory RIASEC profile congruence; not a probability of success or suitability.', similarityMethod:'pearson_profile_congruence', evidenceProfile:careerProfile, explanation:buildInterestAlignmentExplanation(student, careerProfile.interestProfile), skillAlignment:null, excludedFromRanking:['big5','values','reasoning','skills','learning','academicAverage','readiness','environment','adaptability'], rankingStatus:'insufficient_career_profile', rankingLimitation:'The career catalogue does not contain enough RIASEC profile variation for a meaningful profile comparison.' };

  const interestAlignmentIndex = Math.round(Math.max(0, Math.min(100, ((similarity + 1) / 2) * 100)));
  return { similarity, interestAlignmentIndex, explorationIndex:interestAlignmentIndex, explorationIndexStatus:'legacy_alias', scoreLabel:'Interest Alignment Index', scoreMeaning:'Exploratory RIASEC profile congruence; not a probability of success or suitability.', similarityMethod:'pearson_profile_congruence', evidenceProfile:careerProfile, explanation:buildInterestAlignmentExplanation(student, careerProfile.interestProfile), skillAlignment:buildSkillAlignmentEvidence(scored, career), excludedFromRanking:['big5','values','reasoning','skills','learning','academicAverage','readiness','environment','adaptability'], rankingStatus:'available' };
}
