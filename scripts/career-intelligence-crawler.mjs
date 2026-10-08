#!/usr/bin/env node

/**
 * Secret Sharz Career Intelligence Crawler v1
 *
 * Staging-only crawler. It fetches authoritative source pages and produces
 * normalized JSON. It does NOT write to PostgreSQL, Firestore, program_offerings,
 * canonical programmes, or canonical specializations.
 */

import fs from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 2;
const USER_AGENT = 'SecretSharz-Career-Intelligence-Crawler/1.0 (+https://secretsharz.com)';

function getArg(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function splitSourceCodePrefix(value) {
  const raw = normalizeWhitespace(value);
  const match = raw.match(/^(?<code>\d{3,}[A-Za-z0-9_-]*?)\s*[-–—:]\s*(?<name>.+)$/);
  if (!match?.groups) {
    return { sourceCode: null, displayName: raw };
  }
  return {
    sourceCode: match.groups.code,
    displayName: normalizeWhitespace(match.groups.name),
  };
}

function stripTags(value) {
  return normalizeWhitespace(
    String(value ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
  );
}

function extractTableRows(html) {
  const rows = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRe.exec(html)) !== null) {
    const cells = [];
    const cellRe = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellMatch;
    while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
      cells.push(stripTags(cellMatch[1]));
    }
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function looksLikeInstitutionCode(value) {
  return /^\d{3,}[A-Za-z0-9_-]*$/.test(normalizeWhitespace(value));
}

function parseDteRows(rows, sourceUrl) {
  const staged = [];
  for (const cells of rows) {
    if (!cells.length) continue;

    // Some DTE pages expose rows as [code, institution, state, district, status].
    if (cells.length >= 2 && looksLikeInstitutionCode(cells[0])) {
      const { sourceCode, displayName } = splitSourceCodePrefix(
        `${cells[0]}-${cells[1]}`
      );
      if (!sourceCode || !displayName) continue;

      staged.push({
        recordType: 'institution',
        country: 'India',
        state: cells[2] || null,
        district: cells[3] || null,
        sourceAuthority: 'Directorate of Technical Education, Maharashtra',
        sourceUrl,
        sourceInstitutionCode: sourceCode,
        sourceInstitutionName: cells[1] || null,
        institutionDisplayName: displayName,
        operationalStatus: cells[4] || null,
        verificationState: 'FETCHED',
      });
      continue;
    }

    // Generic source-safe fallback: retain row, never infer identity.
    staged.push({
      recordType: 'source_row',
      sourceAuthority: 'Directorate of Technical Education, Maharashtra',
      sourceUrl,
      rawCells: cells,
      verificationState: 'FETCHED',
    });
  }
  return staged;
}

async function fetchText(url, { timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      const body = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }
      return {
        status: response.status,
        finalUrl: response.url,
        contentType: response.headers.get('content-type') || '',
        body,
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function main() {
  const sourceUrl = getArg('--url');
  const outputPath = getArg('--out', 'crawler-out.json');

  if (!sourceUrl) {
    throw new Error('Usage: node scripts/career-intelligence-crawler.mjs --url <source-url> [--out <path>]');
  }

  const parsedUrl = new URL(sourceUrl);
  const fetched = await fetchText(parsedUrl.toString());
  const rows = extractTableRows(fetched.body);
  const records = parseDteRows(rows, fetched.finalUrl);

  const result = {
    schemaVersion: 'career-intelligence-crawler-staging-v1',
    fetchedAt: new Date().toISOString(),
    requestedUrl: parsedUrl.toString(),
    finalUrl: fetched.finalUrl,
    httpStatus: fetched.status,
    contentType: fetched.contentType,
    parser: 'dte-maharashtra-v1',
    records,
    counts: {
      tableRows: rows.length,
      stagedRecords: records.length,
      institutionRecords: records.filter((r) => r.recordType === 'institution').length,
    },
    productionWrite: false,
  };

  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8');
  process.stdout.write(
    `Crawler complete: ${records.length} staged records; productionWrite=false; output=${outputPath}\n`
  );
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
