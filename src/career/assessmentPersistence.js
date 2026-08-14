import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ASSESSMENT_VERSION } from './assessmentEngine';
import { buildAssessmentSession } from './assessmentFlow';

export function assessmentRef(attemptId) {
  if (!attemptId) throw new Error('attemptId is required.');
  return doc(db, 'assessments', attemptId);
}

export async function createAssessmentAttempt({ personId, status, age, attemptId, input = {}, answers = {} }) {
  const session = buildAssessmentSession({ personId, status, age, attemptId });
  await setDoc(assessmentRef(attemptId), {
    attemptId,
    personId,
    assessmentVersion: ASSESSMENT_VERSION,
    status,
    age,
    input,
    answers,
    currentStage: session.currentStage,
    completedStageIds: [],
    paymentStatus: 'unpaid',
    completed: false,
    createdAt: serverTimestamp(),
    startedAt: serverTimestamp(),
    lastSavedAt: serverTimestamp(),
    completedAt: null,
  });
  return session;
}

export async function loadAssessmentAttempt(attemptId, personId) {
  const snapshot = await getDoc(assessmentRef(attemptId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (personId && data.personId !== personId) throw new Error('Assessment attempt does not belong to this account.');
  return data;
}

export async function saveAssessmentProgress({ attemptId, personId, input, answers, currentStage, completedStageIds, completed = false }) {
  const ref = assessmentRef(attemptId);
  const existing = await getDoc(ref);
  if (!existing.exists()) throw new Error('Assessment attempt not found.');
  if (existing.data().personId !== personId) throw new Error('Assessment attempt does not belong to this account.');
  if (existing.data().paymentStatus === 'paid') throw new Error('A paid assessment attempt cannot be altered.');

  await updateDoc(ref, {
    input: input || {},
    answers: answers || {},
    currentStage,
    completedStageIds: Array.isArray(completedStageIds) ? completedStageIds : [],
    completed: Boolean(completed),
    lastSavedAt: serverTimestamp(),
    ...(completed ? { completedAt: serverTimestamp() } : {}),
  });
}
