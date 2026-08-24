// VidyaVantage student assessment stage routing.
// This module is intentionally separate from psychometric scoring: grade/stage determines
// which assessment experience is appropriate; it does not alter a student's trait scores.

export const STUDENT_ASSESSMENT_STAGES = Object.freeze({
  GRADE_7_8: 'grade_7_8',
  GRADE_9: 'grade_9',
  GRADE_10: 'grade_10',
  GRADE_11: 'grade_11',
  GRADE_12: 'grade_12',
  DIPLOMA_VOCATIONAL: 'diploma_vocational',
  UNDERGRADUATE: 'undergraduate',
  POSTGRADUATE: 'postgraduate',
  RESEARCH: 'research',
  TRANSITION: 'transition',
});

export const STUDENT_ASSESSMENT_STAGE_META = Object.freeze({
  grade_7_8: Object.freeze({
    label: 'Career Exploration',
    purpose: 'Discover interests, strengths, subject experiences and broad career possibilities.',
    formalCareerDecision: false,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: false,
    collectCareerGoal: 'light',
    showCareerFamilies: true,
  }),
  grade_9: Object.freeze({
    label: 'Career Exploration & Pathway Awareness',
    purpose: 'Connect emerging interests and academic patterns with broad future pathways.',
    formalCareerDecision: false,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: false,
    collectCareerGoal: 'exploring',
    showCareerFamilies: true,
  }),
  grade_10: Object.freeze({
    label: 'Stream & Pathway Discovery',
    purpose: 'Support informed post-Class-10 pathway exploration without treating one test as a verdict.',
    formalCareerDecision: true,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: 'considering',
    collectCareerGoal: 'exploring',
    showCareerFamilies: true,
  }),
  grade_11: Object.freeze({
    label: 'Career Direction & Pathway Planning',
    purpose: 'Interpret current subjects, academic evidence, interests and goals together.',
    formalCareerDecision: true,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: 'current',
    collectCareerGoal: 'specific',
    showCareerFamilies: true,
  }),
  grade_12: Object.freeze({
    label: 'Career & Higher-Education Decision Support',
    purpose: 'Connect the student's current pathway with courses, eligibility, alternatives and next actions.',
    formalCareerDecision: true,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: 'current',
    collectCareerGoal: 'specific',
    showCareerFamilies: true,
  }),
  diploma_vocational: Object.freeze({
    label: 'Vocational & Technical Pathway Guidance',
    purpose: 'Support technical, skill and vocational progression without treating it as a lesser pathway.',
    formalCareerDecision: true,
    collectMarks: true,
    collectSubjectEnjoyment: true,
    collectCurrentSubjects: true,
    collectStream: 'current',
    collectCareerGoal: 'specific',
    showCareerFamilies: true,
  }),
  undergraduate: Object.freeze({ label: 'Career Direction', formalCareerDecision: true }),
  postgraduate: Object.freeze({ label: 'Specialisation & Career Direction', formalCareerDecision: true }),
  research: Object.freeze({ label: 'Research & Specialisation Direction', formalCareerDecision: true }),
  transition: Object.freeze({ label: 'Transition & Replanning', formalCareerDecision: true }),
});

function normaliseGrade(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim().toLowerCase();
  if (/^7$|grade\s*7|class\s*7/.test(text)) return 7;
  if (/^8$|grade\s*8|class\s*8/.test(text)) return 8;
  if (/^9$|grade\s*9|class\s*9/.test(text)) return 9;
  if (/^10$|grade\s*10|class\s*10/.test(text)) return 10;
  if (/^11$|grade\s*11|class\s*11/.test(text)) return 11;
  if (/^12$|grade\s*12|class\s*12/.test(text)) return 12;
  return null;
}

export function assessmentStageForGrade(grade) {
  const n = normaliseGrade(grade);
  if (n === 7 || n === 8) return STUDENT_ASSESSMENT_STAGES.GRADE_7_8;
  if (n === 9) return STUDENT_ASSESSMENT_STAGES.GRADE_9;
  if (n === 10) return STUDENT_ASSESSMENT_STAGES.GRADE_10;
  if (n === 11) return STUDENT_ASSESSMENT_STAGES.GRADE_11;
  if (n === 12) return STUDENT_ASSESSMENT_STAGES.GRADE_12;
  return null;
}

export function assessmentStageMeta(stage) {
  return STUDENT_ASSESSMENT_STAGE_META[stage] || null;
}

export function studentAssessmentRouting({ grade, pathway } = {}) {
  const path = String(pathway || '').toLowerCase();
  if (['diploma', 'polytechnic', 'iti', 'vocational', 'skill'].some(token => path.includes(token))) {
    return STUDENT_ASSESSMENT_STAGES.DIPLOMA_VOCATIONAL;
  }
  return assessmentStageForGrade(grade);
}

export function isCareerAssessmentEligible(grade) {
  const n = normaliseGrade(grade);
  return n !== null && n >= 7 && n <= 12;
}

export function careerGoalModeForStage(stage) {
  return assessmentStageMeta(stage)?.collectCareerGoal || 'none';
}

export { normaliseGrade as normaliseStudentGrade };
