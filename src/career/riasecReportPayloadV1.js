// Structured RIASEC report payload for the Secret Sharz report composer.
// This module does not generate unsupported narrative claims.

import { buildRiasecSnapshot } from './riasecInterestExplorerV1.js';

const LABELS = Object.freeze({
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
});

const PAIR_THEMES = Object.freeze({
  RI: 'practical problem-solving and investigation',
  IA: 'investigation and creative exploration',
  AS: 'creative expression and people-focused activity',
  SE: 'people-focused work and initiative',
  EC: 'initiative and structured organisation',
  CR: 'structured organisation and practical activity',
});

function pairKey(a, b) {
  return [a, b].sort((x, y) => ['R','I','A','S','E','C'].indexOf(x) - ['R','I','A','S','E','C'].indexOf(y)).join('');
}

export function buildRiasecReportPayload(score, context = {}) {
  const snapshot = buildRiasecSnapshot(score);
  if (!snapshot.available) {
    return {
      reportType: 'career_interest_riasec',
      reportVersion: '1.0.0-draft',
      status: 'incomplete',
      audience: context.audience || 'student',
      snapshot,
      evidence: [],
      sections: [
        { id: 'completion', type: 'status', title: 'Complete your career interest assessment' },
      ],
    };
  }

  const top = snapshot.strongestSignals;
  const topPair = top.length >= 2 ? pairKey(top[0].dimension, top[1].dimension) : null;
  const sections = [
    {
      id: 'snapshot',
      type: 'profile',
      title: 'Your Career Interest Snapshot',
      evidence: ['riasec_scores'],
      data: snapshot,
    },
    {
      id: 'strongest_signals',
      type: 'interpretation',
      title: 'What Stands Out',
      evidence: ['riasec_rank_order'],
      data: top.map((signal) => ({
        dimension: signal.dimension,
        label: signal.label,
        theme: {
          R: 'practical and hands-on activities',
          I: 'investigation, analysis and understanding',
          A: 'creative and original expression',
          S: 'helping, teaching and collaboration',
          E: 'initiative, influence and leadership',
          C: 'organisation, structure and accuracy',
        }[signal.dimension],
      })),
    },
    {
      id: 'interest_overlap',
      type: 'integrated_interpretation',
      title: 'Where Your Interests Overlap',
      evidence: ['riasec_top_two'],
      data: topPair ? {
        dimensions: top.slice(0, 2).map((item) => item.label),
        theme: PAIR_THEMES[topPair] || 'a combination of your strongest interest areas',
      } : null,
    },
    {
      id: 'profile_shape',
      type: 'profile_shape',
      title: 'Your Overall Interest Pattern',
      evidence: ['riasec_profile_spread'],
      data: {
        spread: snapshot.spread,
        topTwoSpread: snapshot.topTwoSpread,
        interpretationMode: 'relative_profile',
        note: 'Dominant/balanced thresholds remain provisional until pilot validation.',
      },
    },
    {
      id: 'what_riasec_does_not_measure',
      type: 'limitations',
      title: 'What This Assessment Does Not Measure',
      evidence: [],
      data: [
        'academic ability',
        'personality',
        'career decision readiness',
        'specific professional qualifications',
      ],
    },
    {
      id: 'next_step',
      type: 'next_action',
      title: 'Your Next Step',
      evidence: ['assessment_coverage'],
      data: {
        recommendedNextAssessment: context.recommendedNextAssessment || 'career_aptitude_core',
        reason: context.recommendedNextReason || 'Add a second evidence source before making detailed pathway comparisons.',
      },
    },
  ];

  return {
    reportType: 'career_interest_riasec',
    reportVersion: '1.0.0-draft',
    status: 'draft',
    audience: context.audience || 'student',
    studentStage: context.studentStage || null,
    scoreSnapshot: snapshot,
    sections,
    personalisationInputsUsed: Object.keys(context).filter((key) => !['audience','studentStage'].includes(key)),
    safeguards: {
      noDeterministicCareerVerdict: true,
      noUnvalidatedCutoffs: true,
      noUnsupportedContextClaims: true,
      preservesHistoricalResult: true,
    },
  };
}
