# Secret Sharz — Non-production First AWS Apply Checklist

This checklist is the handoff from repository preparation to the first real AWS non-production deployment in Sydney (ap-southeast-2).

## 1. Bootstrap outside workload Terraform

Create and verify the non-production Terraform state bucket:

- S3 Block Public Access enabled
- versioning enabled
- default encryption enabled
- TLS-only access policy
- Terraform deployment role can access only this state bucket/key
- S3 lockfile support verified

The repository now declares an empty S3 backend. Validation deliberately continues with terraform init -backend=false.

Initialize the workload state only after the bucket and role exist:

    terraform -chdir=infra/terraform/environments/nonprod init \
      -backend-config="bucket=<NONPROD_STATE_BUCKET>" \
      -backend-config="key=secretsharz/nonprod/terraform.tfstate" \
      -backend-config="region=ap-southeast-2"

Then verify the state object and lockfile behavior before any apply.

## 2. Verify the AWS bootstrap

After the CloudFormation bootstrap stack is deployed and the GitHub `nonprod` Environment contains `AWS_ROLE_ARN` and `TERRAFORM_STATE_BUCKET`, run:

    .github/workflows/nonprod-bootstrap-preflight.yml

The preflight verifies:

- the bootstrap CloudFormation stack is complete
- the Terraform state bucket has versioning, encryption and S3 Block Public Access
- the GitHub Actions OIDC role exists
- the role trusts only `antoniovn96/secretsharz` on `rebuild/platform-foundation-v1`
- no workload Terraform or database mutation occurs

Do not proceed to the first workload Terraform plan until this preflight passes.

## 4. GitHub OIDC role

The GitHub deployment role must trust the repository workflow identity and be restricted to the intended repository/ref/environment.

The role used for Terraform needs the infrastructure permissions required by the non-production stack and the state bucket access.

The role used by the manual migration workflow additionally needs, at minimum:

- ecs:DescribeTaskDefinition
- ecs:RunTask
- ecs:DescribeTasks
- iam:PassRole for the ECS task execution role

Do not grant wildcard IAM administration merely to make the workflow pass.

## 3. First Terraform apply

Use the non-production environment only.

The intended initial infrastructure includes:

- VPC and two Availability Zones
- public and private subnets
- one NAT gateway
- application security group
- private RDS PostgreSQL 16
- ECR repository
- Secrets Manager-managed RDS master credentials

Keep these runtime flags disabled on the first infrastructure-only apply:

    ecs_enabled = false
    assessment_migration_runner_enabled = false

This allows the network, database and registry foundation to exist before introducing application tasks.

## 5. Publish the first immutable image

Run the manual container publish workflow for nonprod.

The image tag is the Git commit SHA.

The workflow must report the AWS identity, ECR repository and immutable image URI.

Do not use latest as the deployment identifier.

## 6. Enable the migration runner

After the image exists, configure the non-production environment with:

    assessment_migration_runner_enabled = true
    assessment_migration_runner_image_uri = <IMMUTABLE_ECR_IMAGE_URI>

The environment automatically wires the RDS-managed username/password secret into the migration task.

The runner uses DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_SSL=true and DATABASE_SSL_REJECT_UNAUTHORIZED=true.

## 7. Run migrations

Populate the GitHub nonprod Environment variables used by the manual migration workflow:

- MIGRATION_CLUSTER_NAME
- MIGRATION_TASK_DEFINITION
- MIGRATION_SUBNET_IDS
- MIGRATION_SECURITY_GROUP_ID
- MIGRATION_CONTAINER_NAME

These should come from Terraform outputs and the deployed network resources.

Then manually run .github/workflows/nonprod-db-migrate.yml.

The expected sequence is:

    Fargate task
      -> run-postgres-migrations.mjs
      -> verify-assessment-schema.mjs
      -> exit 0

## 8. Application runtime

Only after the migration succeeds should the application runtime be enabled:

    ecs_enabled = true
    ecs_image_uri = <IMMUTABLE_ECR_IMAGE_URI>

The application task uses the same RDS-managed credentials and TLS settings.

## 9. Real RIASEC verification

The first real end-to-end test is not complete until all of these have been demonstrated against the AWS RDS database:

1. authenticated student reaches the RIASEC assessment
2. assessment submission is accepted
3. server-authoritative scoring occurs
4. canonical assessment result is persisted
5. responses and scores are persisted
6. audit events are persisted
7. latest-result retrieval works
8. database schema verification passes
9. the student can subsequently see the persisted result

This is the point at which the earlier CI/fake-database verification becomes a real AWS integration result.

## 10. Production remains untouched

Do not enable the production ECS runtime or migration runner during this first exercise.

Production needs its own state bucket, OIDC role, AWS account/region verification, secrets verification, RDS apply, container publication, migration execution, HTTPS edge and application smoke testing.

Only after those are separately verified should production traffic be considered for the new runtime.
