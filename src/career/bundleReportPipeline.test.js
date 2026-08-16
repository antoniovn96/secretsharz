import { TEST_BUNDLES } from './testBundleCatalogue';
import { assertIntegratedReport, buildBundleReport, expandExistingBundleReport } from './bundleReportPipeline';

describe('VidyaVantage bundle report pipeline', () => {
  test('every bundle generates one integrated report', () => {
    TEST_BUNDLES.forEach(bundle => {
      const report = buildBundleReport({
        bundleId: bundle.id,
        completedFamilyIds: bundle.familyIds,
        assessmentResult: { scores: {} },
        reportTier: bundle.familyCount === 5 ? 'premium' : 'free',
      });

      expect(assertIntegratedReport(report)).toBe(true);
      expect(report.bundleFamilyIds).toEqual(bundle.familyIds);
      expect(report.persistence.reportType).toBe('integrated_bundle');
      expect(report.integrationRules.neverCreateSeparateReports).toBe(true);
    });
  });

  test('expanding a bundle preserves the same integrated report model', () => {
    const two = TEST_BUNDLES.find(bundle => bundle.familyCount === 2);
    const three = TEST_BUNDLES.find(bundle => bundle.familyCount === 3);

    const initial = buildBundleReport({
      bundleId: two.id,
      completedFamilyIds: two.familyIds,
      assessmentResult: { scores: { existing: true } },
      reportTier: 'premium',
    });

    const expanded = expandExistingBundleReport({
      existingReport: initial,
      newBundleId: three.id,
      completedFamilyIds: three.familyIds,
    });

    expect(assertIntegratedReport(expanded)).toBe(true);
    expect(expanded.bundleFamilyIds).toEqual(three.familyIds);
    expect(expanded.report.scores.existing).toBe(true);
    expect(expanded.persistence.preserveModuleResults).toBe(true);
  });
});
