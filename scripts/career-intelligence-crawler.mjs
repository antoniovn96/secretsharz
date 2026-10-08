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
import { getSourceById, loadSourceRegistry } from './career-intelligence-source-registry.mjs';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_REGISTRY_PATH = 'config/career-intelligence-crawler.sources.json';
const USER_AGENT = 'SecretSharz-Career-Intelligence-Crawler/1.0 (+https://secretsharz.com)';

function getArg(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

export function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function normalizeNullableSourceValue(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  if (/^(not available|n\/a|na|none|null|-)$/i.test(normalized)) return null;
  return normalized;
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

export function splitInstitutionStatus(value) {
  const raw = normalizeWhitespace(value);
  const match = raw.match(
    /^(?<name>.*?)(?:\s*\(\s*(?<status>Government(?:\s*:\s*Autonomous)?|Government-Aided|Government\s*-\s*Autonomous|Un-Aided|Private|Aided|Autonomous)\s*\))$/i
  );
  if (!match?.groups) {
    return { displayName: raw, providerStatus: null };
  }
  return {
    displayName: normalizeWhitespace(match.groups.name),
    providerStatus: normalizeWhitespace(match.groups.status),
  };
}

export function normalizeInstitutionKey(value) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase('en-IN')
    .replace(/[^a-z0-9]+/g, '');
}

export function splitChoiceCodeVariant(value) {
  const raw = normalizeWhitespace(value);
  const match = raw.match(/^(?<base>\d{9})(?<variant>[A-Z]+)?$/i);
  if (!match?.groups) {
    return { baseChoiceCode: raw || null, choiceCodeVariant: null };
  }
  return {
    baseChoiceCode: match.groups.base,
    choiceCodeVariant: match.groups.variant ? match.groups.variant.toUpperCase() : null,
  };
}

export function normalizeProgrammeKey(value) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase('en-IN')
    .replace(/[^a-z0-9]+/g, '');
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

function looksLikeChoiceCode(value) {
  return /^\d{9}[A-Z]{0,3}$/i.test(normalizeWhitespace(value));
}

export function parseDteRows(rows, sourceUrl, source) {
  const staged = [];
  let currentInstitution = null;

  for (const cells of rows) {
    if (!cells.length) continue;

    // Actual DTE 2024-25 structure uses a one-cell institute heading such as:
    // "1006-Government Polytechnic, Murtijapur( Government )"
    if (cells.length === 1 && looksLikeInstitutionCode(cells[0])) {
      const { sourceCode, displayName: codeStrippedName } = splitSourceCodePrefix(cells[0]);
      if (sourceCode) {
        const statusSplit = splitInstitutionStatus(codeStrippedName);
        currentInstitution = {
          sourceInstitutionCode: sourceCode,
          sourceInstitutionName: codeStrippedName,
          institutionDisplayName: statusSplit.displayName,
          institutionIdentityKey: normalizeInstitutionKey(statusSplit.displayName),
          providerStatus: statusSplit.providerStatus,
        };

        staged.push({
          recordType: 'institution',
          country: source.country,
          jurisdiction: source.jurisdiction,
          sourceAuthority: source.authority,
          sourceUrl,
          ...currentInstitution,
          verificationState: 'PARSED',
        });
      }
      continue;
    }

    // Course row structure:
    // [serial, choiceCode, courseName, courseStatus, medium, sanctionedIntake]
    if (cells.length >= 6 && looksLikeChoiceCode(cells[1]) && currentInstitution) {
      const { baseChoiceCode, choiceCodeVariant } = splitChoiceCodeVariant(cells[1]);
      const programmeDisplayName = normalizeWhitespace(cells[2]);

      staged.push({
        recordType: 'programme',
        country: source.country,
        jurisdiction: source.jurisdiction,
        sourceAuthority: source.authority,
        sourceUrl,
        sourceInstitutionCode: currentInstitution.sourceInstitutionCode,
        institutionDisplayName: currentInstitution.institutionDisplayName,
        sourceInstitutionName: currentInstitution.sourceInstitutionName,
        providerStatus: normalizeNullableSourceValue(currentInstitution.providerStatus),
        sourceChoiceCode: cells[1],
        baseChoiceCode,
        choiceCodeVariant,
        programmeDisplayName,
        programmeIdentityKey: normalizeProgrammeKey(programmeDisplayName),
        courseStatus: normalizeNullableSourceValue(cells[3]),
        mediumOfInstruction: normalizeNullableSourceValue(cells[4]),
        sanctionedIntake: Number.isFinite(Number(cells[5])) ? Number(cells[5]) : null,
        sourceSerial: normalizeNullableSourceValue(cells[0]),
        verificationState: 'PARSED',
      });
      continue;
    }

    staged.push({
      recordType: 'source_row',
      sourceAuthority: source.authority,
      sourceUrl,
      rawCells: cells,
      verificationState: 'PARSED',
    });
  }

  return staged;
}

function buildRawSourceRecord({ source, requestedUrl, finalUrl, httpStatus, contentType, body }) {
  return {
    recordType: 'raw_source_snapshot',
    country: source.country,
    jurisdiction: source.jurisdiction,
    sourceAuthority: source.authority,
    sourceId: source.id,
    sourceType: source.sourceType,
    adapter: source.adapter,
    sourceUrl: requestedUrl,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    httpStatus,
    contentType,
    rawBody: body,
    verificationState: 'FETCHED',
  };
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
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

export async function crawlSource({ source, outputPath = 'crawler-out.json' }) {
  if (!source?.entryPoint) throw new Error('source.entryPoint is required');

  const parsedUrl = new URL(source.entryPoint);
  const fetched = await fetchText(parsedUrl.toString());

  let records;
  let parserStatus;
  if (source.adapter === 'dte-maharashtra-v2') {
    const rows = extractTableRows(fetched.body);
    records = parseDteRows(rows, fetched.finalUrl, source);
    parserStatus = 'PARSED';
  } else {
    records = [buildRawSourceRecord({
      source,
      requestedUrl: parsedUrl.toString(),
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.status,
      contentType: fetched.contentType,
      body: fetched.body,
    })];
    parserStatus = 'RAW_FETCH_ONLY';
  }

  const result = {
    schemaVersion: 'career-intelligence-crawler-staging-v2',
    fetchedAt: new Date().toISOString(),
    sourceId: source.id,
    sourceAuthority: source.authority,
    sourceType: source.sourceType,
    country: source.country,
    jurisdiction: source.jurisdiction,
    adapter: source.adapter,
    requestedUrl: parsedUrl.toString(),
    finalUrl: fetched.finalUrl,
    httpStatus: fetched.status,
    contentType: fetched.contentType,
    parserStatus,
    records,
    counts: {
      stagedRecords: records.length,
      institutionRecords: records.filter((r) => r.recordType === 'institution').length,
      programmeRecords: records.filter((r) => r.recordType === 'programme').length,
      rawSourceRecords: records.filter((r) => r.recordType === 'raw_source_snapshot').length,
    },
    productionWrite: false,
  };

  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8');
  return result;
}

export async function crawl({ sourceUrl, outputPath = 'crawler-out.json' }) {
  return crawlSource({
    source: {
      id: 'ad-hoc-url',
      country: null,
      jurisdiction: null,
      authority: 'UNREGISTERED_SOURCE',
      sourceType: 'ad-hoc',
      adapter: 'dte-maharashtra-v2',
      entryPoint: sourceUrl,
    },
    outputPath,
  });
}

async function main() {
  const sourceId = getArg('--source-id');
  const sourceUrl = getArg('--url');
  const outputPath = getArg('--out', 'crawler-out.json');
  const registryPath = getArg('--registry', DEFAULT_REGISTRY_PATH);
  const listOnly = process.argv.includes('--list-sources');

  const registry = await loadSourceRegistry(registryPath);

  if (listOnly) {
    for (const source of registry.sources) {
      process.stdout.write(`${source.id}\t${source.adapter}\t${source.country}\t${source.jurisdiction}\n`);
    }
    return;
  }

  let source;
  if (sourceId) {
    source = getSourceById(registry, sourceId);
  } else if (sourceUrl) {
    source = {
      id: 'ad-hoc-url',
      country: null,
      jurisdiction: null,
      authority: 'UNREGISTERED_SOURCE',
      sourceType: 'ad-hoc',
      adapter: 'dte-maharashtra-v2',
      entryPoint: sourceUrl,
    };
  } else {
    throw new Error(
      'Usage: node scripts/career-intelligence-crawler.mjs --source-id <id> [--registry <path>] [--out <path>] | --url <url> [--out <path>] | --list-sources'
    );
  }

  const result = await crawlSource({ source, outputPath });
  process.stdout.write(
    `Crawler complete: source=${result.sourceId}; parser=${result.parserStatus}; records=${result.records.length}; productionWrite=false; output=${outputPath}\n`
  );
}

const invokedDirectly =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(process.argv[1], 'file:').pathname;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exit(1);
  });
}
