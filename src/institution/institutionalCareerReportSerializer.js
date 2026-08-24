const cloneArray = value => Array.isArray(value) ? value : [];
const cloneObject = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const cleanCareer = career => ({
  id: career?.id || null,
  name: career?.name || career?.title || null,
  title: career?.title || null,
  category: career?.category || null,
  stream: career?.stream || null,
  desc: career?.desc || null,
  rationale: career?.rationale || null,
  explorationIndex: Number.isFinite(Number(career?.explorationIndex)) ? Number(career.explorationIndex) : null,
  matchScore: Number.isFinite(Number(career?.matchScore)) ? Number(career.matchScore) : null,
  interestAlignmentIndex: Number.isFinite(Number(career?.interestAlignmentIndex)) ? Number(career.interestAlignmentIndex) : null,
  scoreLabel: career?.scoreLabel || 'Interest Alignment Index',
  explanation: career?.explanation || { whyExplore: null, whatToCheck: [] },
  evidenceUsed: career?.evidenceUsed || {},
  decisionProfile: career?.decisionProfile || null,
  limitations: cloneArray(career?.limitations),
});
const serializeScores = scores => ({
  riasec: cloneObject(scores?.riasec), riasecCode: scores?.riasecCode || null, reasoning: cloneObject(scores?.reasoning),
  readinessPercent: scores?.readinessPercent ?? null, adaptabilityPercent: scores?.adaptabilityPercent ?? null,
  adaptability: cloneObject(scores?.adaptability), readiness: cloneObject(scores?.readiness), values: cloneObject(scores?.values),
  big5: cloneObject(scores?.big5), environment: cloneObject(scores?.environment), workEnvironment: cloneObject(scores?.workEnvironment),
  skills: cloneObject(scores?.skills), learning: cloneObject(scores?.learning),
});

const serializeCareerMatching = matching => {
  if (!matching || typeof matching !== 'object' || Array.isArray(matching)) return null;
  return {
    method: matching.method || 'RIASEC catalogue alignment',
    scoreLabel: matching.scoreLabel || 'Interest Alignment Index',
    version: matching.version || null,
    rankedBy: cloneArray(matching.rankedBy),
    excludedFromRanking: cloneArray(matching.excludedFromRanking),
    limitations: cloneArray(matching.limitations),
    evidenceDomains: cloneArray(matching.evidenceDomains),
  };
};

export function serializeInstitutionalCareerReport(report = {}) {
  const intake = report.intake || {};
  return {
    version: report.version || null, pathway: report.pathway || null, bundleId: report.bundleId || null, bundleSku: report.bundleSku || null,
    bundleTitle: report.bundleTitle || null, selectedFamilyIds: cloneArray(report.selectedFamilyIds), selectedTestCount: report.selectedTestCount ?? null,
    deliveryMode: report.deliveryMode || null, estimatedMinutes: report.estimatedMinutes ?? null, questionCount: report.questionCount ?? null,
    reportPages: report.reportPages ?? null, reportType: report.reportType || null, reportTier: report.reportTier || null,
    embeddedGuidanceLayer: report.embeddedGuidanceLayer || { included: false, assessed: false, domains: [] }, careerMatching: serializeCareerMatching(report.careerMatching),
    completedAt: report.completedAt || null,
    executiveSnapshot: report.executiveSnapshot ?? null, executiveSummary: report.executiveSummary ?? null, snapshot: report.snapshot ?? null,
    topCareerDirections: cloneArray(report.topCareerDirections).map(cleanCareer), alternativeCareers: cloneArray(report.alternativeCareers).map(cleanCareer),
    pathwayAnalysis: cloneObject(report.pathwayAnalysis), pathways: cloneArray(report.pathways), streamAnalysis: cloneObject(report.streamAnalysis),
    streamScenarios: cloneArray(report.streamScenarios), educationRoadmap: cloneObject(report.educationRoadmap), education: cloneObject(report.education),
    skillsEvidence: cloneObject(report.skillsEvidence), skillsPlan: cloneObject(report.skillsPlan), affordability: cloneObject(report.affordability),
    friction: cloneObject(report.friction), actionRoadmap: cloneObject(report.actionRoadmap), actionPlan: cloneObject(report.actionPlan),
    counsellorReview: cloneObject(report.counsellorReview), reviewLimitations: cloneObject(report.reviewLimitations), workEnvironment: cloneObject(report.workEnvironment),
    intake: {
      age: intake.age ?? null, ageBand: intake.ageBand || null, educationStage: intake.educationStage || null, board: intake.board || null,
      className: intake.className || null, stream: intake.stream || null, institutionName: intake.institutionName || null,
      likedSubjects: cloneArray(intake.likedSubjects), dislikedSubjects: cloneArray(intake.dislikedSubjects),
      subjectsLiked: cloneArray(intake.subjectsLiked), subjectsDisliked: cloneArray(intake.subjectsDisliked),
      hobbies: intake.hobbies || null, curiosity: intake.curiosity || null, goal: intake.goal || null, currentRole: intake.currentRole || null,
      professionalIntent: intake.professionalIntent || null, academicAverage: intake.academicAverage ?? null,
    },
    scores: serializeScores(report.scores), careerExploration: cloneArray(report.careerExploration).map(cleanCareer),
    decisionSupportCoverage: cloneObject(report.decisionSupportCoverage), reflection: report.reflection || null,
  };
}
