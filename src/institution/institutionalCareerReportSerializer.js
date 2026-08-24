const cloneArray = value => Array.isArray(value) ? value : [];
const cloneObject = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const cleanCareer = career => ({
  id: career?.id || null,
  name: career?.name || career?.title || null,
  category: career?.category || null,
  interestAlignmentIndex: Number.isFinite(Number(career?.interestAlignmentIndex)) ? Number(career.interestAlignmentIndex) : null,
  scoreLabel: career?.scoreLabel || 'Interest Alignment Index',
  explanation: career?.explanation || { whyExplore: null, whatToCheck: [] },
  evidenceUsed: career?.evidenceUsed || {},
  decisionProfile: career?.decisionProfile || null,
  limitations: cloneArray(career?.limitations),
});
const serializeScores = scores => ({
  riasec: cloneObject(scores?.riasec), riasecCode: scores?.riasecCode || null,
  reasoning: cloneObject(scores?.reasoning), readinessPercent: scores?.readinessPercent ?? null,
  adaptabilityPercent: scores?.adaptabilityPercent ?? null, adaptability: cloneObject(scores?.adaptability),
  readiness: cloneObject(scores?.readiness), values: cloneObject(scores?.values), big5: cloneObject(scores?.big5),
  environment: cloneObject(scores?.environment), skills: cloneObject(scores?.skills), learning: cloneObject(scores?.learning),
});
export function serializeInstitutionalCareerReport(report = {}) {
  const intake = report.intake || {};
  return {
    version: report.version || null, pathway: report.pathway || null, bundleId: report.bundleId || null,
    bundleSku: report.bundleSku || null, bundleTitle: report.bundleTitle || null,
    selectedFamilyIds: cloneArray(report.selectedFamilyIds), selectedTestCount: report.selectedTestCount ?? null,
    deliveryMode: report.deliveryMode || null, estimatedMinutes: report.estimatedMinutes ?? null,
    questionCount: report.questionCount ?? null, reportPages: report.reportPages ?? null,
    reportType: report.reportType || null, reportTier: report.reportTier || null,
    embeddedGuidanceLayer: report.embeddedGuidanceLayer || { included: false, assessed: false, domains: [] },
    careerMatching: report.careerMatching || null, completedAt: report.completedAt || null,
    intake: {
      educationStage: intake.educationStage || null, board: intake.board || null, className: intake.className || null,
      stream: intake.stream || null, institutionName: intake.institutionName || null,
      likedSubjects: cloneArray(intake.likedSubjects), dislikedSubjects: cloneArray(intake.dislikedSubjects),
      hobbies: intake.hobbies || null, curiosity: intake.curiosity || null, goal: intake.goal || null,
      currentRole: intake.currentRole || null, professionalIntent: intake.professionalIntent || null,
      academicAverage: intake.academicAverage ?? null,
    },
    scores: serializeScores(report.scores), careerExploration: cloneArray(report.careerExploration).map(cleanCareer),
    decisionSupportCoverage: cloneObject(report.decisionSupportCoverage), reflection: report.reflection || null,
  };
}
