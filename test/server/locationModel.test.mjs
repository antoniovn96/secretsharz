import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLocation, hasLocation, formatLocation } from '../../src/platform/locationModel.js';

test('normalizes location values to a stable profile shape', () => {
  assert.deepEqual(normalizeLocation({
    countryId: 101,
    countryName: ' India ',
    countryIso2: 'in',
    stateId: 10,
    stateName: 'Karnataka',
    stateCode: 'KA',
    cityId: 123,
    cityName: ' Bengaluru ',
    postalCode: 560001,
  }), {
    countryId: '101',
    countryName: 'India',
    countryIso2: 'IN',
    stateId: '10',
    stateName: 'Karnataka',
    stateCode: 'KA',
    cityId: '123',
    cityName: 'Bengaluru',
    postalCode: '560001',
  });
});

test('missing and malformed location values remain safe', () => {
  assert.deepEqual(normalizeLocation(null), {
    countryId: '', countryName: '', countryIso2: '', stateId: '', stateName: '', stateCode: '', cityId: '', cityName: '', postalCode: '',
  });
  assert.equal(hasLocation(null), false);
});

test('formats the human-readable location without inventing missing fields', () => {
  assert.equal(formatLocation({ cityName: 'Bengaluru', stateName: 'Karnataka', countryName: 'India', postalCode: '560001' }), 'Bengaluru, Karnataka, India, 560001');
  assert.equal(formatLocation({ countryName: 'India' }), 'India');
});
