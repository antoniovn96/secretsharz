import { CAREER_CATALOG_VERSION, CAREER_CATALOG } from './careerCatalog';
import { RIASEC_CODES } from './assessmentEngine';

const DIMENSION_WEIGHTS = Object.freeze({
  interests: 0.30,
  values: 0.12,
  work_style: 0.12,
  motivation: 0.10,
  goals: 0.12,
  aptitude_confidence: 0.08,
  decision_maturity: 0.05,
  resilience: 0.05,
  academic_fit: 0.06,
});

function safeScore(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(5, number)) / 5 : 0;
}

export function scoreCareerMatch({ career, dimensions = {}, riasec = {}, candidate = {} }) {
  const rankedCodes = riasec.ranked || [];
  const topCodes = new Set(rankedCodes.slice(0, 3).map((item) => item.code));
  const riasecHits = career.riasec.filter((code) => topCodes.has(code)).length;
  const interestScore = career.riasec.length
    ? riasecHits / career.riasec.length
    : 0;

  const dimensionScore = career.dimensions.length
    ? career.dimensions.reduce((sum, dimension) => sum + safeScore(dimensions[dimension]), 0) / career.dimensions.length
    : 0;

  const goalText = (candidate.goals || []).join(' ').toLowerCase();
  const keywordHits = career.keywords.filter((keyword) => goalText.includes(keyword.toLowerCase())).length;
  const goalScore = career.keywords.length ? keywordHits / career.keywords.length : 0;

  const score = Math.round((
    interestScore * 0.50
    + dimensionScore * 0.35
    + goalScore * 0.15
  ) * 100);

  return {
    careerId: career.id,
    careerTitle: career.title,
    score,
    matchedInterests: career.riasec.filter((code) => topCodes.has(code)),
    matchedDimensions: career.dimensions.filter((dimension) => safeScore(dimensions[dimension]) >= 0.6),
    rationale: 'This is an exploration match based on the assessment profile, not a prediction or eligibility decision.',
  };
}

export function rankCareerMatches({ dimensions = {}, riasec = {}, candidate = {} }) {
  // Keep the catalogue extensible while ensuring malformed entries cannot crash results.
  const validCodes = new Set(RIASEC_CODES);
  const normalizedRiasec = {
    ...riasec,
    ranked: (riasec.ranked || []).filter((item) => validCodes.has(item.code)),
  };

  return CAREER_CATALOG
    .map((career) => scoreCareerMatch({ career, dimensions, riasec: normalizedRiasec, candidate }))
    .sort((a, b) => b.score - a.score)
    .map((match, index) => ({ ...match, rank: index + 1, catalogueVersion: CAREER_CATALOG_VERSION }));
}

export function buildCareerExplorationSet({ dimensions, riasec, candidate }) {
  const matches = rankCareerMatches({ dimensions, riasec, candidate });
  return {
    primary: matches.slice(0, 5),
    additional: matches.slice(5, 15),
    note: 'Explore broadly. A lower match score does not mean a career is impossible; skills, qualifications, opportunity, effort and changing interests can alter a pathway.',
  };
}
