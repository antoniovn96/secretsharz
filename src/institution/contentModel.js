// Institution content contracts shared by the admin CMS and student dashboards.

export const CONTENT_TYPES = Object.freeze([
  'news',
  'blog',
  'event',
  'announcement',
  'guideline',
  'challenge',
  'achievement',
]);

export const CONTENT_STATUS = Object.freeze(['draft', 'scheduled', 'published', 'archived']);

export function buildInstitutionContent({
  id,
  type,
  title,
  summary = '',
  body = '',
  coverImage = null,
  audience = ['all'],
  tags = [],
  authorId,
  institutionId = null,
  status = 'draft',
  publishAt = null,
  expiresAt = null,
  version = 1,
}) {
  if (!id || !title || !authorId) throw new Error('id, title and authorId are required.');
  if (!CONTENT_TYPES.includes(type)) throw new Error(`Invalid content type: ${type}`);
  if (!CONTENT_STATUS.includes(status)) throw new Error(`Invalid content status: ${status}`);
  return {
    id, type, title, summary, body, coverImage, audience, tags, authorId, institutionId,
    status, publishAt, expiresAt, version,
  };
}

export function isVisibleToAudience(content, audience, now = new Date()) {
  if (!content || content.status !== 'published') return false;
  if (content.publishAt && new Date(content.publishAt) > now) return false;
  if (content.expiresAt && new Date(content.expiresAt) <= now) return false;
  return content.audience?.includes('all') || content.audience?.includes(audience);
}
