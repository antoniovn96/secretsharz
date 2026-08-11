// Jest configuration for Firestore Security Rule tests.
//
// These tests run against the Firestore Emulator only (never production).
// The test files are plain CommonJS so no Babel/TS transform is required.
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/test/security-rules'],
  testMatch: ['**/*.test.cjs'],
  testTimeout: 60000,
  // No transforms: rule tests are plain CommonJS using @firebase/rules-unit-testing.
  transform: {},
  // The emulator process is shared across the suite; tests clear data between runs.
  maxWorkers: 1,
  verbose: true
};
