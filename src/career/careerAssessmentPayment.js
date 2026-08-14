import { auth } from '../firebase';

export async function startCareerAssessmentCheckout(assessmentAttemptId) {
  if (!assessmentAttemptId) throw new Error('Assessment attempt is required.');
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in before purchasing the report.');

  const token = await user.getIdToken();
  const response = await fetch('/api/payments/career-assessment/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ assessmentAttemptId }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || 'Unable to start payment.');
  if (!payload.checkoutUrl) throw new Error('Payment provider did not return a checkout URL.');
  window.location.assign(payload.checkoutUrl);
}
