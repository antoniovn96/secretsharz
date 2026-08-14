// Server-side catalogue repository helpers. Keep catalogue mutations behind
// authenticated admin APIs; client code should consume published records only.

export const CATALOGUE_COLLECTIONS = Object.freeze({
  careerFamilies: 'careerFamilies',
  careers: 'careers',
  courses: 'courses',
  colleges: 'colleges',
  relationships: 'catalogueRelationships',
});

export function publishedCatalogueQuery(collectionRef) {
  return collectionRef.where('status', '==', 'published');
}

export function assertAdminCatalogueMutation({ isAdmin }) {
  if (!isAdmin) throw new Error('Administrator access required.');
}

export function assertCollegePublication(college) {
  if (!college?.verified) throw new Error('College must be verified before publication.');
  if (!college?.website) throw new Error('College website/source is required before publication.');
}
