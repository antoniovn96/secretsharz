import { ASSESSMENT_VERSION, CANDIDATE_STATUSES } from './assessmentEngine';

export const ASSESSMENT_STAGES = Object.freeze([
  { id: 'identity', title: 'About You', subtitle: 'Start with your current life and study/work context.' },
  { id: 'likes', title: 'What You Like', subtitle: 'Explore subjects, activities, interests and environments you enjoy.' },
  { id: 'dislikes', title: 'What You Do Not Like', subtitle: 'Knowing what does not fit is useful too.' },
  { id: 'goals', title: 'Your Goals', subtitle: 'Tell us what matters to you in your future.' },
  { id: 'academic', title: 'Academic Profile', subtitle: 'Students can add subjects, marks and confidence. Professionals can skip this.' },
  { id: 'interests', title: 'Interest Explorer', subtitle: 'Explore six broad interest patterns without treating any one result as destiny.' },
  { id: 'aptitude', title: 'Aptitude Confidence', subtitle: 'Tell us where you currently feel confident. This is not an ability diagnosis.' },
  { id: 'work_style', title: 'Work Style', subtitle: 'Explore the environments and ways of working that suit you.' },
  { id: 'values', title: 'Values & Motivation', subtitle: 'Explore what you want your future work to give you.' },
  { id: 'decision', title: 'Decision Making', subtitle: 'Explore how you approach choices and uncertainty.' },
  { id: 'resilience', title: 'Growth & Resilience', subtitle: 'Explore persistence, adaptability and willingness to learn.' },
  { id: 'scenarios', title: 'Career Scenarios', subtitle: 'Respond to realistic situations rather than guessing a job title.' },
]);

export function getAssessmentStages(status) {
  if (!CANDIDATE_STATUSES.includes(status)) return ASSESSMENT_STAGES;
  return status === 'student' ? ASSESSMENT_STAGES : ASSESSMENT_STAGES.filter((stage) => stage.id !== 'academic');
}

export function getStageIndex(stageId, status) {
  return getAssessmentStages(status).findIndex((stage) => stage.id === stageId);
}

export function getProgress(stageId, status) {
  const stages = getAssessmentStages(status);
  const index = getStageIndex(stageId, status);
  if (index < 0 || !stages.length) return 0;
  return Math.round(((index + 1) / stages.length) * 100);
}

export function isAssessmentComplete(completedStageIds = [], status) {
  const stages = getAssessmentStages(status);
  const completed = new Set(completedStageIds);
  return stages.every((stage) => completed.has(stage.id));
}

export function buildAssessmentSession({ personId, status, age, attemptId }) {
  if (!personId) throw new Error('personId is required.');
  if (!CANDIDATE_STATUSES.includes(status)) throw new Error('Invalid candidate status.');
  if (!Number.isInteger(age) || age < 10 || age > 100) throw new Error('Invalid age.');
  if (!attemptId) throw new Error('attemptId is required.');

  return { attemptId, personId, assessmentVersion: ASSESSMENT_VERSION, status, age, currentStage: getAssessmentStages(status)[0].id, completedStageIds: [], startedAt: null, lastSavedAt: null, completedAt: null };
}

export function advanceAssessment(session, stageId) {
  const stages = getAssessmentStages(session.status);
  const index = stages.findIndex((stage) => stage.id === stageId);
  if (index < 0) throw new Error('Unknown assessment stage.');
  const completed = new Set(session.completedStageIds || []);
  completed.add(stageId);
  const next = stages[index + 1];
  return { ...session, completedStageIds: [...completed], currentStage: next ? next.id : stageId, completedAt: next ? session.completedAt : new Date().toISOString() };
}
