-- Secret Sharz — Assessment Result PostgreSQL Model V1
-- Draft migration only.
-- Provider-independent application contract; no application authorization is performed here.
-- Canonical Person/Account tables are intentionally referenced as opaque TEXT until the
-- broader platform identity migration establishes concrete PostgreSQL foreign keys.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  account_id TEXT,
  institution_relationship_id TEXT,
  service_engagement_id TEXT,

  status TEXT NOT NULL CHECK (
    status IN (
      'created',
      'started',
      'submitted',
      'scored',
      'reported',
      'abandoned',
      'invalidated',
      'superseded'
    )
  ),

  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  scored_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ,
  completion_percent NUMERIC(5,2) NOT NULL DEFAULT 0
    CHECK (completion_percent >= 0 AND completion_percent <= 100),
  attempt_number INTEGER NOT NULL DEFAULT 1
    CHECK (attempt_number >= 1),
  abandonment_reason TEXT,
  invalidation_reason TEXT,

  instrument_id TEXT NOT NULL,
  instrument_version TEXT NOT NULL,
  item_bank_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  report_version TEXT,
  norm_version TEXT,
  algorithm_version TEXT,
  language TEXT,
  locale TEXT,

  evidence_quality JSONB NOT NULL DEFAULT '{}'::jsonb,
  context_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,

  previous_assessment_result_id UUID REFERENCES assessment_results(id),
  reassessment_reason TEXT,
  recommended_retake_date TIMESTAMPTZ,
  longitudinal_sequence INTEGER NOT NULL DEFAULT 1
    CHECK (longitudinal_sequence >= 1),

  entitlement_id TEXT,
  order_id TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK (
    submitted_at IS NULL OR started_at IS NULL OR submitted_at >= started_at
  ),
  CHECK (
    scored_at IS NULL OR submitted_at IS NULL OR scored_at >= submitted_at
  ),
  CHECK (
    reported_at IS NULL OR scored_at IS NULL OR reported_at >= scored_at
  )
);

CREATE INDEX IF NOT EXISTS idx_assessment_results_person_created
  ON assessment_results (person_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_results_person_instrument
  ON assessment_results (person_id, instrument_id, instrument_version, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_results_service
  ON assessment_results (service_engagement_id)
  WHERE service_engagement_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_assessment_results_institution_relationship
  ON assessment_results (institution_relationship_id)
  WHERE institution_relationship_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_assessment_results_status_dates
  ON assessment_results (status, submitted_at DESC, scored_at DESC);

CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE RESTRICT,
  item_id TEXT NOT NULL,
  item_version TEXT,
  response_value JSONB,
  response_type TEXT,
  response_timestamp TIMESTAMPTZ,
  response_duration_ms INTEGER
    CHECK (response_duration_ms IS NULL OR response_duration_ms >= 0),
  presentation_order INTEGER
    CHECK (presentation_order IS NULL OR presentation_order >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (assessment_result_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_result
  ON assessment_responses (assessment_result_id, presentation_order);

CREATE TABLE IF NOT EXISTS assessment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE RESTRICT,
  construct TEXT NOT NULL,
  subscale TEXT,
  raw_score JSONB,
  transformed_score JSONB,
  display_score JSONB,
  scoring_version TEXT,
  interpretation_status TEXT,
  normative_reference JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (assessment_result_id, construct, subscale)
);

CREATE INDEX IF NOT EXISTS idx_assessment_scores_result
  ON assessment_scores (assessment_result_id);

CREATE INDEX IF NOT EXISTS idx_assessment_scores_construct
  ON assessment_scores (construct, subscale);

CREATE TABLE IF NOT EXISTS assessment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE RESTRICT,
  report_version TEXT NOT NULL,
  report_type TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (
    audience IN (
      'student',
      'parent_guardian',
      'institution',
      'teacher',
      'counsellor_coach',
      'administrator'
    )
  ),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_hash TEXT,
  generation_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (assessment_result_id, report_version, audience)
);

CREATE INDEX IF NOT EXISTS idx_assessment_reports_result
  ON assessment_reports (assessment_result_id, generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_reports_audience
  ON assessment_reports (audience, generated_at DESC);

CREATE TABLE IF NOT EXISTS assessment_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE RESTRICT,
  sequence BIGINT NOT NULL,
  action TEXT NOT NULL,
  actor_person_id TEXT,
  actor_account_id TEXT,
  purpose TEXT,
  outcome TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (assessment_result_id, sequence)
);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_result_time
  ON assessment_audit_events (assessment_result_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_actor_time
  ON assessment_audit_events (actor_person_id, occurred_at DESC)
  WHERE actor_person_id IS NOT NULL;

CREATE OR REPLACE FUNCTION reject_final_assessment_child_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  parent_status TEXT;
BEGIN
  SELECT status INTO parent_status
  FROM assessment_results
  WHERE id = COALESCE(NEW.assessment_result_id, OLD.assessment_result_id);

  IF parent_status IN ('submitted', 'scored', 'reported', 'invalidated', 'superseded') THEN
    RAISE EXCEPTION
      'Assessment child records are immutable after final submission: %',
      parent_status;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_assessment_responses_immutable ON assessment_responses;
CREATE TRIGGER trg_assessment_responses_immutable
BEFORE UPDATE OR DELETE ON assessment_responses
FOR EACH ROW EXECUTE FUNCTION reject_final_assessment_child_mutation();

DROP TRIGGER IF EXISTS trg_assessment_scores_immutable ON assessment_scores;
CREATE TRIGGER trg_assessment_scores_immutable
BEFORE UPDATE OR DELETE ON assessment_scores
FOR EACH ROW EXECUTE FUNCTION reject_final_assessment_child_mutation();

-- Audit rows are append-only.
CREATE OR REPLACE FUNCTION reject_assessment_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Assessment audit events are append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_assessment_audit_no_update ON assessment_audit_events;
CREATE TRIGGER trg_assessment_audit_no_update
BEFORE UPDATE OR DELETE ON assessment_audit_events
FOR EACH ROW EXECUTE FUNCTION reject_assessment_audit_mutation();

COMMIT;
