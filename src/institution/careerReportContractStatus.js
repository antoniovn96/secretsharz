import { STUDENT_PREMIUM_REPORT } from '../career/reportArchitecture.js';
import { buildInstitutionCareerReflection } from './careerReportDataContract.js';

export function getInstitutionCareerReportStatus(report = {}) {
  const sections = buildInstitutionCareerReflection(report);
  const availableSections = sections.filter(section => section.available).length;
  const assessedSections = sections.filter(section => section.source === 'assessed').length;
  const derivedSections = sections.filter(section => section.source === 'derived_from_assessment').length;
  const catalogueSections = sections.filter(section => section.source === 'career_catalogue').length;
  const unavailableSections = sections.filter(section => section.source === 'unavailable').length;
  return {
    totalSections: STUDENT_PREMIUM_REPORT.length,
    availableSections,
    assessedSections,
    derivedSections,
    catalogueSections,
    unavailableSections,
    coveragePercent: sections.length ? Math.round((availableSections / sections.length) * 100) : 0,
    sections
  };
}
