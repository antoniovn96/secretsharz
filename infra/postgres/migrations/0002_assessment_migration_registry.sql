-- Secret Sharz — legacy assessment migration registry
-- Purpose: make Firebase -> PostgreSQL assessment imports idempotent and auditable.

ALTER TABLE assessment_results
  ADD COLUMN IF NOT EXISTS migration_metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS assessment_migration_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  source_record_key TEXT NOT NULL,
  source_person_id TEXT NOT NULL,
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE RESTRICT,
  source_hash TEXT NOT NULL,
  migration_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('dry_run','imported','skipped','failed')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (source_system, source_record_key),
  UNIQUE (source_system, source_record_key)
);

CREATE INDEX IF NOT EXISTS idx_assessment_migration_hash
  ON assessment_migration_registry (source_system, source_hash);

CREATE INDEX IF NOT EXISTS idx_assessment_migration_person
  ON assessment_migration_registry (source_person_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_results_migration_source
  ON assessment_results ((migration_metadata->>'sourceSystem'))
  WHERE migration_metadata ? 'sourceSystem';
