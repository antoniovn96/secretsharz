export const WORD_SCRAMBLES = Object.freeze([
  { id: 'career', letters: 'RECARE', answer: 'CAREER', hint: 'Something you may explore over time.' },
  { id: 'learn', letters: 'NRLEA', answer: 'LEARN', hint: 'To gain knowledge or a skill.' },
  { id: 'create', letters: 'TEACRE', answer: 'CREATE', hint: 'To make something new.' },
  { id: 'future', letters: 'UTERUF', answer: 'FUTURE', hint: 'The time that has not happened yet.' },
]);

export function checkScrambleAnswer(item, answer) {
  return Boolean(item && typeof answer === 'string' && answer.trim().toUpperCase() === item.answer);
}
