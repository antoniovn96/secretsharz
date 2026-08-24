import { buildCareerPathwayCheck } from './careerEligibilityProfile.js';

export const PATHWAY_STATUS_LABELS = Object.freeze({
  'currently-aligned': 'Pathway currently aligns with the catalogue',
  'requires-investigation': 'Pathway requires further investigation',
  unknown: 'Pathway information is not available',
});

export function buildCareerPathwaySummary(studentContext = {}, career = {}) {
  const result = buildCareerPathwayCheck(studentContext, career);
  return {
    ...result,
    statusLabel: PATHWAY_STATUS_LABELS[result.pathwayFeasibility] || PATHWAY_STATUS_LABELS.unknown,
    isCareerFitEvidence: false,
    disclaimer: 'This pathway check describes catalogue and student-context alignment. It is not a measure of career fit or future success.',
  };
}
