// Healthy, non-compulsive dashboard engagement contracts.
// Rewards are intentionally bounded and should never depend on time spent online.

export const CHALLENGE_TYPES = Object.freeze(['puzzle', 'reflection', 'knowledge', 'creative']);
export const REWARD_TYPES = Object.freeze(['xp', 'badge', 'cup']);

export function buildDailyChallenge({ id, title, type, points = 10, activeDate }) {
  if (!id || !title || !activeDate || !CHALLENGE_TYPES.includes(type)) throw new Error('Invalid daily challenge.');
  if (!Number.isInteger(points) || points < 0 || points > 50) throw new Error('Challenge points must be between 0 and 50.');
  return { id, title, type, points, activeDate, status: 'published' };
}

export function buildEngagementSnapshot({ personId, totalXp = 0, currentStreak = 0, longestStreak = 0, completedToday = false, badges = [], cups = [] }) {
  if (!personId) throw new Error('personId is required.');
  return {
    personId,
    totalXp: Math.max(0, Number(totalXp) || 0),
    currentStreak: Math.max(0, Number(currentStreak) || 0),
    longestStreak: Math.max(0, Number(longestStreak) || 0),
    completedToday: Boolean(completedToday),
    badges: Array.isArray(badges) ? badges : [],
    cups: Array.isArray(cups) ? cups : [],
  };
}

export function awardDailyChallenge(snapshot, challenge) {
  if (!snapshot || !challenge || snapshot.completedToday) return snapshot;
  return {
    ...snapshot,
    totalXp: snapshot.totalXp + challenge.points,
    completedToday: true,
  };
}

export function getCupEligibility(snapshot, daysInPeriod) {
  const days = Math.max(0, Number(daysInPeriod) || 0);
  return {
    weekly: days >= 5,
    monthly: days >= 20,
    annual: days >= 200,
  };
}
