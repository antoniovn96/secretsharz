import { buildInstitutionCareerReflection } from './careerReportDataContract.js';

export function normaliseInstitutionCareerReport(payload = {}) {
  const report = payload.report || null;
  if (!report || typeof report !== 'object') {
    return { report: null, student: payload.student || null, dataScope: payload.dataScope || null, coverage: null };
  }
  const sections = buildInstitutionCareerReflection(report);
  const availableSections = sections.filter(section => section.available).length;
  return {
    report,
    student: payload.student || null,
    dataScope: payload.dataScope || null,
    coverage: {
      totalSections: sections.length,
      availableSections,
      unavailableSections: sections.length - availableSections,
      coveragePercent: Math.round((availableSections / sections.length) * 100),
      sections
    }
  };
}
