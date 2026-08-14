import {
  ASSESSMENT_STAGES,
  getAssessmentStages,
  getProgress,
  isAssessmentComplete,
  buildAssessmentSession,
  advanceAssessment,
} from '../assessmentFlow';

import {
  canonicalAssessmentQuestions,
  canonicalAssessmentQuestionMap,
  getQuestion,
  validateAnswer,
} from '../assessmentQuestionCatalog';

describe('career assessment flow', () => {
  test('starts with identity and includes academic context for students', () => {
    const stages = getAssessmentStages('student');
    expect(stages[0].id).toBe('identity');
    expect(stages.some((stage) => stage.id === 'academic')).toBe(true);
    expect(stages).toHaveLength(ASSESSMENT_STAGES.length);
  });

  test('working professionals retain the same core flow without requiring school academics', () => {
    const stages = getAssessmentStages('working_professional');
    expect(stages.some((stage) => stage.id === 'academic')).toBe(false);
    expect(stages.some((stage) => stage.id === 'interests')).toBe(true);
  });

  test('progress is calculated from the canonical stage order', () => {
    expect(getProgress('identity', 'student')).toBeGreaterThan(0);
    expect(getProgress('missing', 'student')).toBe(0);
  });

  test('completion requires every applicable stage', () => {
    const stages = getAssessmentStages('working_professional');
    const ids = stages.map((stage) => stage.id);
    expect(isAssessmentComplete(ids.slice(0, -1), 'working_professional')).toBe(false);
    expect(isAssessmentComplete(ids, 'working_professional')).toBe(true);
  });

  test('session can advance and preserve completed stages', () => {
    const session = buildAssessmentSession({
      personId: 'person-1',
      status: 'student',
      age: 16,
      attemptId: 'attempt-1',
    });
    const next = advanceAssessment(session, 'identity');
    expect(next.completedStageIds).toContain('identity');
    expect(next.currentStage).toBe('likes');
  });
});

describe('canonical question catalog', () => {
  test('maps RIASEC questions to the interests dimension', () => {
    const riasec = canonicalAssessmentQuestions.filter((question) => question.code);
    expect(riasec.length).toBeGreaterThan(0);
    expect(riasec.every((question) => question.dimension === 'interests')).toBe(true);
  });

  test('does not turn demographic identity fields into psychological scores', () => {
    expect(canonicalAssessmentQuestionMap.dem_01).toBeUndefined();
    expect(canonicalAssessmentQuestionMap.dem_02).toBeUndefined();
    expect(canonicalAssessmentQuestionMap.dem_03).toBeUndefined();
    expect(canonicalAssessmentQuestionMap.dem_04).toBeUndefined();
  });

  test('exposes known questions through the lookup helper', () => {
    const question = getQuestion('r_01');
    expect(question).not.toBeNull();
    expect(question.code).toBe('R');
  });

  test('validates scale answers against the original scale bounds', () => {
    expect(validateAnswer('r_01', 1).valid).toBe(true);
    expect(validateAnswer('r_01', 5).valid).toBe(true);
    expect(validateAnswer('r_01', 6).valid).toBe(false);
  });

  test('rejects unknown question ids', () => {
    expect(validateAnswer('does_not_exist', 3)).toEqual({
      valid: false,
      reason: 'unknown_question',
    });
  });
});
