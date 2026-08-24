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
    expect(result.guidanceLayer.included).toBe(false);
  });

  test('full five-family bundle remains one report', () => {
    const bundle = TEST_BUNDLES.find(b => b.familyCount === 5);
    const result = composeUnifiedReport({ bundleId: bundle.id });

    expect(result.familyCount).toBe(5);
    expect(result.reportPages).toBe(20);
    expect(result.sections.filter(s => s.kind === 'integration')).toHaveLength(6);
    expect(result.sections.filter(s => s.kind === 'assessment_evidence')).toHaveLength(5);
    expect(result.guidanceLayer.included).toBe(true);
    expect(result.guidanceLayer.assessed).toBe(false);
  });

  test('full bundle adds guidance evidence only when persisted scores exist', () => {
    const bundle = TEST_BUNDLES.find(b => b.familyCount === 5);
    const result = composeUnifiedReport({
      bundleId: bundle.id,
      report: { scores: { readinessPercent: 72, environment: { autonomy: 4 }, adaptabilityPercent: 81 } }
    });

    expect(result.guidanceLayer.assessed).toBe(true);
    expect(result.sections.filter(s => s.kind === 'embedded_guidance_evidence')).toHaveLength(1);
    expect(result.evidenceDomains).toEqual(expect.arrayContaining(['readiness','environment','adaptability']));
  });
});
