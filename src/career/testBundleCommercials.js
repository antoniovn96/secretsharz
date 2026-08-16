import { TEST_BUNDLES } from './testBundleCatalogue';

/**
 * Institutional commercial catalogue for the five test families.
 * Prices are intentionally Admin-configurable; this file defines product
 * identity and entitlement semantics, not a permanent retail price list.
 */
export const INSTITUTIONAL_TEST_PASSES = Object.freeze(TEST_BUNDLES.map(bundle => ({
  id: `institution_pass_${bundle.id}`,
  sku: `INSTITUTION_${bundle.sku}`,
  bundleId: bundle.id,
  title: `${bundle.title} Pass`,
  audience: 'institution',
  billingUnit: 'student_license',
  priceMode: 'admin_configurable',
  basePrice: null,
  supportsNegotiatedPrice: true,
  supportsPercentageDiscount: true,
  supportsFixedDiscount: true,
  supportsSponsored: true,
  supportsAddOnLicences: true,
  licenceIncludes: bundle.familyIds,
  deliveryMode: bundle.deliveryMode,
  reportPages: bundle.reportPages,
  durationMinutes: bundle.durationMinutes,
  singleIntegratedReport: true,
  parentSharingSupported: true,
  institutionalReportSupported: true,
  academicYearScoped: true,
  entitlementIsReusableByStudentAccount: true
})));

export function getInstitutionalTestPass(bundleId) {
  return INSTITUTIONAL_TEST_PASSES.find(pass => pass.bundleId === bundleId) || null;
}

export function getInstitutionalPassForSku(sku) {
  return INSTITUTIONAL_TEST_PASSES.find(pass => pass.sku === sku) || null;
}

export function getInstitutionalPassesForFamily(familyId) {
  return INSTITUTIONAL_TEST_PASSES.filter(pass => pass.licenceIncludes.includes(familyId));
}
