// Secret Sharz — RIASEC V1 assessment API
// Temporary migration bridge: Firebase authentication + PostgreSQL assessment persistence.
// Do not treat Firebase identity as the eventual authorization architecture.

import { getAdminAuth } from '../../../../src/security/firebaseAdmin.js';
import { getPostgresPool } from '../../../../src/platform/postgres.js';
import { getLatestRiasecAssessmentV1, submitRiasecAssessmentV1 } from '../../../../src/platform/riasecAssessmentService.js';

function bearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

function jsonError(res, status, error, details = undefined) {
  return res.status(status).json({
    error,
    ...(details ? { details } : {}),
  });
}

async function authenticate(req, res) {
  const token = bearerToken(req);
  if (!token) {
    jsonError(res, 401, 'Authentication required.');
    return null;
  }

  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    jsonError(res, 401, 'Invalid or expired authentication token.');
    return null;
  }
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const decoded = await authenticate(req, res);
  if (!decoded) return;

  const personId = String(decoded.uid || '');
  if (!personId) return jsonError(res, 401, 'Authenticated person identity is missing.');

  try {
    const pool = getPostgresPool();

    if (req.method === 'POST') {
      const body = req.body || {};
      const result = await submitRiasecAssessmentV1({
        pool,
        personId,
        accountId: null,
        answers: body.answers,
        startedAt: body.startedAt || null,
        contextSnapshot: {
          language: typeof body.language === 'string' ? body.language : null,
          locale: typeof body.locale === 'string' ? body.locale : null,
          studentStage: typeof body.studentStage === 'string' ? body.studentStage : null,
        },
        previousAssessmentResultId: body.previousAssessmentResultId || null,
        actorPersonId: personId,
      });

      return res.status(201).json(result);
    }

    const result = await getLatestRiasecAssessmentV1({
      pool,
      personId,
      actorPersonId: personId,
    });

    return res.status(200).json({ result });
  } catch (error) {
    if (['ASSESSMENT_INCOMPLETE', 'INVALID_PREVIOUS_ASSESSMENT_RESULT'].includes(error?.code)) {
      return res.status(400).json({ error: error.message, code: error.code, details: error.details });
    }

    console.error('[riasec-v1] assessment operation failed:', error);
    return jsonError(res, 500, 'Unable to process the assessment right now.');
  }
}
