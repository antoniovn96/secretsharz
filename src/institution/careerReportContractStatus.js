import { STUDENT_PREMIUM_REPORT } from '../career/reportArchitecture.js';
import { buildInstitutionCareerReflection } from './careerReportDataContract.js';

export function getInstitutionCareerReportStatus(report = {}) {
  const sections = buildInstitutionCareerReflection(report);
  const assessed = sections.filter(section => section.available).length;
  return {
    totalSections: STUDENT_PREMIUM_REPORT.length,
    availableSections: assessed,
    unavailableSections: sections.length - assessed,
    coveragePercent: sections.length ? Math.round((assessed / sections.length) * 100) : 0,
    sections
  };
}
