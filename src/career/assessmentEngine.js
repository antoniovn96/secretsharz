// Secret Sharz — versioned career assessment engine foundation.
// Pure scoring/domain helpers only. Persistence, payment authorization,
// college catalogue queries and dashboard access belong to trusted services.

export const ASSESSMENT_VERSION = 'career-v1.0';

export const CANDIDATE_STATUSES = Object.freeze(['student', 'working_professional']);
export const RESULT_ACCESS = Object.freeze(['partial', 'full']);

export const DIMENSIONS = Object.freeze([
  'interests',
  'aptitude_confidence',
  'values',
  'work_style',
  'motivation',
  'decision_maturity',
  'resilience',
  'academic_fit',
  'goals',
]);

export const RIASEC_CODES = Object.freeze(['R', 'I', 'A', 'S', 'E', 'C']);

export const RIASEC_LABELS = Object.freeze({
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
});

export const RESULT_DISCLAIMER =
  'These results are based on the answers you provided, your stated interests, preferences and context. They are guidance indicators, not a fixed prediction of your future. With interest, learning, effort and support, you can pursue many paths beyond the recommendations shown here.';

export function validateCandidateContext(context = {}) {
  const { status, age } = context;
  if (!CANDIDATE_STATUSES.includes(status)) throw new Error('status must be student or working_professional.');
  if (!Number.isInteger(age) || age < 10 || age > 100) throw new Error('age must be an integer between 10 and 100.');
  return { status, age };
}

export function buildAssessmentAttempt({
  personId,
  status,
  age,
  likes = [],
  dislikes = [],
  goals = [],
  favouriteSubjects = [],
  marks = {},
  answers = {},
  paymentStatus = 'unpaid',
}) {
  if (!personId) throw new Error('personId is required.');
  validateCandidateContext({ status, age });
  if (!Array.isArray(likes) || !Array.isArray(dislikes) || !Array.isArray(goals)) {
    throw new Error('likes, dislikes and goals must be arrays.');
  }
  if (status === 'student' && !Array.isArray(favouriteSubjects)) {
    throw new Error('favouriteSubjects must be an array for students.');
  }
  if (typeof marks !== 'object' || marks === null || Array.isArray(marks)) throw new Error('marks must be an object.');
  if (typeof answers !== 'object' || answers === null || Array.isArray(answers)) throw new Error('answers must be an object.');

  return {
    assessmentVersion: ASSESSMENT_VERSION,
    personId,
    candidate: {
      status,
      age,
      likes: [...likes],
      dislikes: [...dislikes],
      goals: [...goals],
      favouriteSubjects: status === 'student' ? [...favouriteSubjects] : [],
      marks: { ...marks },
    },
    answers: { ...answers },
    paymentStatus,
    resultAccess: paymentStatus === 'paid' ? 'full' : 'partial',
    createdAt: null,
    completedAt: null,
  };
}

export function scoreLikertAnswer(answer, weight = 1) {
  if (!Number.isFinite(answer) || answer < 1 || answer > 5) return 0;
  return answer * weight;
}

export function scoreDimensions(answers = {}, questionMap = {}) {
  const scores = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));
  const counts = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));

  for (const [questionId, raw] of Object.entries(answers)) {
    const question = questionMap[questionId];
    if (!question || !DIMENSIONS.includes(question.dimension)) continue;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 1 || value > 5) continue;
    scores[question.dimension] += value * (Number(question.weight) || 1);
    counts[question.dimension] += Number(question.weight) || 1;
  }

  return Object.fromEntries(DIMENSIONS.map((dimension) => [
    dimension,
    counts[dimension] ? Math.round((scores[dimension] / counts[dimension]) * 100) / 100 : 0,
  ]));
}

export function scoreRiasec(answers = {}, questionMap = {}) {
  const raw = Object.fromEntries(RIASEC_CODES.map((code) => [code, 0]));
  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questionMap[questionId];
    if (!question || !RIASEC_CODES.includes(question.code)) continue;
    const value = Number(answer);
    if (Number.isFinite(value) && value >= 1 && value <= 5) raw[question.code] += value * (Number(question.weight) || 1);
  }

  const ranked = RIASEC_CODES
    .map((code) => ({ code, score: raw[code], label: RIASEC_LABELS[code] }))
    .sort((a, b) => b.score - a.score);

  return { raw, ranked, hollandCode: ranked.slice(0, 3).map((x) => x.code).join('') };
}

export function normalizeAcademicFit(marks = {}) {
  const values = Object.values(marks).map(Number).filter(Number.isFinite);
  if (!values.length) return null;
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(Math.max(0, Math.min(100, average)) * 100) / 100;
}

export function buildPartialResult({ dimensions, riasec, candidate }) {
  return {
    access: 'partial',
    assessmentVersion: ASSESSMENT_VERSION,
    snapshot: {
      candidateStatus: candidate.status,
      age: candidate.age,
      hollandCode: riasec.hollandCode,
      topInterests: riasec.ranked.slice(0, 3),
      strongestDimensions: Object.entries(dimensions)
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([dimension, score]) => ({ dimension, score })),
    },
    lockedSections: [
      'comprehensive_personality_and_interest_profile',
      'career_family_matches',
      'career_pathways',
      'course_recommendations',
      'college_matches',
      'personalised_roadmap',
      'strengths_and_development_plan',
    ],
    disclaimer: RESULT_DISCLAIMER,
  };
}

export function buildFullResult({ dimensions, riasec, candidate, careerMatches = [], courses = [], colleges = [] }) {
  return {
    access: 'full',
    assessmentVersion: ASSESSMENT_VERSION,
    candidate: {
      status: candidate.status,
      age: candidate.age,
      likes: candidate.likes,
      dislikes: candidate.dislikes,
      goals: candidate.goals,
      favouriteSubjects: candidate.favouriteSubjects,
      academicFit: normalizeAcademicFit(candidate.marks),
    },
    profile: {
      dimensions,
      riasec,
      interpretation: 'Recommendations should be read as a broad exploration set, not a restriction to a single career.',
    },
    careerMatches,
    courses,
    colleges,
    roadmap: [],
    disclaimer: RESULT_DISCLAIMER,
  };
}

export function buildResult({ attempt, questionMap, careerMatches = [], courses = [], colleges = [] }) {
  const dimensions = scoreDimensions(attempt.answers, questionMap);
  const riasec = scoreRiasec(attempt.answers, questionMap);
  if (attempt.resultAccess === 'full') {
    return buildFullResult({ dimensions, riasec, candidate: attempt.candidate, careerMatches, courses, colleges });
  }
  return buildPartialResult({ dimensions, riasec, candidate: attempt.candidate });
}
