import test from 'node:test';
import assert from 'node:assert/strict';
import { decideAccess } from '../../src/security/accessDecision.js';

const base = {
  role: 'professional',
  relationship: 'active',
  dataDomain: 'counselling',
  purpose: 'service_delivery',
  consent: 'active',
  safeguarding: 'normal',
  timeStatus: 'active',
  serviceDomain: 'counselling',
};

test('access decision denies unknown consent', () => {
  const result = decideAccess({ ...base, consent: 'unknown' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'consent_unknown');
});

test('access decision denies withdrawn consent', () => {
  const result = decideAccess({ ...base, consent: 'withdrawn' });
  assert.equal(result.allowed, false);
});

test('access decision allows active consent for matching specialist domain', () => {
  const result = decideAccess(base);
  assert.equal(result.allowed, true);
});

test('access decision denies cross-domain specialist access', () => {
  const result = decideAccess({ ...base, dataDomain: 'sen', serviceDomain: 'counselling' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'service_domain_mismatch');
});

test('access decision denies a purpose not allowed by the service', () => {
  const result = decideAccess({ ...base, purpose: 'institution_view' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'purpose_not_allowed_for_service');
});

test('safeguarding remains an explicit exceptional path', () => {
  const result = decideAccess({ ...base, consent: 'unknown', safeguarding: 'active', purpose: 'safeguarding' });
  assert.equal(result.allowed, true);
});
