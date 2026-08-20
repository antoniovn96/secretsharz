/**
 * Resolve the latest usable Career/RIASEC assessment from the assessment
 * representations currently present during the student-data migration.
 *
 * This is intentionally a pure compatibility resolver. It does not write
 * data, invent psychometric results, or decide access/entitlements.
 */

const COMPLETED = 'completed';
const IN_PROGRESS = 'in_progress';
const NOT_STARTED = 'not_started';

function asDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timestamp(value) {
  const date = asDate(value);
  return date ? date.getTime() : 0;
}

function cleanCode(value) {
  return typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : null;
}

function cleanScores(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, score]) => typeof score === 'number' && Number.isFinite(score))
  );
}

function statusFrom({ status, completedAt, startedAt, code }) {
  const normalized = String(status || '').toLowerCase();
  if (['completed', 'complete', 'finished'].includes(normalized)) return COMPLETED;
  if (['in_progress', 'in-progress', 'started', 'partial'].includes(normalized)) return IN_PROGRESS;
  if (completedAt || code) return COMPLETED;
  if (startedAt) return IN_PROGRESS;
  return NOT_STARTED;
}

function candidateFromCanonical(item, index) {
  if (!item || typeof item !== 'object') return null;
  const result = item.result || item.results || {};
  const scores = cleanScores(item.riasecScores || result.riasecScores || result.scores || item.scores);
  const code = cleanCode(item.hollandCode || item.riasecCode || result.hollandCode || result.riasecCode || result.code);
  const completedAt = item.completedAt || item.assessmentCompletedAt || item.completed_at || null;
  const startedAt = item.startedAt || item.started_at || null;
  const status = statusFrom({ status: item.status, completedAt, startedAt, code });
  return {
    source: 'canonical',
    sourceIndex: index,
    id: item.id || item.assessmentId || `canonical-${index}`,
    instrument: item.instrument || item.type || 'RIASEC',
    version: item.version || null,
    status,
    completedAt,
    startedAt,
    hollandCode: code,
    riasecCode: code,
    riasecScores: scores,
    maturityPct: typeof item.maturityPct === 'number' ? item.maturityPct : null,
    streams: Array.isArray(item.streams) ? item.streams : [],
    top5Careers: Array.isArray(item.top5Careers) ? item.top5Careers : [],
    profile: item.profile && typeof item.profile === 'object' ? item.profile : {},
    raw: item,
  };
}

function candidateFromV2(value) {
  if (!value || typeof value !== 'object') return null;
  const scores = value.scores || {};
  const code = cleanCode(
    scores.riasecCode || scores.hollandCode || scores.code || value.riasecCode || value.hollandCode
  );
  const completedAt = value.completedAt || value.assessmentCompletedAt || null;
  const startedAt = value.startedAt || null;
  return {
    source: 'v2',
    id: value.id || value.assessmentId || 'career-assessment-v2',
    instrument: value.instrument || value.assessmentType || 'RIASEC',
    version: value.version || 'v2',
    status: statusFrom({ status: value.status, completedAt, startedAt, code }),
    completedAt,
    startedAt,
    hollandCode: code,
    riasecCode: code,
    riasecScores: cleanScores(scores.riasecScores || scores.riasec || scores),
    maturityPct: typeof scores.maturityPct === 'number' ? scores.maturityPct : (typeof value.maturityPct === 'number' ? value.maturityPct : null),
    streams: Array.isArray(value.streams) ? value.streams : [],
    top5Careers: Array.isArray(value.top5Careers) ? value.top5Careers : (Array.isArray(value.careerExploration?.top5Careers) ? value.careerExploration.top5Careers : []),
    profile: value.profile && typeof value.profile === 'object' ? value.profile : {},
    raw: value,
  };
}

function candidateFromLegacy(value) {
  if (!value || typeof value !== 'object') return null;
  const code = cleanCode(value.hollandCode || value.riasecCode);
  const completedAt = value.completedAt || value.assessmentCompletedAt || null;
  const startedAt = value.startedAt || null;
  return {
    source: 'legacy',
    id: value.id || 'career-assessment',
    instrument: 'RIASEC',
    version: value.version || null,
    status: statusFrom({ status: value.status, completedAt, startedAt, code }),
    completedAt,
    startedAt,
    hollandCode: code,
    riasecCode: code,
    riasecScores: cleanScores(value.riasecScores),
    maturityPct: typeof value.maturityPct === 'number' ? value.maturityPct : null,
    streams: Array.isArray(value.streams) ? value.streams : (value.recommendedStream ? [value.recommendedStream] : []),
    top5Careers: Array.isArray(value.top5Careers) ? value.top5Careers : (Array.isArray(value.topCareerMatches) ? value.topCareerMatches : []),
    profile: value.profile && typeof value.profile === 'object' ? value.profile : {},
    raw: value,
  };
}

function chooseLatest(candidates) {
  const usable = candidates.filter(Boolean);
  const completed = usable.filter(item => item.status === COMPLETED);
  if (completed.length) {
    return completed.sort((a, b) => timestamp(b.completedAt || b.startedAt) - timestamp(a.completedAt || a.startedAt))[0];
  }
  const inProgress = usable.filter(item => item.status === IN_PROGRESS);
  if (inProgress.length) {
    return inProgress.sort((a, b) => timestamp(b.startedAt || b.completedAt) - timestamp(a.startedAt || a.completedAt))[0];
  }
  return usable[0] || null;
}

export function resolveLatestCareerAssessment(profile = {}) {
  const canonical = Array.isArray(profile.assessments)
    ? profile.assessments.map(candidateFromCanonical).filter(Boolean)
    : [];

  const canonicalResolved = chooseLatest(canonical);
  if (canonicalResolved) return canonicalResolved;

  const v2 = candidateFromV2(profile.careerAssessmentV2);
  if (v2) return v2;

  const legacy = candidateFromLegacy(profile.careerAssessment);
  if (legacy) return legacy;

  const fallback = candidateFromLegacy({
    riasecCode: profile.riasecCode,
    riasecScores: profile.riasecScores,
    assessmentCompletedAt: profile.assessmentCompletedAt,
    recommendedStream: profile.recommendedStream,
    topCareerMatches: profile.topCareerMatches,
    maturityPct: profile.maturityPct,
  });

  return fallback && fallback.status !== NOT_STARTED ? fallback : {
    source: null,
    id: null,
    instrument: 'RIASEC',
    version: null,
    status: NOT_STARTED,
    completedAt: null,
    startedAt: null,
    hollandCode: null,
    riasecCode: null,
    riasecScores: {},
    maturityPct: null,
    streams: [],
    top5Careers: [],
    profile: {},
    raw: null,
  };
}

export function toCareerAssessmentSummary(profile = {}) {
  const assessment = resolveLatestCareerAssessment(profile);
  return {
    status: assessment.status,
    id: assessment.id,
    instrument: assessment.instrument,
    version: assessment.version,
    code: assessment.riasecCode || assessment.hollandCode || null,
    completedAt: assessment.completedAt,
    source: assessment.source,
  };
}

export default { resolveLatestCareerAssessment, toCareerAssessmentSummary };
