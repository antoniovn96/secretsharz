/**
 * Secret Sharz Career Assessment Pricing Policy
 *
 * Canonical commercial rules captured from the founder decisions on
 * 27 September 2026.
 *
 * IMPORTANT:
 * - Values here are a policy/reference layer, not the live price store.
 * - Live pricing must remain Admin/Accounts configurable.
 * - Tax is separate from the displayed base price.
 * - Do not put these values inside psychometric scoring code.
 */

export const CAREER_ASSESSMENT_PRICING_POLICY_VERSION = '1.0.0';

export const CAREER_ASSESSMENT_MARKET_RULES = Object.freeze({
  IN: Object.freeze({
    currency: 'INR',
    taxInclusive: false,
    individual: Object.freeze({
      singleAssessment: 19900,
      careerDirectionTrio: 39900,
    }),
    institution: Object.freeze({
      bulkMinimumOrdersExclusive: 10,
      singleAssessment: 19900,
      careerDirectionTrio: 29900,
    }),
  }),
});

export const CAREER_ASSESSMENT_BULK_RULE = Object.freeze({
  appliesWhenOrderQuantity: 'greater_than_10',
  minimumEligibleQuantity: 11,
});

export const COLLEGE_DISCOVERY_COMMERCIAL_RULE = Object.freeze({
  individual: Object.freeze({
    freeClosestMatches: 3,
    additionalMatchesUnlockPrice: 19900,
    pricingBasis: 'full_additional_match_set',
  }),
  institution: Object.freeze({
    sponsoringPurchaseThresholdExclusive: 10000000,
    entitlementBasis: 'purchased_student_codes',
    lifetimeUntilConsumed: true,
    annualExpiry: false,
  }),
});

/**
 * The founder has explicitly chosen localized international pricing rather
 * than direct INR conversion. Exact market prices remain admin-configurable.
 *
 * Keeping this registry empty is intentional: no country-specific number is
 * invented here until the Admin/Accounts commercial table is populated.
 */
export const INTERNATIONAL_PRICING_POLICY = Object.freeze({
  strategy: 'localized_admin_configured',
  minimumPositioningReferenceUsd: 5,
  taxInclusiveByDefault: false,
  marketOverrides: Object.freeze({}),
});

export function getIndiaIndividualPricePaise(product) {
  if (product === 'single_assessment') return CAREER_ASSESSMENT_MARKET_RULES.IN.individual.singleAssessment;
  if (product === 'career_direction_trio') return CAREER_ASSESSMENT_MARKET_RULES.IN.individual.careerDirectionTrio;
  return null;
}

export function getIndiaInstitutionPricePaise(product) {
  if (product === 'single_assessment') return CAREER_ASSESSMENT_MARKET_RULES.IN.institution.singleAssessment;
  if (product === 'career_direction_trio') return CAREER_ASSESSMENT_MARKET_RULES.IN.institution.careerDirectionTrio;
  return null;
}

export function qualifiesForInstitutionBulk(quantity) {
  return Number.isInteger(quantity) && quantity >= CAREER_ASSESSMENT_BULK_RULE.minimumEligibleQuantity;
}

export function calculateCollegeDiscoveryInstitutionCoverage(purchasedStudentCodes) {
  if (!Number.isInteger(purchasedStudentCodes) || purchasedStudentCodes < 0) {
    return null;
  }

  return {
    purchasedStudentCodes,
    lifetimeUntilConsumed: true,
    annualExpiry: false,
  };
}
