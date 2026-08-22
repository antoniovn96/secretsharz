import test from 'node:test';
import assert from 'node:assert/strict';
import { profileEditorToCanonicalPatch } from '../../src/platform/studentProfileWriteAdapter.js';

const trackCases = [
  ['career_guidance', { career: 'active', wellbeing: 'inactive' }],
  ['counselling', { career: 'inactive', wellbeing: 'active' }],
  ['sen', { career: 'inactive', wellbeing: 'inactive', sen: 'active' }],
  ['both', { career: 'active', wellbeing: 'active', sen: 'active' }],
  ['unassigned', {}],
];

test('profile editor adapter maps service tracks without dropping existing service state', () => {
  for (const [track, expected] of trackCases) {
    const patch = profileEditorToCanonicalPatch({ studentTrack: track }, {
      services: {
        career: { status: 'active', source: 'existing' },
        wellbeing: { status: 'active', source: 'existing' },
        sen: { status: 'active', source: 'existing' },
      },
    });

    if (track === 'unassigned') {
      assert.deepEqual(patch.services, {
        career: { status: 'active', source: 'existing' },
        wellbeing: { status: 'active', source: 'existing' },
        sen: { status: 'active', source: 'existing' },
      });
      continue;
    }

    for (const [service, status] of Object.entries(expected)) {
      assert.equal(patch.services[service].status, status, `${track} → ${service}`);
    }
  }
});

test('profile editor adapter preserves identity, contact and governance fields', () => {
  const patch = profileEditorToCanonicalPatch({
    profilePicture: 'https://example.test/photo.jpg',
    gender: 'female',
    email: 'student@example.test',
    phone: '+919999999999',
    counsellingConsentAgreed: true,
  }, {});

  assert.equal(patch.identity.photoURL, 'https://example.test/photo.jpg');
  assert.equal(patch.identity.gender, 'female');
  assert.equal(patch.contact.email, 'student@example.test');
  assert.equal(patch.contact.mobile.number, '+919999999999');
  assert.equal(patch.governance.consent.wellbeing, true);
});

test('profile editor adapter preserves existing guardian records', () => {
  const currentProfile = {
    family: {
      guardians: [
        { relationship: 'father', name: 'Old Father', accountId: 'acct-1' },
        { relationship: 'mother', name: 'Mother', accountId: 'acct-2' },
      ],
    },
  };

  const patch = profileEditorToCanonicalPatch({ fatherName: 'New Father' }, currentProfile);
  const father = patch.family.guardians.find((g) => g.relationship === 'father');
  const mother = patch.family.guardians.find((g) => g.relationship === 'mother');

  assert.equal(father.name, 'New Father');
  assert.equal(father.accountId, 'acct-1');
  assert.equal(mother.name, 'Mother');
  assert.equal(mother.accountId, 'acct-2');
});
