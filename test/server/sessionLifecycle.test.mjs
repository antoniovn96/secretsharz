import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, transitionSession, buildSessionFollowUp } from '../../src/booking/sessionLifecycle.js';

test('session lifecycle allows only valid transitions', () => {
  assert.equal(canTransition('confirmed', 'in_progress'), true);
  assert.equal(canTransition('confirmed', 'completed'), false);
  assert.equal(canTransition('completed', 'confirmed'), false);
});

test('session can be started and completed', () => {
  const started = transitionSession({ status: 'confirmed' }, 'in_progress', 'counsellor-1');
  const completed = transitionSession(started, 'completed', 'counsellor-1');
  assert.equal(completed.status, 'completed');
  assert.equal(completed.updatedBy, 'counsellor-1');
});

test('follow-up is tied to the session and student', () => {
  const followUp = buildSessionFollowUp({ sessionId: 's1', personId: 'p1', service: 'career', nextStep: 'roadmap', counsellorNote: 'Explore two course options.' });
  assert.equal(followUp.sessionId, 's1');
  assert.equal(followUp.personId, 'p1');
});
