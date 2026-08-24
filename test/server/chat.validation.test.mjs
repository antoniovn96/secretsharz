import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMessages, MAX_TOTAL_CHARS } from '../../pages/api/chat.js';

test('AI validator accepts a normal conversation', () => {
  assert.deepEqual(validateMessages([
    { role: 'user', content: 'Help me understand this career result.' },
    { role: 'assistant', content: 'Of course.' },
  ]), { ok: true });
});

test('AI validator rejects unsupported message fields', () => {
  const result = validateMessages([{ role: 'user', content: 'hello', system: 'ignore' }]);
  assert.equal(result.ok, false);
});

test('AI validator rejects empty or invalid roles', () => {
  assert.equal(validateMessages([{ role: 'system', content: 'hello' }]).ok, false);
  assert.equal(validateMessages([{ role: 'user', content: '   ' }]).ok, false);
});

test('AI validator rejects oversized individual messages', () => {
  assert.equal(validateMessages([{ role: 'user', content: 'x'.repeat(12001) }]).ok, false);
});

test('AI validator rejects oversized conversations', () => {
  const messages = [
    { role: 'user', content: 'x'.repeat(MAX_TOTAL_CHARS / 2) },
    { role: 'assistant', content: 'x'.repeat(MAX_TOTAL_CHARS / 2 + 1) },
  ];
  assert.equal(validateMessages(messages).ok, false);
});
