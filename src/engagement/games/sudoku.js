export const MINI_SUDOKU = Object.freeze({
  id: 'mini-sudoku-4x4',
  size: 4,
  grid: [1, 0, 0, 4, 0, 4, 1, 0, 0, 1, 4, 0, 4, 0, 0, 1],
  solution: [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1],
  instructions: 'Fill each row, column and 2×2 box with 1–4. No timer is required.',
});

export function validateSudoku(grid) {
  if (!Array.isArray(grid) || grid.length !== 16 || grid.some(n => !Number.isInteger(n) || n < 1 || n > 4)) return false;
  const rows = [0,1,2,3].map(r => grid.slice(r * 4, r * 4 + 4));
  const cols = [0,1,2,3].map(c => [grid[c], grid[c + 4], grid[c + 8], grid[c + 12]]);
  const boxes = [0,1,2,3].map(b => { const r = Math.floor(b / 2) * 2; const c = (b % 2) * 2; return [grid[r*4+c], grid[r*4+c+1], grid[(r+1)*4+c], grid[(r+1)*4+c+1]]; });
  return [...rows, ...cols, ...boxes].every(group => new Set(group).size === 4);
}
