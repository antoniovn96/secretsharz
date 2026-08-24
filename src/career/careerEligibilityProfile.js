const asArray = value => Array.isArray(value) ? value.filter(Boolean).map(String) : [];

const STREAM_ALIASES = Object.freeze({
  science: 'Science',
  commerce: 'Commerce',
  arts: 'Arts',
  humanities: 'Arts',
  'arts/humanities': 'Arts',
  vocational: 'Vocational',
});

export function normalizeStream(value) {
  const key = String(value || '').trim().toLowerCase();
  return STREAM_ALIASES[key] || String(value || '').trim();
}

export function normalizeStreams(value) {
  return [...new Set(asArray(value).map(normalizeStream).filter(Boolean))];
}

export function buildCareerEligibilityProfile(career = {}) {
  return {
    careerId: String(career.id || ''),
    title: String(career.title || ''),
    streams: normalizeStreams(career.stream),
    educationPathway: String(career.education || '').trim(),
    entranceExams: asArray(career.exams),
    eligibilityEvidenceStatus: career.stream || career.education || career.exams ? 'catalogue-described' : 'unavailable',
    limitations: [
      'Catalogue pathway information is guidance data, not a definitive eligibility determination.',
      'Actual eligibility can depend on institution, year, subject combination, category, regulations and admission rules.',
    ],
  };
}

export function compareStudentStreamToCareer(studentStream, career) {
  const profile = buildCareerEligibilityProfile(career);
  const currentStream = normalizeStream(studentStream);
  if (!currentStream || !profile.streams.length) {
    return { status: 'unknown', currentStream: currentStream || null, eligibleStreams: profile.streams };
  }
  if (profile.streams.includes(currentStream)) {
    return { status: 'aligned', currentStream, eligibleStreams: profile.streams };
  }
  return {
    status: 'different-pathway',
    currentStream,
    eligibleStreams: profile.streams,
    message: 'The current stream differs from the streams listed in the career catalogue. This is a pathway consideration, not a career-fit result.',
  };
}

export function buildCareerPathwayCheck(studentContext = {}, career = {}) {
  const eligibility = buildCareerEligibilityProfile(career);
  const stream = compareStudentStreamToCareer(studentContext.stream, career);
  return {
    eligibility,
    stream,
    pathwayFeasibility: stream.status === 'aligned' ? 'currently-aligned' : stream.status === 'different-pathway' ? 'requires-investigation' : 'unknown',
  };
}
