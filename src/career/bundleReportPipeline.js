import { getTestBundle } from './testBundleCatalogue';
import { composeUnifiedReport } from './unifiedReportComposer';

/**
 * Canonical report pipeline for VidyaVantage bundles.
 *
 * Important product rule:
 * - assessment families remain independently scored/stored
 * - a bundle is rendered as ONE integrated report
 * - adding a new family expands the same report rather than creating a second report
 */

export function buildBundleReport({
  bundleId,
  assessmentResult,
  completedFamilyIds,
  reportTier = 'free',
  userContext = {},
  careerIntelligence = {},
}) {
  const bundle = getTestBundle(bundleId);
  if (!bundle) throw new Error(`Unknown VidyaVantage bundle: ${bundleId}`);

  const families = completedFamilyIds?.length ? completedFamilyIds : bundle.familyIds;
  const includedFamilyIds = families.filter(id => bundle.familyIds.includes(id));

  const baseReport = {
    ...assessmentResult,
    reportTier,
    bundleId: bundle.id,
    bundleTitle: bundle.title,
    bundleFamilyIds: includedFamilyIds,
    userContext,
    careerIntelligence,
    generatedAs: 'integrated_bundle_report',
  };

  const composed = composeUnifiedReport({
    bundleId: bundle.id,
    report: baseReport,
    completedFamilyIds: includedFamilyIds,
  });

  return {
    ...composed,
    access: {
      tier: reportTier,
      isPremium: reportTier !== 'free',
      pageTarget: bundle.reportPages,
    },
    persistence: {
      bundleId: bundle.id,
      familyIds: includedFamilyIds,
      reportVersion: composed.version,
      reportType: 'integrated_bundle',
      preserveModuleResults: true,
      preserveHistoricalVersions: true,
    },
  };
}

export function expandExistingBundleReport({
  existingReport,
  newBundleId,
  completedFamilyIds,
}) {
  if (!existingReport) {
    return buildBundleReport({
      bundleId: newBundleId,
      completedFamilyIds,
      assessmentResult: {},
    });
  }

  return buildBundleReport({
    bundleId: newBundleId,
    completedFamilyIds,
    assessmentResult: existingReport,
    reportTier: existingReport.reportTier || 'free',
    userContext: existingReport.userContext || {},
    careerIntelligence: existingReport.careerIntelligence || {},
  });
}

export function assertIntegratedReport(report) {
  if (!report?.unified || !report?.singleDocument || !report?.singleIntegratedReport) {
    throw new Error('VidyaVantage bundle report invariant failed: bundle reports must be one integrated document.');
  }
  if (report.integrationRules?.neverCreateSeparateReports !== true) {
    throw new Error('VidyaVantage bundle report invariant failed: separate bundle reports are prohibited.');
  }
  return true;
}
