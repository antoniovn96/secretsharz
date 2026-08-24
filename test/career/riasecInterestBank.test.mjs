import test from 'node:test';
import assert from 'node:assert/strict';
import { RIASEC_ITEMS, RIASEC_RESPONSE_OPTIONS, RIASEC_ITEMS_PER_CODE } from '../../src/career/riasecInterestBank.js';

test('RIASEC bank has 36 activity-focused items', () => {
  assert.equal(RIASEC_ITEMS.length, 36);
  assert.deepEqual(RIASEC_RESPONSE_OPTIONS, ['Strongly dislike', 'Dislike', 'Unsure', 'Like', 'Strongly like']);
  for (const [code, count] of Object.entries(RIASEC_ITEMS_PER_CODE)) {
    assert.equal(RIASEC_ITEMS.filter(item => item.riasecKey === code).length, count);
  }
});

test('RIASEC items use interest-specific response anchors', () => {
  for (const item of RIASEC_ITEMS) {
    assert.equal(item.responseAnchor, 'interest');
    assert.deepEqual(item.options, RIASEC_RESPONSE_OPTIONS);
    assert.equal(item.scaleMin, 1);
    assert.equal(item.scaleMax, 5);
  }
});
