# Secret Sharz — Legacy Assessment Reconciliation

The migration workflow now has two separate controls:

1. **Import:** Firebase → canonical PostgreSQL assessment result.
2. **Reconciliation:** current Firebase source hash → PostgreSQL migration registry.

The reconciliation command is read-only:

```bash
node scripts/reconcile-legacy-career-assessments.mjs --limit 1000
```

It reports:

- legacy assessment candidates
- imported source records
- source records without a migration registry entry
- unchanged source hashes
- source drift after migration
- users with multiple legacy assessment sources

A changed source hash is reported as **drift** rather than silently overwriting the historical PostgreSQL result.

This is important because historical assessment evidence is intended to be immutable. A later Firebase edit is a new migration/reconciliation event, not a reason to mutate the original result.

The reconciliation command should be run before and after every approved backfill batch.
