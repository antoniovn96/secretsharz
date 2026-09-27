import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAREER_ASSESSMENT_MARKET_RULES,
  CAREER_ASSESSMENT_BULK_RULE,
  COLLEGE_DISCOVERY_COMMERCIAL_RULE,
  INTERNATIONAL_PRICING_POLICY,
  getIndiaIndividualPricePaise,
  getIndiaInstitutionPricePaise,
  qualifiesForInstitutionBulk,
  calculateCollegeDiscoveryInstitutionCoverage,
} from '../../src/career/assessmentPricingPolicy.js';

test('India individual pricing is tax-exclusive and founder-controlled', () => {
  assert.equal(CAREER_ASSESSMENT_MARKET_RULES.IN.taxInclusive, false);
  assert.equal(getIndiaIndividualPricePaise('single_assessment'), 19900);
  assert.equal(getIndiaIndividualPricePaise('career_direction_trio'), 39900);
});

test('India school pricing uses the founder-approved bulk threshold', () => {
  assert.equal(CAREER_ASSESSMENT_BULK_RULE.minimumEligibleQuantity, 11);
  assert.equal(getIndiaInstitutionPricePaise('single_assessment'), 19900);
  assert.equal(getIndiaInstitutionPricePaise('career_direction_trio'), 29900);
  assert.equal(qualifiesForInstitutionBulk(10), false);
  assert.equal(qualifiesForInstitutionBulk(11), true);
});

test('international pricing is localized and not a direct INR conversion', () => {
  assert.equal(INTERNATIONAL_PRICING_POLICY.strategy, 'localized_admin_configured');
  assert.equal(INTERNATIONAL_PRICING_POLICY.minimumPositioningReferenceUsd, 5);
  assert.deepEqual(INTERNATIONAL_PRICING_POLICY.marketOverrides, {});
});

test('College Discovery gives 3 free closest matches and unlocks all additional matches', () => {
  assert.equal(COLLEGE_DISCOVERY_COMMERCIAL_RULE.individual.freeClosestMatches, 3);
  assert.equal(COLLEGE_DISCOVERY_COMMERCIAL_RULE.individual.additionalMatchesUnlockPrice, 19900);
  assert.equal(COLLEGE_DISCOVERY_COMMERCIAL_RULE.individual.pricingBasis, 'full_additional_match_set');
});

test('school College Discovery coverage is lifetime quantity-based until codes are consumed', () => {
  const result = calculateCollegeDiscoveryInstitutionCoverage(251);
  assert.deepEqual(result, {
    purchasedStudentCodes: 251,
    lifetimeUntilConsumed: true,
    annualExpiry: false,
  });
  assert.equal(
    COLLEGE_DISCOVERY_COMMERCIAL_RULE.institution.sponsoringPurchaseThresholdExclusive,
    10000000,
  );
});
