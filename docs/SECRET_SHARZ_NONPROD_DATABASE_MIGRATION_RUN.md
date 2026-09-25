# Secret Sharz — Non-production PostgreSQL Migration Run

The application migration now has a network-native execution path for the private RDS database.

## Why ECS is used

The non-production RDS instance is private. A GitHub-hosted runner cannot directly connect to that private database.

The repository therefore contains an optional ECS/Fargate migration runner:

```
GitHub Actions
    ↓ OIDC
AWS ECS Fargate task
    ↓ private subnet
RDS PostgreSQL
```

The migration task receives its server-only values from AWS Secrets Manager through the ECS task execution role.

## Infrastructure

Enable the runner only after the ECR image and Secrets Manager values exist:

```hcl
assessment_migration_runner_enabled = true
```

Set:

```hcl
assessment_migration_runner_image_uri
assessment_migration_runner_secret_arns
assessment_migration_runner_secret_environment_variables
```

The task definition defaults to:

```
node scripts/run-postgres-migrations.mjs
```

The GitHub workflow explicitly invokes the same command with `--verify` after starting the task.

## GitHub Environment variables

The `nonprod` GitHub Environment needs:

```
MIGRATION_CLUSTER_NAME
MIGRATION_TASK_DEFINITION
MIGRATION_SUBNET_IDS
MIGRATION_SECURITY_GROUP_ID
MIGRATION_CONTAINER_NAME
```

These values should come from the Terraform outputs and actual AWS resource IDs. They are configuration, not secrets.

The environment also needs the existing:

```
AWS_ROLE_ARN
```

secret for GitHub OIDC.

## Workflow

Run:

```
.github/workflows/nonprod-db-migrate.yml
```

The workflow:

1. assumes the non-production AWS OIDC role
2. validates the ECS task definition
3. starts one Fargate migration task in private subnets
4. waits for the task to stop
5. fails unless the migration container exits with code 0

The task is one-off. There is no always-running migration service.

## Safety

This workflow does not run automatically on every push.

Do not run it against production resources. Production gets a separately controlled migration process after the production account, state backend, secrets and deployment role are verified.
