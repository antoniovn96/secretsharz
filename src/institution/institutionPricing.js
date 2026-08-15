export const INSTITUTION_DISCOUNT_TYPES = ['none', 'percentage', 'fixed_total', 'fixed_per_license'];

export function normaliseInstitutionDiscountType(value) {
  const raw = String(value || 'none');
  if (INSTITUTION_DISCOUNT_TYPES.includes(raw)) return raw;
  if (raw === 'fixed') return 'fixed_per_license';
  return 'none';
}

export function calculateInstitutionPricing({ licenseCount, pricePerLicense, discountType, discountValue }) {
  const purchased = Number(licenseCount);
  const unitPrice = Math.max(0, Number(pricePerLicense || 0));
  const type = normaliseInstitutionDiscountType(discountType);
  const value = Math.max(0, Number(discountValue || 0));
  const grossAmount = Math.round(purchased * unitPrice);
  let discountAmount = 0;
  if (type === 'percentage') discountAmount = Math.min(grossAmount, grossAmount * Math.min(100, value) / 100);
  if (type === 'fixed_total') discountAmount = Math.min(grossAmount, value);
  if (type === 'fixed_per_license') discountAmount = Math.min(grossAmount, value * purchased);
  return {
    purchased,
    pricePerLicense: Math.round(unitPrice),
    discountType: type,
    discountValue: value,
    grossAmount,
    discountAmount: Math.round(discountAmount),
    totalAmount: Math.max(0, Math.round(grossAmount - discountAmount)),
  };
}
