export const DATA_DOMAINS = Object.freeze({ PROFILE:'profile', WELLBEING:'wellbeing', SEN:'sen', CAREER:'career', INSTITUTION:'institution', AUDIT:'audit' });

function active(record) { return Boolean(record && record.status === 'active'); }

export function decideAccess({ actor, studentId, institutionId, service, domain, relationship, consent, safeguarding }) {
  const reasons = [];
  if (!actor?.uid) reasons.push('actor_missing');
  if (!studentId) reasons.push('student_missing');
  if (!institutionId) reasons.push('institution_context_missing');
  if (!relationship || !active(relationship)) reasons.push('active_relationship_required');
  if (service && relationship?.metadata?.service !== service) reasons.push('service_mismatch');
  if (domain && relationship?.domain !== domain) reasons.push('domain_mismatch');
  if (consent?.required && consent.status !== 'active') reasons.push('active_consent_required');
  if (safeguarding?.restricted && actor.role !== 'super_admin') reasons.push('safeguarding_restriction');
  if (actor.role === 'super_admin' && reasons.filter(r => r !== 'student_missing').length === 0) return { allowed:true, reasons:[] };
  return { allowed: reasons.length === 0, reasons };
}

export function assertAccess(input) {
  const decision = decideAccess(input);
  if (!decision.allowed) throw new Error(`Access denied: ${decision.reasons.join(', ')}`);
  return decision;
}
