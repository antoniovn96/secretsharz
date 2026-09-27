import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ASSESSMENT_PRODUCTS,
  ASSESSMENT_PACKAGES,
  getAssessmentProduct,
  getAssessmentPackage,
  getProductForModule,
  getAdditionalModulesForPackage,
  resolvePackageModules,
  validatePackageComposition,
} from '../../src/career/assessmentCommerceCatalogue.js';

test('every active assessment module is independently purchasable', () => {
  assert.ok(ASSESSMENT_PRODUCTS.length >= 2);
  assert.ok(
    ASSESSMENT_PRODUCTS.every(
      (product) =>
        product.independentlyPurchasable &&
        product.bundleEligible &&
        product.assessmentModuleId &&
        product.priceKey &&
        product.pricingProfileKeys?.individual &&
        product.pricingProfileKeys?.institution,
    ),
  );
});

test('each assessment module maps to one distinct commercial product', () => {
  const moduleIds = ASSESSMENT_PRODUCTS.map((product) => product.assessmentModuleId);
  const productIds = ASSESSMENT_PRODUCTS.map((product) => product.id);
  const skus = ASSESSMENT_PRODUCTS.map((product) => product.sku);

  assert.equal(new Set(moduleIds).size, moduleIds.length);
  assert.equal(new Set(productIds).size, productIds.length);
  assert.equal(new Set(skus).size, skus.length);

  for (const moduleId of moduleIds) {
    const product = getProductForModule(moduleId);
    assert.ok(product);
    assert.equal(product.assessmentModuleId, moduleId);
  }
});

test('standalone pricing references are separate from package pricing references', () => {
  for (const product of ASSESSMENT_PRODUCTS) {
    assert.ok(product.priceKey.startsWith('assessment_'));
    assert.equal(
      product.pricingProfileKeys.institution,
      `institution_${product.priceKey}`,
    );
  }

  for (const pkg of ASSESSMENT_PACKAGES) {
    assert.ok(pkg.priceKey.startsWith('package_'));
    assert.ok(pkg.pricingProfileKeys.individual.startsWith('package_'));
    assert.ok(pkg.pricingProfileKeys.institutionBulk.startsWith('institution_package_'));
    assert.ok(pkg.discountPolicyKey);
  }
});

test('packages contain at least two independently purchasable modules', () => {
  assert.ok(ASSESSMENT_PACKAGES.length >= 1);

  for (const pkg of ASSESSMENT_PACKAGES) {
    assert.ok(pkg.moduleIds.length >= 2);

    for (const moduleId of pkg.moduleIds) {
      assert.ok(getAssessmentProduct(`product_${moduleId}`));
    }

    const resolved = resolvePackageModules(pkg.id);
    assert.equal(resolved.length, pkg.moduleIds.length);
  }
});

test('Career Direction Trio is exactly RIASEC + Aptitude/Reasoning + Values', () => {
  const pkg = getAssessmentPackage('package_career_direction_trio');
  assert.ok(pkg);
  assert.deepEqual(pkg.moduleIds, [
    'career_interest_inventory',
    'career_aptitude_sampler',
    'work_values_assessment',
  ]);
  assert.equal(pkg.founderApproved, true);
});

test('Career Direction Trio does not include Decision Readiness', () => {
  const pkg = getAssessmentPackage('package_career_direction_trio');
  assert.ok(pkg);
  assert.ok(!pkg.moduleIds.includes('career_decision_readiness'));
});

test('upgrading to a package does not require completed modules to be retaken', () => {
  const pkg = getAssessmentPackage('package_career_direction_trio');
  assert.ok(pkg);

  const completed = [
    'career_interest_inventory',
    'work_values_assessment',
  ];

  const additional = getAdditionalModulesForPackage(pkg.id, completed);

  assert.ok(!additional.includes('career_interest_inventory'));
  assert.ok(!additional.includes('work_values_assessment'));
  assert.ok(additional.includes('career_aptitude_sampler'));
  assert.equal(additional.length, 1);
});

test('invalid single-module commercial package definitions are rejected', () => {
  const result = validatePackageComposition({
    moduleIds: ['career_interest_inventory'],
  });

  assert.equal(result.valid, false);
});

test('valid multi-module commercial package definitions are accepted', () => {
  const result = validatePackageComposition({
    moduleIds: [
      'career_interest_inventory',
      'career_aptitude_sampler',
    ],
  });

  assert.equal(result.valid, true);
  assert.equal(result.modules.length, 2);
});

test('standalone product lookup supports both id and sku', () => {
  const product = ASSESSMENT_PRODUCTS[0];
  assert.equal(getAssessmentProduct(product.id)?.id, product.id);
  assert.equal(getAssessmentProduct(product.sku)?.id, product.id);
});
