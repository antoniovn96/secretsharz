export const MEMORY_MATCH_CARDS = Object.freeze([
  { id: 'a1', pair: 'A', label: '🌱' }, { id: 'a2', pair: 'A', label: '🌱' },
  { id: 'b1', pair: 'B', label: '⭐' }, { id: 'b2', pair: 'B', label: '⭐' },
  { id: 'c1', pair: 'C', label: '🎨' }, { id: 'c2', pair: 'C', label: '🎨' },
  { id: 'd1', pair: 'D', label: '🧠' }, { id: 'd2', pair: 'D', label: '🧠' },
]);

export function isMatch(first, second) {
  return Boolean(first && second && first.id !== second.id && first.pair === second.pair);
}
