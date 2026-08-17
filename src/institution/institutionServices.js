export const INSTITUTION_SERVICES = Object.freeze([
  { id: 'career', label: 'Career Guidance', description: 'Career assessment, counsellor assignment, reports and roadmaps.' },
  { id: 'wellbeing', label: 'Wellbeing & Counselling', description: 'Aggregate wellbeing programme access for the institution.' },
  { id: 'sen', label: 'SEN Support', description: 'Aggregate SEN programme access for the institution.' },
]);

export const INSTITUTION_SERVICE_IDS = INSTITUTION_SERVICES.map(service => service.id);

export function normaliseInstitutionServices(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => String(item || '').trim().toLowerCase()).filter(item => INSTITUTION_SERVICE_IDS.includes(item)))];
}

export function hasInstitutionService(institution, serviceId) {
  const services = normaliseInstitutionServices(institution?.licenses?.services || institution?.services);
  return services.includes(serviceId);
}
