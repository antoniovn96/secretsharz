/**
 * Canonical client-side shape for the VidyaVantage Career journey.
 * This is a contract, not a second database. Firestore remains the source
 * of truth; dashboards should map their API/Firestore payloads into this shape.
 */
import { resolveLatestCareerAssessment } from '../../platform/careerAssessmentResolver';

export const EMPTY_CAREER_JOURNEY = {
  studentId: null,
  institutionId: null,
  parentIds: [],
  assignedCareerCounsellorId: null,
  profile: {},
  assessment: {
    status: 'not_started',
    id: null,
    instrument: 'RIASEC',
    version: null,
    completedAt: null,
    hollandCode: [],
    riasecScores: {},
    maturityPct: 0,
    streams: [],
    top5Careers: [],
    profile: {},
    source: null,
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

function normaliseStream(stream) {
  if (typeof stream === 'string') return { id: stream, label: stream };
  if (stream && typeof stream === 'object') {
    return { ...stream, id: stream.id || stream.value || stream.name || null };
  }
  return null;
}

function normaliseStreams(streams) {
  if (!Array.isArray(streams)) return [];
  return streams.map(normaliseStream).filter(stream => stream?.id);
}

export function normaliseCareerJourney(raw = {}) {
  const assessment = resolveLatestCareerAssessment(raw);
  const roadmap = raw.careerRoadmap || raw.roadmap || {};
  const journal = raw.careerJournal || raw.journal || {};
  const access = raw.careerAccess || raw.access || {};
  const profile = raw.careerProfile || raw.profile || {};

  const code = assessment.riasecCode || assessment.hollandCode || '';
  const hollandCode = Array.isArray(code)
    ? code
    : String(code).split('').filter(Boolean);

  return {
    ...EMPTY_CAREER_JOURNEY,
    ...raw,
    studentId: raw.studentId || raw.uid || null,
    institutionId: raw.institutionId || null,
    parentIds: raw.parentIds || (raw.parentId ? [raw.parentId] : []),
    assignedCareerCounsellorId: raw.assignedCareerCounsellorId || raw.assignedCareerCoachId || null,
    profile,
    assessment: {
      ...EMPTY_CAREER_JOURNEY.assessment,
      ...assessment,
      status: assessment.status || 'not_started',
      hollandCode,
      riasecScores: assessment.riasecScores || {},
      streams: normaliseStreams(assessment.streams),
      top5Careers: Array.isArray(assessment.top5Careers) ? assessment.top5Careers : [],
      maturityPct: typeof assessment.maturityPct === 'number' ? assessment.maturityPct : 0,
      profile: assessment.profile || {},
      source: assessment.source || null,
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
