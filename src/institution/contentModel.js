const CONTENT_TYPES = Object.freeze(['news', 'blog', 'event', 'guideline']);
const CONTENT_STATUSES = Object.freeze(['draft', 'scheduled', 'published', 'archived']);

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required.`);
  return value.trim();
}

function normaliseAudience(audience) {
  if (audience === undefined) return ['all'];
  if (!Array.isArray(audience) || audience.length === 0 || audience.some((x) => typeof x !== 'string' || !x.trim())) {
    throw new Error('audience must be a non-empty array of strings.');
  }
  return [...new Set(audience.map((x) => x.trim()))];
}

export function buildInstitutionContent(input = {}) {
  const type = requiredString(input.type, 'type');
  if (!CONTENT_TYPES.includes(type)) throw new Error(`Unsupported content type: ${type}`);

  const status = input.status === undefined ? 'draft' : requiredString(input.status, 'status');
  if (!CONTENT_STATUSES.includes(status)) throw new Error(`Unsupported content status: ${status}`);

  const item = {
    id: requiredString(input.id, 'id'),
    authorId: requiredString(input.authorId, 'authorId'),
    type,
    title: requiredString(input.title, 'title'),
    status,
    audience: normaliseAudience(input.audience),
    publishAt: input.publishAt || null,
    expiresAt: input.expiresAt || null,
  };

  if (item.publishAt && Number.isNaN(Date.parse(item.publishAt))) throw new Error('publishAt must be a valid date.');
  if (item.expiresAt && Number.isNaN(Date.parse(item.expiresAt))) throw new Error('expiresAt must be a valid date.');
  return Object.freeze(item);
}

export { CONTENT_TYPES, CONTENT_STATUSES };
