import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import { isStudentProfile, getStudentPath } from '../../../src/platform/studentRecordModel.js';

function toMillis(value) {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function monthKey(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthSeries(now, records, months = 6) {
  const result = [];
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  for (let index = 0; index < months; index += 1) {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    result.push({ key: monthKey(date.getTime()), month: date.toLocaleString('en-IN', { month: 'short' }), ...Object.fromEntries(records.map(record => [record.name, 0])) });
  }
  const byKey = new Map(result.map(item => [item.key, item]));
  records.forEach(({ name, timestamps }) => timestamps.forEach(timestamp => {
    const item = byKey.get(monthKey(timestamp));
    if (item) item[name] += 1;
  }));
  return result.map(({ key, ...item }) => item);
}

function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getWindowCounts(timestamps, now, windowMs) {
  const currentStart = now.getTime() - windowMs;
  const previousStart = currentStart - windowMs;
  return {
    current: timestamps.filter(ts => ts >= currentStart && ts < now.getTime()).length,
    previous: timestamps.filter(ts => ts >= previousStart && ts < currentStart).length,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  try {
    const db = getAdminFirestore();
    const now = new Date();
    const [usersSnapshot, sessionsSnapshot, iepSnapshot, moodSnapshot, roadmapSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collectionGroup('sessions').get(),
      db.collectionGroup('iep_records').get(),
      db.collectionGroup('mood_logs').get(),
      db.collectionGroup('career_roadmaps').get(),
    ]);

    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sessions = sessionsSnapshot.docs.map(doc => doc.data());
    const ieps = iepSnapshot.docs.map(doc => doc.data());
    const moodLogs = moodSnapshot.docs.map(doc => doc.data());
    const roadmaps = roadmapSnapshot.docs.map(doc => doc.data());

    const studentUsers = users.filter(isStudentProfile);
    const professionals = users.filter(user => ['counsellor', 'psychologist', 'educator'].includes(String(user.role || '').toLowerCase()));
    const parents = users.filter(user => String(user.role || '').toLowerCase() === 'parent');
    const registrationTimestamps = users.map(user => toMillis(user.createdAt)).filter(Boolean);
    const sessionTimestamps = sessions.map(session => toMillis(session.timestamp)).filter(Boolean);
    const iepRecords = ieps.map(record => ({ ...record, timestampMs: toMillis(record.timestamp) })).filter(record => record.timestampMs);
    const moodTimestamps = moodLogs.map(log => toMillis(log.timestamp)).filter(Boolean);
    const roadmapTimestamps = roadmaps.map(roadmap => toMillis(roadmap.timestamp)).filter(Boolean);

    const completedAssessmentUsers = studentUsers.filter(user => {
      const code = user?.careerAssessment?.hollandCode?.length
        ? user.careerAssessment.hollandCode.join('')
        : user?.careerDNA?.riasec?.code || user?.riasecCode;
      return typeof code === 'string' && code.trim().length > 0;
    });
    const pendingIEPs = iepRecords.filter(record => {
      const status = String(record.status || 'Active').toLowerCase();
      return !['completed', 'closed', 'archived'].includes(status);
    });
    const recentSessionWindow = getWindowCounts(sessionTimestamps, now, 7 * 24 * 60 * 60 * 1000);
    const registrationWindow = getWindowCounts(registrationTimestamps, now, 30 * 24 * 60 * 60 * 1000);
    const iepWindow = getWindowCounts(iepRecords.map(record => record.timestampMs), now, 30 * 24 * 60 * 60 * 1000);
    const studentPathCounts = studentUsers.reduce((acc, user) => {
      const normalized = getStudentPath(user).toLowerCase();
      acc[normalized] = (acc[normalized] || 0) + 1;
      return acc;
    }, { wellbeing: 0, sen: 0, career: 0, unassigned: 0 });
    const studentProfileComplete = studentUsers.filter(user => user.profileComplete === true || user.onboardingCompleted === true).length;
    const engagementData = buildMonthSeries(now, [
      { name: 'registrations', timestamps: registrationTimestamps },
      { name: 'sessions', timestamps: sessionTimestamps },
      { name: 'moodCheckins', timestamps: moodTimestamps },
      { name: 'roadmaps', timestamps: roadmapTimestamps },
    ]);

    return res.status(200).json({
      generatedAt: now.toISOString(),
      stats: {
        totalUsers: { value: users.length, change: percentChange(registrationWindow.current, registrationWindow.previous), trend: registrationWindow.current >= registrationWindow.previous ? 'up' : 'down', changeLabel: 'new users · 30d' },
        recentSessions: { value: recentSessionWindow.current, change: percentChange(recentSessionWindow.current, recentSessionWindow.previous), trend: recentSessionWindow.current >= recentSessionWindow.previous ? 'up' : 'down', changeLabel: 'sessions · 7d' },
        pendingIEPs: { value: pendingIEPs.length, change: percentChange(iepWindow.current, iepWindow.previous), trend: iepWindow.current <= iepWindow.previous ? 'down' : 'up', changeLabel: 'new IEPs · 30d' },
        completedAssessments: { value: completedAssessmentUsers.length, change: null, trend: 'up', changeLabel: 'live total' },
      },
      counts: {
        students: studentUsers.length,
        professionals: professionals.length,
        parents: parents.length,
        sessions: sessions.length,
        moodCheckins: moodLogs.length,
        careerRoadmaps: roadmaps.length,
        completedAssessments: completedAssessmentUsers.length,
        profileCompleteStudents: studentProfileComplete,
      },
      pathDistribution: [
        { name: 'Wellbeing', value: studentPathCounts.wellbeing },
        { name: 'SEN', value: studentPathCounts.sen },
        { name: 'Career', value: studentPathCounts.career },
        { name: 'Unassigned', value: studentPathCounts.unassigned },
      ],
      engagementData,
      limitations: {
        assessmentHistory: 'The current assessment schema stores the completed RIASEC result on the user profile but does not expose a dedicated completion timestamp/history collection. The dashboard therefore reports the live completed-assessment total and does not fabricate monthly assessment history.',
        sessionRating: 'No session-rating field was found in the current session schema, so no average rating is displayed.',
        responseTime: 'No counsellor response-time timestamps are stored in the current schema, so no response-time metric is displayed.',
      },
    });
  } catch (error) {
    console.error('[admin overview stats] failed:', error);
    return res.status(500).json({ error: 'Unable to load admin overview statistics.' });
  }
}
