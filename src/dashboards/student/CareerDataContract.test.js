import { normaliseCareerJourney } from './CareerDataContract';

describe('CareerDataContract', () => {
  test('normalises a legacy RIASEC stream into the UI-compatible shape', () => {
    const journey = normaliseCareerJourney({
      careerAssessment: {
        hollandCode: 'SIC',
        streams: ['Commerce'],
        top5Careers: [{ name: 'Accountant' }],
        maturityPct: 72,
      },
    });

    expect(journey.assessment.hollandCode).toEqual(['S', 'I', 'C']);
    expect(journey.assessment.streams).toEqual([{ id: 'Commerce', label: 'Commerce' }]);
    expect(journey.assessment.top5Careers).toEqual([{ name: 'Accountant' }]);
    expect(journey.assessment.maturityPct).toBe(72);
  });

  test('preserves structured streams while filling a missing id from known fields', () => {
    const journey = normaliseCareerJourney({
      careerAssessmentV2: {
        scores: { riasecCode: 'RIA' },
        streams: [{ name: 'Science' }],
      },
    });

    expect(journey.assessment.streams).toEqual([{ name: 'Science', id: 'Science' }]);
  });

  test('keeps missing assessment data honest', () => {
    const journey = normaliseCareerJourney({});

    expect(journey.assessment.status).toBe('not_started');
    expect(journey.assessment.hollandCode).toEqual([]);
    expect(journey.assessment.riasecScores).toEqual({});
    expect(journey.assessment.streams).toEqual([]);
  });
});
