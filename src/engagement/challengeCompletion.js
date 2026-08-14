export function buildCompletion({ personId, challengeId, completedAt = new Date().toISOString(), result = null }) {
  if (!personId || !challengeId) throw new Error('personId and challengeId are required.');
  return { personId, challengeId, completedAt, result };
}

export function shouldAward(completion, existingCompletions = []) {
  if (!completion) return false;
  const day = completion.completedAt.slice(0, 10);
  return !existingCompletions.some(item => item.challengeId === completion.challengeId && String(item.completedAt).slice(0, 10) === day);
}

export function buildReward(completion, challenge) {
  return {
    personId: completion.personId,
    challengeId: completion.challengeId,
    xp: Math.max(0, Number(challenge?.points) || 0),
    awardedAt: completion.completedAt,
  };
}
