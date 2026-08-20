const asString = (value) => value === undefined || value === null ? null : String(value).trim() || null;

/**
 * Normalize service assignment records used by professional APIs.
 * Supports the canonical primary/backup/team shape while tolerating legacy
 * scalar assignment IDs.
 */
export function normalizeServiceAssignment(raw = {}, service = null) {
  if (typeof raw === 'string') {
    return {
      service,
      primaryProfessionalId: asString(raw),
      backupProfessionalId: null,
      team: [],
      status: 'active',
    };
  }

  const source = raw && typeof raw === 'object' ? raw : {};
  const teamSource = Array.isArray(source.team) ? source.team : [];
  const team = teamSource
    .filter(Boolean)
    .map((member) => typeof member === 'string'
      ? { professionalId: asString(member), status: 'active' }
      : {
          professionalId: asString(member.professionalId || member.id || member.uid),
          status: asString(member.status) || 'active',
          role: asString(member.role),
        })
    .filter((member) => member.professionalId);

  return {
    service: asString(source.service) || service,
    primaryProfessionalId: asString(source.primaryProfessionalId || source.primaryId || source.professionalId),
    backupProfessionalId: asString(source.backupProfessionalId || source.backupId),
    team,
    status: asString(source.status) || 'active',
  };
}

export default normalizeServiceAssignment;
