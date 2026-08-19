export const ASSIGNMENT_POLICIES = Object.freeze({
  wellbeing: Object.freeze({ primary: 1, backup: 1 }),
  career: Object.freeze({ primary: 1 }),
  sen: Object.freeze({ primary: 1, multidisciplinary: Infinity }),
});

export function normalizeSlot(slot) {
  const value = String(slot || 'primary').toLowerCase();
  if (!['primary', 'backup', 'multidisciplinary'].includes(value)) throw new Error('Unknown assignment slot.');
  return value;
}

export function getAssignmentPolicy(service) {
  const policy = ASSIGNMENT_POLICIES[String(service || '').toLowerCase()];
  if (!policy) throw new Error(`No assignment policy defined for service: ${service}`);
  return policy;
}

export function validateAssignmentSlot(service, slot) {
  const normalized = normalizeSlot(slot);
  const policy = getAssignmentPolicy(service);
  if (policy[normalized] === undefined) throw new Error(`Assignment slot '${normalized}' is not permitted for ${service}.`);
  return { service, slot: normalized, maximum: policy[normalized] };
}

export function assertAssignmentCapacity(service, slot, activeAssignments) {
  const { maximum } = validateAssignmentSlot(service, slot);
  if (maximum !== Infinity && Number(activeAssignments || 0) >= maximum) {
    throw new Error(`Assignment capacity reached for ${service}:${normalizeSlot(slot)}.`);
  }
  return true;
}
