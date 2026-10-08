import fs from 'node:fs/promises';

export async function loadSourceRegistry(path = 'config/career-intelligence-crawler.sources.json') {
  const text = await fs.readFile(path, 'utf8');
  const registry = JSON.parse(text);
  if (!registry || !Array.isArray(registry.sources)) {
    throw new Error('Invalid Career Intelligence crawler source registry: sources[] is required');
  }
  return registry;
}

export function getSourceById(registry, id) {
  const source = registry.sources.find((candidate) => candidate.id === id);
  if (!source) {
    throw new Error(`Crawler source not found: ${id}`);
  }
  return source;
}

export function listSourceIds(registry) {
  return registry.sources.map((source) => source.id);
}
