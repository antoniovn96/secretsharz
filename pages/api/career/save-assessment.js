import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeCareer(career) {
  if (!career || typeof career !== 'object') return null;
  return {
    name: String(career.name || career.title || '').slice(0, 200),
    matchScore: Number(career.matchScore || 0),
    tags: Array.isArray(career.tags) ? career.tags.map(v => String(v).slice(0, 60)).slice(0, 10) : [],
    stream: String(career.stream || '').slice(0, 100),
    riasec: Array.isArray(career.riasec) ? career.riasec.map(v => String(v).slice(0, 5)).slice(0, 6) : [],
    desc: String(career.desc || '').slice(0, 1000)
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (_) {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  const input = req.body || {};
  const hollandCode = Array.isArray(input.hollandCode) ? input.hollandCode.map(v => String(v)).slice(0, 3) : [];
  const riasecScores = input.riasecScores && typeof input.riasecScores === 'object' ? input.riasecScores : {};
  const streams = Array.isArray(input.streams) ? input.streams.slice(0, 3) : [];
  const top5Careers = Array.isArray(input.top5Careers) ? input.top5Careers.slice(0, 5).map(safeCareer).filter(Boolean) : [];
  const maturityPct = Math.max(0, Math.min(100, Number(input.maturityPct || 0)));
  const profile = input.profile && typeof input.profile === 'object' ? input.profile : {};

  if (hollandCode.length !== 3) return jsonError(res, 400, 'Invalid assessment result.');

  try {
    await getAdminFirestore().collection('users').doc(decodedToken.uid).set({
      careerAssessment: {
        hollandCode,
        riasecScores,
        streams,
        top5Careers,
        maturityPct,
        profile,
        completedAt: new Date().toISOString()
      },
      assessmentCompletedAt: new Date().toISOString(),
      riasecCode: hollandCode.join(''),
      riasecScores,
      recommendedStream: String(streams[0]?.id || ''),
      topCareerMatches: top5Careers.map(c => ({ name: c.name, matchScore: c.matchScore, stream: c.stream, tags: c.tags }))
    }, { merge: true });

    return res.status(200).json({ saved: true });
  } catch (err) {
    console.error('[career/save-assessment] failed:', err?.message || err);
    return jsonError(res, 500, 'Unable to save the career assessment.');
  }
}
