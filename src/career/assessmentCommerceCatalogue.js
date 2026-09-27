import {
  ASSESSMENT_MODULES,
  getAssessmentModule,
} from './assessmentLibrary.js';

/**
 * Secret Sharz Assessment Commerce Catalogue
 *
 * This is the canonical commercial identity layer for Career Guidance.
 *
 * Assessment identity and commercial identity stay separate:
 * - an assessment module is the thing being measured;
 * - an assessment product is the independently purchasable SKU mapped to one module;
 * - a package composes multiple module products without creating a new psychometric identity.
 *
 * Prices are deliberately referenced by stable price keys. Live prices, tax,
 * discounts, currency and institutional terms belong to the commerce/pricing layer.
 */

export const ASSESSMENT_COMMERCE_CATALOGUE_VERSION = '1.1.0';

const purchasableModules = Object.freeze(
  ASSESSMENT_MODULES.filter((module) => module.status !== 'catalogue'),
);

export const ASSESSMENT_PRODUCTS = Object.freeze(
  purchasableModules.map((module) => ({
    id: `product_${module.id}`,
    sku: module.sku,
    title: module.title,
    shortTitle: module.shortTitle,
    assessmentModuleId: module.id,
    priceKey: module.individualPriceKey,
    pricingProfileKeys: Object.freeze({
      individual: module.individualPriceKey,
      institution: `institution_${module.individualPriceKey}`,
    }),
    pricingMode: 'standalone_configured_price',
    independentlyPurchasable: true,
    bundleEligible: true,
    reusableResult: true,
    retakePolicyKey: `retake_${module.id}`,
  })),
);

/**
 * Founder-approved packages.
 *
 * Career Direction Trio is deliberately:
 *   RIASEC + Aptitude/Reasoning + Career Values
 *
 * Career Decision Readiness is not part of the trio. It remains an
 * independently purchasable assessment and may contribute to broader packages.
 */
export const ASSESSMENT_PACKAGES = Object.freeze([
  {
    id: 'package_interest_and_values',
    sku: 'PACKAGE_INTEREST_VALUES',
    title: 'Career Interests + Work Values',
    moduleIds: ['career_interest_inventory', 'work_values_assessment'],
    priceKey: 'package_interest_values',
    pricingProfileKeys: Object.freeze({
      individual: 'package_interest_values',
      institutionBulk: 'institution_package_interest_values',
    }),
    pricingMode: 'configured_bundle_price',
    discountPolicyKey: 'bundle_discount_standard',
    integratedReport: true,
  },
  {
    id: 'package_career_direction_trio',
    sku: 'PACKAGE_CAREER_DIRECTION_TRIO',
    title: 'Career Direction Trio',
    moduleIds: [
      'career_interest_inventory',
      'career_aptitude_sampler',
      'work_values_assessment',
    ],
    priceKey: 'package_career_direction_trio',
    pricingProfileKeys: Object.freeze({
      individual: 'package_career_direction_trio',
      institutionBulk: 'institution_package_career_direction_trio',
    }),
    pricingMode: 'configured_bundle_price',
    discountPolicyKey: 'bundle_discount_standard',
    integratedReport: true,
    founderApproved: true,
  },
  {
    id: 'package_full_career_intelligence',
    sku: 'PACKAGE_FULL_CAREER_INTELLIGENCE',
    title: 'Full Career Intelligence',
    moduleIds: purchasableModules.map((module) => module.id),
    priceKey: 'package_full_career_intelligence',
    pricingProfileKeys: Object.freeze({
      individual: 'package_full_career_intelligence',
      institutionBulk: 'institution_package_full_career_intelligence',
    }),
    pricingMode: 'configured_bundle_price',
    discountPolicyKey: 'bundle_discount_premium',
    integratedReport: true,
  },
]);

export function getAssessmentProduct(productIdOrSku) {
  return (
    ASSESSMENT_PRODUCTS.find(
      (product) =>
        product.id === productIdOrSku || product.sku === productIdOrSku,
    ) || null
  );
}

export function getAssessmentPackage(packageIdOrSku) {
  return (
    ASSESSMENT_PACKAGES.find(
      (pkg) => pkg.id === packageIdOrSku || pkg.sku === packageIdOrSku,
    ) || null
  );
}

export function resolvePackageModules(packageIdOrSku) {
  const pkg = getAssessmentPackage(packageIdOrSku);
  if (!pkg) return [];

  return pkg.moduleIds
    .map((moduleId) => getAssessmentModule(moduleId))
    .filter(Boolean);
}

export function getAdditionalModulesForPackage(
  packageIdOrSku,
  completedModuleIds = [],
) {
  const pkg = getAssessmentPackage(packageIdOrSku);
  if (!pkg) return [];

  const completed = new Set(completedModuleIds);
  return pkg.moduleIds.filter((moduleId) => !completed.has(moduleId));
}

export function getProductForModule(moduleId) {
  return (
    ASSESSMENT_PRODUCTS.find(
      (product) => product.assessmentModuleId === moduleId,
    ) || null
  );
}

export function validatePackageComposition(packageDefinition) {
  const moduleIds = Array.isArray(packageDefinition?.moduleIds)
    ? [...new Set(packageDefinition.moduleIds)]
    : [];

  if (moduleIds.length < 2) {
    return {
      valid: false,
      reason: 'A commercial package must contain at least two assessment modules.',
    };
  }

  const unavailable = moduleIds.filter(
    (moduleId) => !getAssessmentProduct(`product_${moduleId}`),
  );

  if (unavailable.length) {
    return {
      valid: false,
      reason: 'Package contains unavailable assessment modules.',
      unavailableModuleIds: unavailable,
    };
  }

  return {
    valid: true,
    moduleIds,
    modules: moduleIds.map((moduleId) => getAssessmentModule(moduleId)),
  };
}

export function getAssessmentCommerceSummary() {
  return {
    version: ASSESSMENT_COMMERCE_CATALOGUE_VERSION,
    standaloneProducts: ASSESSMENT_PRODUCTS.length,
    packages: ASSESSMENT_PACKAGES.length,
    careerDirectionTrio:
      getAssessmentPackage('package_career_direction_trio'),
    independentlyPurchasable: ASSESSMENT_PRODUCTS.every(
      (product) => product.independentlyPurchasable,
    ),
    bundleEligible: ASSESSMENT_PRODUCTS.every(
      (product) => product.bundleEligible,
    ),
  };
}
