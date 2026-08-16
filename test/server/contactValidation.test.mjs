import assert from 'node:assert/strict';
import test from 'node:test';
import { normaliseMobileNumber, validateMobileNumber } from '../../src/platform/contactValidation.js';

test('accepts valid 10-digit mobile numbers beginning 6-9', () => {
  for (const value of ['9876543210', '8123456789', '7012345678', '6123456789']) {
    assert.equal(validateMobileNumber(value).valid, true);
  }
});

test('rejects mobile numbers with invalid length', () => {
  assert.equal(validateMobileNumber('987654321').valid, false);
  assert.equal(validateMobileNumber('98765432101').valid, false);
});

test('rejects mobile numbers that do not begin 6-9', () => {
  assert.equal(validateMobileNumber('5876543210').valid, false);
  assert.equal(validateMobileNumber('0123456789').valid, false);
});

test('normalises accidental spaces without accepting non-digits as part of the stored number', () => {
  assert.equal(normaliseMobileNumber('98765 43210'), '9876543210');
  assert.equal(normaliseMobileNumber('+91 98765 43210'), '919876543210');
});
