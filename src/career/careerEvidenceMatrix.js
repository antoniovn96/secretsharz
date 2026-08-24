import { CAREER_DATA } from '../data/careers.js';
import { buildCareerEvidenceProfile } from './careerEvidenceProfile.js';

export const CAREER_ASSESSMENT_DIMENSIONS = Object.freeze([
  'riasec',
  'personality',
  'values',
  'reasoning',
  'skills',
  'learning',
  'environment',
  'readiness',
  'adaptability',
]);

export const CAREER_EVIDENCE_STATUS = Object.freeze({
  supported: 'supported',
  unavailable: 'unavailable',
});

/**
 * Describes what the current career catalogue can legitimately support.
 * Only RIASEC is currently comparable to an assessment dimension.
 * Other dimensions remain unavailable until career-side evidence is added.
 */
export function buildCareerEvidenceMatrix(careerData = CAREER_DATA) {
  return careerData.map((career) => {
    const profile = buildCareerEvidenceProfile(career);
    const matrix = Object.fromEntries(CAREER_ASSESSMENT_DIMENSIONS.map((dimension) => [
      dimension,
      dimension === 'riasec' && profile.interestProfile.length > 0
        ? CAREER_EVIDENCE_STATUS.supported
        : CAREER_EVIDENCE_STATUS.unavailable,
    ]));

    return {
      careerId: career.id,
      careerTitle: career.title,
      cluster: profile.category,
      dimensions: matrix,
      supportedDimensions: Object.entries(matrix).filter(([, status]) => status === CAREER_EVIDENCE_STATUS.supported).map(([dimension]) => dimension),
      unavailableDimensions: Object.entries(matrix).filter(([, status]) => status === CAREER_EVIDENCE_STATUS.unavailable).map(([dimension]) => dimension),
    };
  });
}

export function getCareerEvidenceMatrixSummary(careerData = CAREER_DATA) {
  const matrix = buildCareerEvidenceMatrix(careerData);
  return {
    careerCount: matrix.length,
    dimensions: Object.fromEntries(CAREER_ASSESSMENT_DIMENSIONS.map((dimension) => [
      dimension,
      {
        supportedCareerCount: matrix.filter((row) => row.dimensions[dimension] === CAREER_EVIDENCE_STATUS.supported).length,
        status: matrix.some((row) => row.dimensions[dimension] === CAREER_EVIDENCE_STATUS.supported)
          ? CAREER_EVIDENCE_STATUS.supported
          : CAREER_EVIDENCE_STATUS.unavailable,
      },
    ])),
  };
}
