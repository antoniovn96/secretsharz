import {
  SAFEGUARDING_ROLE,
  grantCoversScope,
  canIssueSafeguardingGrant,
  isSafeguardingGrantActive,
} from './safeguardingGrant.js';

describe('trusted safeguarding grants', () => {
  const now = new Date('2026-08-23T10:00:00.000Z');

  test('only safeguarding officer can issue a grant', () => {
    expect(canIssueSafeguardingGrant({
      actorRole: 'counsellor', actorPersonId: 'a', targetPersonId: 's',
      reason: 'Immediate safety concern', now,
    }).allowed).toBe(false);

    expect(canIssueSafeguardingGrant({
      actorRole: SAFEGUARDING_ROLE, actorPersonId: 'a', targetPersonId: 's',
      reason: 'Immediate safety concern', now,
    }).allowed).toBe(true);
  });

  test('grant is time limited and scoped', () => {
    const result = canIssueSafeguardingGrant({
      actorRole: SAFEGUARDING_ROLE,
      actorPersonId: 'officer',
      targetPersonId: 'student',
      reason: 'Immediate safety concern',
      scope: ['safeguarding'],
      now,
      durationMs: 15 * 60 * 1000,
    });

    expect(isSafeguardingGrantActive(result.grant, now)).toBe(true);
    expect(grantCoversScope(result.grant, 'safeguarding')).toBe(true);
    expect(grantCoversScope(result.grant, 'counselling')).toBe(false);
    expect(isSafeguardingGrantActive(result.grant, new Date('2026-08-23T10:16:00.000Z'))).toBe(false);
  });

  test('grant cannot exceed one hour', () => {
    expect(canIssueSafeguardingGrant({
      actorRole: SAFEGUARDING_ROLE,
      actorPersonId: 'officer',
      targetPersonId: 'student',
      reason: 'Immediate safety concern',
      now,
      durationMs: 60 * 60 * 1000 + 1,
    }).allowed).toBe(false);
  });
});
