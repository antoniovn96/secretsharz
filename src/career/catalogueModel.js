// Canonical catalogue contracts for VidyaVantage admin-managed career discovery.

export const CATALOGUE_STATUS = Object.freeze(['draft', 'published', 'archived']);
export const CATALOGUE_ENTITY_TYPES = Object.freeze(['careerFamily', 'career', 'course', 'college']);

export function assertCatalogueStatus(status) {
  if (!CATALOGUE_STATUS.includes(status)) throw new Error(`Invalid catalogue status: ${status}`);
  return status;
}

export function buildCareerFamily({ id, title, description = '', status = 'draft', version = 1 }) {
  if (!id || !title) throw new Error('Career family id and title are required.');
  assertCatalogueStatus(status);
  return { id, title, description, status, version, entityType: 'careerFamily' };
}

export function buildCareer({ id, familyId, title, description = '', riasec = [], dimensions = [], status = 'draft', version = 1 }) {
  if (!id || !familyId || !title) throw new Error('Career id, familyId and title are required.');
  assertCatalogueStatus(status);
  return { id, familyId, title, description, riasec, dimensions, status, version, entityType: 'career' };
}

export function buildCourse({ id, title, level, duration = null, eligibility = '', status = 'draft', version = 1 }) {
  if (!id || !title || !level) throw new Error('Course id, title and level are required.');
  assertCatalogueStatus(status);
  return { id, title, level, duration, eligibility, status, version, entityType: 'course' };
}

export function buildCollege({ id, name, country = 'India', city = null, state = null, website = null, verified = false, status = 'draft', version = 1 }) {
  if (!id || !name) throw new Error('College id and name are required.');
  assertCatalogueStatus(status);
  return { id, name, country, city, state, website, verified, status, version, entityType: 'college' };
}

export function canPublishCollege(college) {
  return Boolean(college?.verified && college?.website && college?.status === 'published');
}

export function buildCatalogueRelationship({ fromId, fromType, toId, toType, relation, status = 'draft', version = 1 }) {
  if (!fromId || !toId || !fromType || !toType || !relation) throw new Error('Relationship endpoints and relation are required.');
  if (!CATALOGUE_ENTITY_TYPES.includes(fromType) || !CATALOGUE_ENTITY_TYPES.includes(toType)) throw new Error('Invalid catalogue entity type.');
  assertCatalogueStatus(status);
  return { fromId, fromType, toId, toType, relation, status, version };
}
