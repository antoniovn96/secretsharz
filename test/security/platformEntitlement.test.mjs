import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePlatformEntitlement, resolvePlatformAccess } from '../../src/security/platformEntitlement.js';

test('platform access remains active when institution membership ends', () => {
  assert.deepEqual(resolvePlatformAccess({ platformEntitlement: { tier: 'free', active: true }, activeInstitutionCount: 0 }), { tier: 'free', institutionAccess: false });
});

test('premium entitlement is independent of institution membership', () => {
  assert.deepEqual(resolvePlatformAccess({ platformEntitlement: { tier: 'premium', active: true }, activeInstitutionCount: 0 }), { tier: 'premium', institutionAccess: false });
});

test('invalid platform tier is rejected', () => {
  assert.throws(() => normalizePlatformEntitlement({ tier: 'school' }), /Invalid platform tier/);
});
