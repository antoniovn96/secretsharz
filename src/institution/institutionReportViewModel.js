import { normaliseInstitutionCareerReport } from './normaliseInstitutionCareerReport.js';

export function buildInstitutionReportViewModel(payload = {}) {
  const normalised = normaliseInstitutionCareerReport(payload);
  const evidence = payload?.assessmentEvidence || null;
  return {
    ...normalised,
    assessmentEvidence: evidence,
    showSection(sectionId) {
      return Boolean(normalised.coverage?.sections?.find(section => section.id === sectionId)?.available);
    }
  };
}
