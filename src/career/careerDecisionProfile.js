import { buildCareerEvidenceProfile } from './careerEvidenceProfile.js';
import { buildCareerPathwaySummary } from './careerPathwayCheck.js';

export function buildCareerDecisionProfile(career = {}, studentContext = {}) {
  const evidence = buildCareerEvidenceProfile(career);
  const pathway = buildCareerPathwaySummary(studentContext, career);
  return {
    careerId: evidence.careerId,
    title: evidence.title,
    cluster: evidence.category,
    fit: {
      interestProfile: evidence.interestProfile,
      quantitativeEvidence: evidence.interestProfile.length ? ['riasec'] : [],
      unavailablePsychometricDimensions: ['personality', 'values', 'reasoning', 'skills', 'learning', 'environment', 'readiness', 'adaptability'],
    },
    pathway: {
      status: pathway.pathwayFeasibility,
      statusLabel: pathway.statusLabel,
      currentStream: pathway.stream.currentStream,
      listedStreams: pathway.stream.eligibleStreams,
      education: pathway.eligibility.educationPathway,
      entranceExams: pathway.eligibility.entranceExams,
      isCareerFitEvidence: false,
    },
    market: {
      growth: evidence.growth,
      salary: evidence.salary,
      isCareerFitEvidence: false,
    },
    education: {
      pathway: evidence.education,
      colleges: evidence.colleges,
      entranceExams: evidence.exams,
    },
    experience: {
      workDescription: evidence.workDescription,
      dayInLife: evidence.dayInLife,
      pros: evidence.pros,
      cons: evidence.cons,
    },
    limitations: evidence.evidenceLimitations.concat(pathway.disclaimer),
  };
}

export function buildCareerDecisionExplanation(profile, explanation = {}) {
  const overlap = explanation.overlappingInterests || [];
  const whyExplore = overlap.length
    ? `Explore this direction because its catalogue RIASEC profile overlaps with your ${overlap.join(' + ')} interest themes.`
    : 'Explore this direction only as a possibility; the current evidence does not show a top-interest overlap.';
  const checks = [];
  if (profile.pathway.listedStreams.length) checks.push(`Check the listed stream/pathway: ${profile.pathway.listedStreams.join(', ')}.`);
  if (profile.pathway.education) checks.push(`Review the education pathway: ${profile.pathway.education}.`);
  if (profile.pathway.entranceExams.length) checks.push(`Check current entrance requirements, including ${profile.pathway.entranceExams.join(', ')}.`);
  return { whyExplore, whatToCheck: checks };
}
