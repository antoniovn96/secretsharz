export const CONTENT_STUDIO_ACTIONS = Object.freeze({
  CREATE: 'create',
  EDIT: 'edit',
  PREVIEW: 'preview',
  PUBLISH: 'publish',
  ARCHIVE: 'archive',
});

export function buildPublishRequest(item) {
  if (!item?.id || !item?.type) throw new Error('Content id and type are required.');
  return { id: item.id, type: item.type, action: CONTENT_STUDIO_ACTIONS.PUBLISH };
}

export function canEditContent({ isAdmin }) {
  return Boolean(isAdmin);
}
