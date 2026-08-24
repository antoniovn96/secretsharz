import { STUDENT_PREMIUM_REPORT } from '../career/reportArchitecture.js';
import { buildInstitutionCareerReflection } from './careerReportDataContract.js';

export function getInstitutionCareerReportStatus(report = {}) {
  const sections = buildInstitutionCareerReflection(report);
  const canonicalIds = STUDENT_PREMIUM_REPORT.map(section => section.id);
  const canonicalSet = new Set(canonicalIds);
  const canonicalSections = sections.filter(section => canonicalSet.has(section.id));
  const availableSections = canonicalSections.filter(section => section.available).length;
  const assessedSections = canonicalSections.filter(section => section.source === 'assessed').length;
  const derivedSections = canonicalSections.filter(section => section.source === 'derived_from_assessment').length;
  const catalogueSections = canonicalSections.filter(section => section.source === 'career_catalogue').length;
  const unavailableSections = canonicalSections.filter(section => section.source === 'unavailable').length;
  return {
    totalSections: canonicalIds.length,
    availableSections,
    assessedSections,
    derivedSections,
    catalogueSections,
    unavailableSections,
    coveragePercent: canonicalSections.length ? Math.round((availableSections / canonicalSections.length) * 100) : 0,
    sections: canonicalIds.map(id => canonicalSections.find(section => section.id === id) || {
      id,
      available: false,
      source: 'unavailable',
      title: STUDENT_PREMIUM_REPORT.find(section => section.id === id)?.title || id,
      reason: 'Not available in this assessment.'
    })
  };
}
