// Secret Sharz — browser client for RIASEC V1 migration endpoint
// This helper sends raw answers only. The server performs the authoritative scoring.

import { getAuth } from 'firebase/auth';

export async function submitRiasecAssessmentV1ToServer({
  answers,
  startedAt = null,
  previousAssessmentResultId = null,
  attemptNumber = 1,
  language = null,
  locale = null,
  studentStage = null,
}) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to submit this assessment.');

  const idToken = await user.getIdToken();

  const response = await fetch('/api/career/assessment/riasec-v1', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + idToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answers,
      startedAt,
      previousAssessmentResultId,
      attemptNumber,
      language,
      locale,
      studentStage,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Unable to submit the assessment.');
    error.status = response.status;
    error.code = payload.code || null;
    error.details = payload.details || null;
    throw error;
  }

  return payload;
}

export async function getLatestRiasecAssessmentV1FromServer() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to view your assessment.');

  const idToken = await user.getIdToken();

  const response = await fetch('/api/career/assessment/riasec-v1', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + idToken,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Unable to load the assessment.');
    error.status = response.status;
    throw error;
  }

  return payload.result || null;
}
