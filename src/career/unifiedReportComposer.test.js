import { TEST_BUNDLES } from './testBundleCatalogue';
import { composeUnifiedReport } from './unifiedReportComposer';

describe('VidyaVantage unified bundle reports', () => {
  test('catalogue contains all 31 non-empty combinations', () => {
    expect(TEST_BUNDLES).toHaveLength(31);
  });

  test('two-family bundle produces one integrated report', () => {
    const bundle = TEST_BUNDLES.find(b => b.familyCount === 2);
    const result = composeUnifiedReport({ bundleId: bundle.id });

    expect(result.unified).toBe(true);
    expect(result.singleDocument).toBe(true);
    expect(result.singleNarrative).toBe(true);
    expect(result.singleIntegratedReport).toBe(true);
    expect(result.integrationRules.neverCreateSeparateReports).toBe(true);
    expect(result.familyCount).toBe(2);
  });

  test('full five-family bundle remains one report', () => {
    const bundle = TEST_BUNDLES.find(b => b.familyCount === 5);
    const result = composeUnifiedReport({ bundleId: bundle.id });

    expect(result.familyCount).toBe(5);
    expect(result.reportPages).toBe(20);
    expect(result.sections.filter(s => s.kind === 'integration')).toHaveLength(6);
    expect(result.sections.filter(s => s.kind === 'assessment_evidence')).toHaveLength(5);
  });
});
