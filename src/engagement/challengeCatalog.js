import { buildDailyChallenge } from './engagementModel';

export const SAFE_CHALLENGES = Object.freeze([
  buildDailyChallenge({ id: 'sudoku-mini', title: 'Mini Sudoku', type: 'puzzle', points: 20, activeDate: 'daily' }),
  buildDailyChallenge({ id: 'word-scramble', title: 'Word Scramble', type: 'puzzle', points: 15, activeDate: 'daily' }),
  buildDailyChallenge({ id: 'memory-match', title: 'Memory Match', type: 'knowledge', points: 15, activeDate: 'daily' }),
  buildDailyChallenge({ id: 'gratitude-three', title: 'Three Good Things', type: 'reflection', points: 10, activeDate: 'daily' }),
  buildDailyChallenge({ id: 'career-curiosity', title: 'Career Curiosity Question', type: 'knowledge', points: 15, activeDate: 'daily' }),
  buildDailyChallenge({ id: 'creative-minute', title: 'One-Minute Creative Challenge', type: 'creative', points: 10, activeDate: 'daily' }),
]);

export function getChallengeById(id) {
  return SAFE_CHALLENGES.find(challenge => challenge.id === id) || null;
}
