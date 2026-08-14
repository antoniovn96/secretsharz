// Contract used by the payment layer and result UI. The payment provider must call
// the trusted server/webhook path to create the Firestore entitlement.

export const CAREER_ASSESSMENT_PRODUCT = Object.freeze({
  id: 'career-assessment-comprehensive-v1',
  name: 'VidyaVantage Comprehensive Career Assessment',
  entitlementType: 'career_assessment_full',
});

export function buildCheckoutMetadata({ personId, assessmentAttemptId }) {
  if (!personId || !assessmentAttemptId) throw new Error('personId and assessmentAttemptId are required');
  return {
    productId: CAREER_ASSESSMENT_PRODUCT.id,
    entitlementType: CAREER_ASSESSMENT_PRODUCT.entitlementType,
    personId,
    assessmentAttemptId,
  };
}

export function validateCheckoutMetadata(metadata) {
  return Boolean(
    metadata
      && metadata.productId === CAREER_ASSESSMENT_PRODUCT.id
      && metadata.entitlementType === CAREER_ASSESSMENT_PRODUCT.entitlementType
      && metadata.personId
      && metadata.assessmentAttemptId,
  );
}
