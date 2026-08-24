import { PATHWAYS } from './careerAssessmentBlueprint';

export function parseClassNumber(value) {
  const match = String(value ?? '').trim().match(/(?:class|grade)\s*(\d{1,2})/i) || String(value ?? '').trim().match(/^(\d{1,2})$/);
  return match ? Number(match[1]) : null;
}

/**
 * Eligibility is pathway-specific. Age alone must never decide student eligibility.
 * This helper is intentionally separate from psychometric scoring.
 */
export function assessEligibility({ pathway, educationStage, className, age } = {}) {
  const numericAge = Number(age);

  if (pathway === PATHWAYS.STUDENT) {
    const classNumber = parseClassNumber(className || educationStage);
    if (classNumber != null) {
      return {
        eligible: classNumber >= 7 && classNumber <= 12,
        reason: classNumber < 7 ? 'career_assessment_begins_class_7' : classNumber > 12 ? 'student_stage_out_of_scope' : 'eligible',
        classNumber,
      };
    }
    return {
      eligible: false,
      reason: 'student_class_required',
      classNumber: null,
    };
  }

  if (pathway === PATHWAYS.PROFESSIONAL || pathway === PATHWAYS.HR) {
    return {
      eligible: Number.isFinite(numericAge) && numericAge >= 18,
      reason: Number.isFinite(numericAge) && numericAge >= 18 ? 'eligible' : 'adult_age_required',
      classNumber: null,
    };
  }

  return { eligible: false, reason: 'unknown_pathway', classNumber: null };
}
