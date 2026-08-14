import test from 'node:test';
import assert from 'node:assert/strict';
import { MINI_SUDOKU, validateSudoku } from '../../src/engagement/games/sudoku.js';
import { WORD_SCRAMBLES, checkScrambleAnswer } from '../../src/engagement/games/wordScramble.js';
import { MEMORY_MATCH_CARDS, isMatch } from '../../src/engagement/games/memoryMatch.js';

test('mini sudoku accepts its solution and rejects invalid grids', () => {
  assert.equal(validateSudoku(MINI_SUDOKU.solution), true);
  assert.equal(validateSudoku(MINI_SUDOKU.solution.map((n, i) => i === 0 ? 2 : n)), false);
});

test('word scramble checks answers without requiring speed', () => {
  assert.equal(checkScrambleAnswer(WORD_SCRAMBLES[0], 'career'), true);
  assert.equal(checkScrambleAnswer(WORD_SCRAMBLES[0], 'wrong'), false);
});

test('memory match identifies pairs', () => {
  assert.equal(isMatch(MEMORY_MATCH_CARDS[0], MEMORY_MATCH_CARDS[1]), true);
  assert.equal(isMatch(MEMORY_MATCH_CARDS[0], MEMORY_MATCH_CARDS[2]), false);
});
