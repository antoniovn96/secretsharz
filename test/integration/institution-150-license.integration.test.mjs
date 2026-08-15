// Secret Sharz — institutional 150-license end-to-end integration test.
//
// Runs the real institution provisioning, redemption, dashboard and report
// endpoints against Firebase Auth + Firestore emulators. No production data
// or founder account is created by this suite; this avoids cross-file email
// collisions with the existing role-management integration suite.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut, connectAuthEmulator } from 'firebase/auth';

import provisionRoster from '../../pages/api/institution/provision-roster.js';
import redeemCode from '../../pages/api/institution/redeem-code.js';
import institutionDashboard from '../../pages/api/institution/dashboard.js';
import studentReport from '../../pages/api/institution/student-report.js';
import { getAdminAuth, getAdminFirestore, isEmulatorMode } from '../../src/security/firebaseAdmin.js';

const PROJECT_ID = 'secretsharz-emulator-test';
const AUTH_URL = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099'}`;

const clientApp = initializeApp({ apiKey: 'institution-test', projectId: PROJECT_ID }, 'institution-150-license-client');
const clientAuth = getAuth(clientApp);
connectAuthEmulator(clientAuth, AUTH_URL, { disableWarnings: true });

let sequence = 0;
function uid(prefix) {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    setHeader(key, value) { this.headers[key] = value; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; }
  };
}

async function mintToken({ email, emailVerified = true } = {}) {
  const theUid = uid('institution-user');
  const admin = getAdminAuth();
  const requestedEmail = email || `${theUid}@emulator.test`;
  await admin.createUser({ uid: theUid, email: requestedEmail, emailVerified, password: 'password123' });
  const customToken = await admin.createCustomToken(theUid);
  const credential = await signInWithCustomToken(clientAuth, customToken);
  return { uid: theUid, idToken: await credential.user.getIdToken(), email: requestedEmail };
}

async function call(handler, { token, body = {}, method = 'POST', query = {} } = {}) {
  const req = { method, headers: token ? { authorization: `Bearer ${token}` } : {}, body, query };
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, body: res.body };
}

async function createCoordinatorInstitution({ name, licenseCount = 150, paymentStatus = 'paid' } = {}) {
  const coordinator = await mintToken({});
  const institutionId = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uid('tenant')}`;
  const db = getAdminFirestore();
  await db.collection('institutions').doc(institutionId).set({
    id: institutionId,
    name,
    tenantCode: name.replace(/[^A-Za-z0-9]/g, '').slice(0, 12).toUpperCase(),
    institutionCode: `SSZ-TEST-${uid('code').toUpperCase()}`,
    status: 'active',
    contactEmail: coordinator.email,
    coordinator: { uid: coordinator.uid, email: coordinator.email, role: 'coordinator' },
    licenses: {
      purchased: licenseCount,
      used: 0,
      available: licenseCount,
      paymentStatus,
      pricePerLicense: 0,
      totalAmount: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  await db.collection('users').doc(coordinator.uid).set({
    role: 'institution_member',
    institutionId,
    institutionName: name,
    institutionRole: 'coordinator',
    status: 'active'
  }, { merge: true });
  return { coordinator, institutionId, db };
}

before(() => {
  assert.equal(isEmulatorMode(), true, 'Institution integration tests require Firebase emulators.');
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, 'FIREBASE_AUTH_EMULATOR_HOST must be set.');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'FIRESTORE_EMULATOR_HOST must be set.');
});

after(async () => {
  try { await signOut(clientAuth); } catch (_) {}
});

test('150-license institutional journey: provision → redeem → assess → report', async () => {
  const { coordinator, institutionId, db } = await createCoordinatorInstitution({
    name: '150 License Integration School',
    licenseCount: 150,
    paymentStatus: 'paid'
  });

  const rows = Array.from({ length: 150 }, (_, index) => ({
    fullName: `Institution Test Student ${String(index + 1).padStart(3, '0')}`,
    className: index < 50 ? '10' : index < 100 ? '11' : '12',
    section: ['A', 'B', 'C'][index % 3],
    rollNumber: String(index + 1)
  }));

  const provision = await call(provisionRoster, {
    token: coordinator.idToken,
    body: { institutionId, rows }
  });

  assert.equal(provision.status, 200, JSON.stringify(provision.body));
  assert.equal(provision.body.students.length, 150);
  assert.equal(provision.body.institution.purchased, 150);
  assert.equal(provision.body.institution.used, 150);
  assert.equal(provision.body.institution.available, 0);

  const students = provision.body.students;
  const codes = students.map(student => student.accessCode);
  assert.equal(new Set(codes).size, 150, 'all 150 access codes must be unique');
  assert.ok(codes.every(code => /^SSZ-[A-Z0-9]+-\d{2}-[A-F0-9]{12}$/.test(code)), 'all codes must use the expected institutional format');

  const dashboard = await call(institutionDashboard, {
    token: coordinator.idToken,
    method: 'GET',
    query: { institutionId }
  });
  assert.equal(dashboard.status, 200, JSON.stringify(dashboard.body));
  assert.equal(dashboard.body.students.length, 150);
  assert.equal(dashboard.body.summary.total, 150);
  assert.equal(dashboard.body.institution.paymentStatus, 'paid');
  assert.equal(dashboard.body.institution.licenses.purchased, 150);
  assert.equal(dashboard.body.institution.licenses.used, 150);
  assert.equal(dashboard.body.institution.licenses.available, 0);

  const studentA = await mintToken({});
  const studentB = await mintToken({});
  const code = codes[0];
  const rosterId = students[0].id;

  const firstRedemption = await call(redeemCode, { token: studentA.idToken, body: { code } });
  assert.equal(firstRedemption.status, 200, JSON.stringify(firstRedemption.body));
  assert.equal(firstRedemption.body.student.fullName, rows[0].fullName);

  const replayBySameStudent = await call(redeemCode, { token: studentA.idToken, body: { code } });
  assert.equal(replayBySameStudent.status, 200, 'same student replay should be idempotent');

  const replayByAnotherStudent = await call(redeemCode, { token: studentB.idToken, body: { code } });
  assert.equal(replayByAnotherStudent.status, 409);

  const institutionRef = db.collection('institutions').doc(institutionId);
  const rosterSnap = await institutionRef.collection('roster').doc(rosterId).get();
  assert.equal(rosterSnap.data().status, 'claimed');
  assert.equal(rosterSnap.data().claimedBy, studentA.uid);

  // Simulate the assessment engine completing its canonical report write.
  // The institutional boundary is what this test verifies; question scoring
  // remains covered by the dedicated career-assessment tests.
  await db.collection('users').doc(studentA.uid).set({
    careerAssessmentV2: {
      version: 'integration-test',
      scores: { riasecCode: 'RIA', readinessPercent: 82 },
      careerExploration: [{ id: 'career-1', name: 'Integration Test Career', category: 'Test' }]
    }
  }, { merge: true });
  await institutionRef.collection('roster').doc(rosterId).set({
    assessmentStatus: 'completed',
    reportStatus: 'ready',
    updatedAt: new Date().toISOString()
  }, { merge: true });

  const report = await call(studentReport, {
    token: coordinator.idToken,
    method: 'GET',
    query: { institutionId, rosterId }
  });
  assert.equal(report.status, 200, JSON.stringify(report.body));
  assert.equal(report.body.student.fullName, rows[0].fullName);
  assert.equal(report.body.report.scores.riasecCode, 'RIA');
  assert.equal(report.body.report.scores.readinessPercent, 82);

  const finalDashboard = await call(institutionDashboard, {
    token: coordinator.idToken,
    method: 'GET',
    query: { institutionId }
  });
  assert.equal(finalDashboard.status, 200, JSON.stringify(finalDashboard.body));
  assert.equal(finalDashboard.body.summary.total, 150);
  assert.equal(finalDashboard.body.summary.claimed, 1);
  assert.equal(finalDashboard.body.summary.started, 1);
  assert.equal(finalDashboard.body.summary.completed, 1);
  assert.equal(finalDashboard.body.summary.reportsReady, 1);
});

test('institutional code cannot be redeemed while entitlement is unpaid', async () => {
  const { coordinator, institutionId, db } = await createCoordinatorInstitution({
    name: 'Unpaid Integration School',
    licenseCount: 1,
    paymentStatus: 'paid'
  });

  const provision = await call(provisionRoster, {
    token: coordinator.idToken,
    body: { institutionId, rows: [{ fullName: 'Locked Student', className: '10', section: 'A', rollNumber: '1' }] }
  });
  assert.equal(provision.status, 200, JSON.stringify(provision.body));

  await db.collection('institutions').doc(institutionId).set({
    licenses: { paymentStatus: 'pending' },
    updatedAt: new Date().toISOString()
  }, { merge: true });

  const student = await mintToken({});
  const redemption = await call(redeemCode, {
    token: student.idToken,
    body: { code: provision.body.students[0].accessCode }
  });
  assert.equal(redemption.status, 409);
  assert.match(redemption.body.error, /payment|entitlement|locked/i);
});
