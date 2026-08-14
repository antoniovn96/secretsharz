import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDailyChallenge, buildEngagementSnapshot, awardDailyChallenge, getCupEligibility } from '../../src/engagement/engagementModel.js';

test('daily challenges are bounded and safe', () => {
  const challenge = buildDailyChallenge({ id: 's', title: 'Mini Sudoku', type: 'puzzle', points: 20, activeDate: 'daily' });
  assert.equal(challenge.points, 20);
  assert.throws(() => buildDailyChallenge({ id: 'x', title: 'x', type: 'puzzle', points: 51, activeDate: 'daily' }));
});

test('daily completion awards points only once', () => {
  const challenge = buildDailyChallenge({ id: 's', title: 'Mini Sudoku', type: 'puzzle', points: 20, activeDate: 'daily' });
  const first = awardDailyChallenge(buildEngagementSnapshot({ personId: 'p1' }), challenge);
  const second = awardDailyChallenge(first, challenge);
  assert.equal(first.totalXp, 20);
  assert.equal(second.totalXp, 20);
});

test('cup eligibility is based on bounded completed-day milestones', () => {
  assert.deepEqual(getCupEligibility({}, 5), { weekly: true, monthly: false, annual: false });
  assert.deepEqual(getCupEligibility({}, 20), { weekly: true, monthly: true, annual: false });
  assert.deepEqual(getCupEligibility({}, 200), { weekly: true, monthly: true, annual: true });
});
