import {
  ASSESSMENT_MODULES,
  getAssessmentModule,
} from './assessmentLibrary.js';

/**
 * Secret Sharz Assessment Commerce Catalogue V1
 *
 * Commercial identity is deliberately separate from assessment identity:
 * - an assessment module is the thing being assessed;
 * - an assessment product is the independently purchasable SKU for that module;
 * - a package is a composition of two or more products/modules.
 *
 * Prices are not hard-coded here. priceKey values are stable commerce references
 * that can later resolve to live pricing, discounts, currency and institution terms.
 *
 * A package never creates a new psychometric identity. It grants access to its
 * constituent assessment modules and may optionally produce an integrated report.
 */

export const ASSESSMENT_COMMERCE_CATALOGUE_VERSION = '1.0.0';

const purchasableModules = ASSESSMENT_MODULES.filter(
  (module) => module.status !== 'catalogue',
);

export const ASSESSMENT_PRODUCTS = Object.freeze(
  purchasableModules.map((module) => ({
    id: `product_${module.id}`,
    sku: module.sku,
    title: module.title,
    shortTitle: module.shortTitle,
    assessmentModuleId: module.id,
    priceKey: module.individualPriceKey,
    pricingMode: 'standalone_configured_price',
    independentlyPurchasable: true,
    bundleEligible: true,
    reusableResult: true,
    retakePolicyKey: `retake_${module.id}`,
  })),
);

export const ASSESSMENT_PACKAGES = Object.freeze([
  {
    id: 'package_interest_and_values',
    sku: 'PACKAGE_INTEREST_VALUES',
    title: 'Career Interests + Work Values',
    moduleIds: ['career_interest_inventory', 'work_values_assessment'],
    priceKey: 'package_interest_values',
    pricingMode: 'configured_bundle_price',
    discountPolicyKey: 'bundle_discount_standard',
    integratedReport: true,
  },
  {
    id: 'package_career_direction',
    sku: 'PACKAGE_CAREER_DIRECTION',
    title: 'Career Direction',
    moduleIds: [
      'career_interest_inventory',
      'career_aptitude_sampler',
      'work_values_assessment',
      'career_decision_readiness',
    ],
    priceKey: 'package_career_direction',
    pricingMode: 'configured_bundle_price',
    discountPolicyKey: 'bundle_discount_standard',
    integratedReport: true,
  },
  {
    id: 'package_full_career_intelligence',
    sku: 'PACKAGE_FULL_CAREER_INTELLIGENCE',
    title: 'Full Career Intelligence',
    moduleIds: purchasableModules.map((module) => module.id),
    priceKey: 'package_full_career_intelligence',
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

export function getAdditionalModulesForPackage(packageIdOrSku, completedModuleIds = []) {
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
    independentlyPurchasable: ASSESSMENT_PRODUCTS.every(
      (product) => product.independentlyPurchasable,
    ),
    bundleEligible: ASSESSMENT_PRODUCTS.every(
      (product) => product.bundleEligible,
    ),
  };
}
