import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../../pages/api/career/assessment/riasec-v1.js';

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('RIASEC API rejects unauthenticated requests before database access', async () => {
  const req = { method: 'GET', headers: {} };
  const res = makeResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Authentication required.' });
});

test('RIASEC API rejects unsupported HTTP methods', async () => {
  const req = { method: 'PUT', headers: {} };
  const res = makeResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, POST');
  assert.deepEqual(res.body, { error: 'Method not allowed.' });
});
