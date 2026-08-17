/**
 * Canonical client-side shape for the VidyaVantage Career journey.
 * This is a contract, not a second database. Firestore remains the source
 * of truth; dashboards should map their API/Firestore payloads into this shape.
 */
export const EMPTY_CAREER_JOURNEY = {
  studentId: null,
  institutionId: null,
  parentIds: [],
  assignedCareerCounsellorId: null,
  profile: {},
  assessment: {
    status: 'not_started',
    id: null,
    completedAt: null,
    hollandCode: [],
    riasecScores: {},
    maturityPct: 0,
    streams: [],
    top5Careers: [],
    profile: {},
  },
  roadmap: {
    status: 'not_started',
    id: null,
    stages: [],
    milestones: [],
    updatedAt: null,
  },
  journal: {
    count: 0,
    latestAt: null,
  },
  sessions: {
    upcoming: [],
    past: [],
  },
  access: {
    careerReport: { unlocked: false, orderId: null, unlockedAt: null },
    gamesPro: { unlocked: false, orderId: null, unlockedAt: null },
  },
  privacy: {
    parentCareerSummaryVisible: true,
    parentJournalVisible: false,
  },
};

export function normaliseCareerJourney(raw = {}) {
  const assessment = raw.careerAssessment || raw.assessment || {};
  const roadmap = raw.careerRoadmap || raw.roadmap || {};
  const journal = raw.careerJournal || raw.journal || {};
  const access = raw.careerAccess || raw.access || {};
  const code = assessment.hollandCode || raw.riasecCode || [];

  return {
    ...EMPTY_CAREER_JOURNEY,
    ...raw,
    studentId: raw.studentId || raw.uid || null,
    institutionId: raw.institutionId || null,
    parentIds: raw.parentIds || (raw.parentId ? [raw.parentId] : []),
    assignedCareerCounsellorId: raw.assignedCareerCounsellorId || raw.assignedCareerCoachId || null,
    profile: raw.careerProfile || raw.profile || {},
    assessment: {
      ...EMPTY_CAREER_JOURNEY.assessment,
      ...assessment,
      status: assessment.status || (assessment.completedAt ? 'completed' : 'not_started'),
      hollandCode: Array.isArray(code) ? code : String(code || '').split('').filter(Boolean),
      riasecScores: assessment.riasecScores || raw.riasecScores || {},
      streams: assessment.streams || (raw.recommendedStream ? [{ id: raw.recommendedStream }] : []),
      top5Careers: assessment.top5Careers || raw.topCareerMatches || [],
    },
    roadmap: {
      ...EMPTY_CAREER_JOURNEY.roadmap,
      ...roadmap,
      milestones: roadmap.milestones || [],
    },
    journal: {
      count: Array.isArray(journal.entries) ? journal.entries.length : Number(journal.count || 0),
      latestAt: journal.updatedAt || (Array.isArray(journal.entries) && journal.entries[0]?.createdAt) || null,
    },
    access: {
      ...EMPTY_CAREER_JOURNEY.access,
      ...access,
      careerReport: { ...EMPTY_CAREER_JOURNEY.access.careerReport, ...(access.careerReport || {}) },
      gamesPro: { ...EMPTY_CAREER_JOURNEY.access.gamesPro, ...(access.gamesPro || {}) },
    },
    privacy: { ...EMPTY_CAREER_JOURNEY.privacy, ...(raw.privacy || {}) },
  };
}

export default normaliseCareerJourney;
