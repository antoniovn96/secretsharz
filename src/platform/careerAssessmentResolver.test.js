import { resolveLatestCareerAssessment, toCareerAssessmentSummary } from './careerAssessmentResolver';

describe('careerAssessmentResolver', () => {
  test('returns not_started when no assessment exists', () => {
    expect(resolveLatestCareerAssessment({}).status).toBe('not_started');
  });

  test('prefers the newest completed canonical attempt over older attempts', () => {
    const result = resolveLatestCareerAssessment({
      assessments: [
        { id: 'old', status: 'completed', completedAt: '2026-01-01T00:00:00Z', riasecCode: 'SIC' },
        { id: 'new', status: 'completed', completedAt: '2026-02-01T00:00:00Z', riasecCode: 'RIA' },
      ],
      careerAssessmentV2: { completedAt: '2026-03-01T00:00:00Z', scores: { riasecCode: 'ASE' } },
    });

    expect(result.id).toBe('new');
    expect(result.riasecCode).toBe('RIA');
    expect(result.source).toBe('canonical');
  });

  test('uses V2 when canonical assessments are unavailable', () => {
    const result = resolveLatestCareerAssessment({
      careerAssessmentV2: {
        id: 'v2',
        completedAt: '2026-02-01T00:00:00Z',
        scores: { riasecCode: 'SIC', riasecScores: { S: 8, I: 7, C: 6 } },
      },
    });

    expect(result.source).toBe('v2');
    expect(result.status).toBe('completed');
    expect(result.riasecCode).toBe('SIC');
  });

  test('falls back to legacy fields without inventing a result', () => {
    const result = resolveLatestCareerAssessment({
      riasecCode: 'RIA',
      riasecScores: { R: 9, I: 8, A: 7 },
      assessmentCompletedAt: '2026-01-01T00:00:00Z',
    });

    expect(result.source).toBe('legacy');
    expect(result.status).toBe('completed');
    expect(result.riasecCode).toBe('RIA');
  });

  test('reports only the canonical summary fields needed by a directory row', () => {
    expect(toCareerAssessmentSummary({ riasecCode: 'SIC', assessmentCompletedAt: '2026-01-01T00:00:00Z' }))
      .toEqual(expect.objectContaining({ status: 'completed', code: 'SIC' }));
  });
});
