export const MOBILE_NUMBER_REGEX = /^[6-9][0-9]{9}$/;

export function normaliseMobileNumber(value) {
  return String(value ?? '').replace(/\s+/g, '');
}

export function validateMobileNumber(value) {
  const number = normaliseMobileNumber(value);
  if (!number) return { valid: false, value: '', message: 'Enter your 10-digit mobile number.' };
  if (!/^\d+$/.test(number)) return { valid: false, value: number, message: 'Mobile numbers can contain digits only.' };
  if (number.length !== 10) return { valid: false, value: number, message: 'Mobile numbers must contain exactly 10 digits.' };
  if (!/^[6-9]/.test(number)) return { valid: false, value: number, message: 'Mobile numbers must begin with 6, 7, 8 or 9.' };
  return { valid: true, value: number, message: '' };
}

export function formatMobileNumber(value) {
  const number = normaliseMobileNumber(value);
  return number.length === 10 && /^\d+$/.test(number) ? `${number.slice(0, 5)} ${number.slice(5)}` : number;
}
