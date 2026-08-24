import { buildCareerSkillEvidence } from './careerSkillOntology.js';

const asArray = value => Array.isArray(value) ? value.filter(Boolean).map(String) : [];

/**
 * Converts the existing career catalogue into an auditable evidence profile.
 * This file deliberately does NOT invent psychometric norms for careers.
 */
export function buildCareerEvidenceProfile(career = {}) {
  const skillEvidence = buildCareerSkillEvidence(career);
  return {
    careerId: String(career.id || ''),
    title: String(career.title || ''),
    category: String(career.category || ''),
    interestProfile: asArray(career.riasec),
    streams: asArray(career.stream),
    education: String(career.education || ''),
    skills: asArray(career.skills),
    skillEvidence,
    exams: asArray(career.exams),
    colleges: asArray(career.colleges),
    growth: String(career.growth || ''),
    salary: {
      entry: Number.isFinite(Number(career.salaryEntry)) ? Number(career.salaryEntry) : null,
      mid: Number.isFinite(Number(career.salaryMid)) ? Number(career.salaryMid) : null,
      senior: Number.isFinite(Number(career.salarySenior)) ? Number(career.salarySenior) : null,
    },
    workDescription: String(career.description || ''),
    dayInLife: String(career.dayInLife || ''),
    pros: asArray(career.pros),
    cons: asArray(career.cons),
    evidenceLimitations: [
      'The current catalogue does not contain validated career-side Big Five norms.',
      'The current catalogue does not contain validated career-side values norms.',
      'The current catalogue does not contain validated career-side learning-preference norms.',
      'The current catalogue skill list is descriptive and is not a calibrated ability requirement.',
      'The current catalogue does not contain validated career-side reasoning norms.',
    ],
  };
}

export function buildInterestAlignmentExplanation(studentRiasec = {}, careerRiasec = []) {
  const student = Object.entries(studentRiasec || {})
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .map(([key]) => key);
  const career = asArray(careerRiasec);
  const overlap = student.filter(code => career.includes(code));
  return {
    studentTopInterests: student.slice(0, 3),
    careerInterestProfile: career,
    overlappingInterests: overlap,
    rationale: overlap.length
      ? `This career shares ${overlap.join(' + ')} interest themes with the available RIASEC evidence.`
      : 'This career does not share a top RIASEC interest theme with the available profile; it remains an option to investigate rather than a validated fit prediction.',
  };
}
