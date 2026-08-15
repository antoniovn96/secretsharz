export const CAREER_PRICING = {
  student_free: { sku: 'STUDENT_FREE', label: 'Student Career Snapshot', amountPaise: 0, reportTier: 'free' },
  student_individual: { sku: 'STUDENT_INDIVIDUAL', label: 'Student Full Career Intelligence', amountPaise: 99900, reportTier: 'full' },
  student_group_3: { sku: 'STUDENT_GROUP_3', label: 'Student Group (3)', amountPaise: 239700, reportTier: 'full', seats: 3 },
  student_group_5: { sku: 'STUDENT_GROUP_5', label: 'Student Group (5)', amountPaise: 349500, reportTier: 'full', seats: 5 },
  student_group_10: { sku: 'STUDENT_GROUP_10', label: 'Student Group (10)', amountPaise: 649000, reportTier: 'full', seats: 10 },
  professional_individual: { sku: 'PROFESSIONAL_INDIVIDUAL', label: 'Working Professional Career Intelligence', amountPaise: 149900, reportTier: 'full' },
  professional_transition: { sku: 'PROFESSIONAL_TRANSITION', label: 'Professional Career Transition Plan', amountPaise: 199900, reportTier: 'full' },
  hr_employee: { sku: 'HR_EMPLOYEE', label: 'HR Role Alignment Assessment', amountPaise: 99900, reportTier: 'hr' },
};

export function getCareerProduct(productKey) {
  return CAREER_PRICING[String(productKey || '').trim()] || null;
}

export function getConfiguredPrice(productKey, fallbackPaise) {
  const envKey = `RAZORPAY_${String(productKey || '').toUpperCase()}_AMOUNT_PAISE`;
  const configured = Number(process.env[envKey]);
  if (Number.isInteger(configured) && configured >= 100) return configured;
  return fallbackPaise;
}
