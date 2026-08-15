import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInstitutionPricing } from '../../src/institution/institutionPricing.js';

test('institution pricing calculates gross amount without discount', () => {
  assert.deepEqual(calculateInstitutionPricing({ licenseCount: 150, pricePerLicense: 1000, discountType: 'none', discountValue: 0 }), {
    purchased: 150, pricePerLicense: 1000, discountType: 'none', discountValue: 0,
    grossAmount: 150000, discountAmount: 0, totalAmount: 150000,
  });
});

test('percentage discount is capped at gross amount', () => {
  const result = calculateInstitutionPricing({ licenseCount: 10, pricePerLicense: 1000, discountType: 'percentage', discountValue: 110 });
  assert.equal(result.discountAmount, 10000);
  assert.equal(result.totalAmount, 0);
});

test('fixed total discount applies once to the institution order', () => {
  const result = calculateInstitutionPricing({ licenseCount: 150, pricePerLicense: 1000, discountType: 'fixed_total', discountValue: 5000 });
  assert.equal(result.discountAmount, 5000);
  assert.equal(result.totalAmount, 145000);
});

test('fixed per-license discount applies across all purchased licenses', () => {
  const result = calculateInstitutionPricing({ licenseCount: 150, pricePerLicense: 1000, discountType: 'fixed_per_license', discountValue: 100 });
  assert.equal(result.discountAmount, 15000);
  assert.equal(result.totalAmount, 135000);
});

test('legacy fixed discount maps to fixed per-license', () => {
  const result = calculateInstitutionPricing({ licenseCount: 5, pricePerLicense: 1000, discountType: 'fixed', discountValue: 100 });
  assert.equal(result.discountType, 'fixed_per_license');
  assert.equal(result.totalAmount, 4500);
});
