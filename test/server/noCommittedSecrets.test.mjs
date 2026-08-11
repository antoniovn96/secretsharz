// Security regression test: no credential-bearing secrets in the tracked
// source tree. Added by the Phase 1D.5 audit after finding committed MongoDB
// Atlas credentials (importData.js) and a tracked production .env containing a
// Firebase API key. This test guards against regression: it scans tracked
// files (via `git ls-files`, so it reflects what would be committed) for
// credential-bearing patterns.
//
// It does NOT connect to any service, use credentials, or run an emulator.
// It is intentionally conservative: it scans for high-signal patterns only
// (credential-bearing connection strings, private keys, service-account
// blobs, OpenAI/Anthropic-style secret keys, Google API keys) and ignores the
// committed .env.example placeholders.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = join(new URL('../../', import.meta.url).pathname);

function readTracked(rel) {
  const abs = join(REPO_ROOT, rel);
  if (!existsSync(abs)) return null;
  try {
    return readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

function trackedFiles() {
  const out = execSync('git ls-files', { cwd: REPO_ROOT, encoding: 'utf8' });
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

// Patterns that indicate a real credential (not a placeholder). Placeholders in
// .env.example use `your_..._here` / `<...>`, which these patterns do not match.
const SECRET_PATTERNS = [
  /mongodb(\+srv)?:\/\/[^\s"'<>]+:[^\s"'<>@]+@[^\s"'<>]+/i,
  /-----BEGIN (RSA |EC |OPENSSH |PGP |DSA )?PRIVATE KEY-----/,
  /"type"\s*:\s*"service_account"/,
  /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/,
  /AIza[0-9A-Za-z_\-]{35}/,
  /sk-[A-Za-z0-9]{20,}/,
  /sk-ant-[A-Za-z0-9_\-]{20,}/
];

const ALLOWED_PLACEHOLDER_FILES = new Set(['.env.example']);
// This scanner file legitimately contains the secret PATTERN DEFINITIONS
// (regex literals like `-----BEGIN PRIVATE KEY-----` and `service_account`).
// It is not itself a secret; exclude it from the scan to avoid self-tripping.
const SELF = 'test/server/noCommittedSecrets.test.mjs';

test('no credential-bearing secrets are tracked in the repository', () => {
  const files = trackedFiles();
  assert.ok(files.length > 0, 'git ls-files returned no tracked files');

  const findings = [];
  for (const rel of files) {
    if (/\.(png|jpe?g|gif|webp|ico|svg|woff2?|ttf|otf|mp4|webm|mp3|pdf|zip|jar)$/i.test(rel)) continue;
    if (rel === SELF) continue; // scanner file holds the pattern definitions, not secrets
    const content = readTracked(rel);
    if (content == null) continue;
    for (const pat of SECRET_PATTERNS) {
      const m = content.match(pat);
      if (m) {
        if (ALLOWED_PLACEHOLDER_FILES.has(rel)) continue;
        findings.push({ file: rel, sample: m[0].slice(0, 24) });
      }
    }
  }

  assert.deepEqual(findings, [],
    `Credential-bearing secrets found in tracked files (rotate + remove from history): ${JSON.stringify(findings, null, 2)}`);
});

test('the previously-leaked importData.js no longer hard-codes a MongoDB URI', () => {
  const files = trackedFiles();
  if (!files.includes('importData.js')) {
    // If the dead import script is later removed, this regression is moot.
    return;
  }
  const content = readTracked('importData.js');
  assert.ok(content, 'importData.js is tracked but unreadable');
  assert.ok(!/mongodb(\+srv)?:\/\/[^\s"'<>]+:[^\s"'<>@]+@/i.test(content),
    'importData.js must not contain a credential-bearing MongoDB URI');
  assert.ok(content.includes('process.env.MONGODB_URI'),
    'importData.js must read its connection string from the environment');
});

test('.env is not tracked (must stay gitignored, local-only)', () => {
  const files = trackedFiles();
  assert.ok(!files.includes('.env'),
    '.env is tracked -- it must be untracked and gitignored (it holds real secrets)');
});
