# Secret Sharz — Terraform Remote State Bootstrap

Terraform state is a deployment control plane and must not remain on ephemeral GitHub Actions runners.

The intended backend is Amazon S3 with bucket versioning and S3-native locking. The workload environments are not switched to the remote backend yet.

## Required state isolation

Use a dedicated state bucket for each AWS account/environment:

- non-production: Sydney account, ap-southeast-2
- production: Mumbai account, ap-south-1

Use globally unique bucket names and keep state buckets separate from application data.

## Bucket controls

Before state is used, the operator must enable:

- S3 Block Public Access
- versioning
- default encryption
- TLS-only access policy
- narrow access for the Terraform deployment role

## Backend configuration

The workload environment can use an empty S3 backend block in source:

```hcl
terraform {
  backend "s3" {
    use_lockfile = true
  }
}
```

The actual bucket, key, and region should be supplied during initialization through environment-specific backend configuration rather than committed as production credentials or account-specific secrets.

Example non-production key:

```
secretsharz/nonprod/terraform.tfstate
```

Example production key:

```
secretsharz/production/terraform.tfstate
```

## CI/CD gate

Do not introduce an automated Terraform apply workflow until:

1. the non-production state bucket exists
2. state locking is verified
3. the GitHub OIDC deployment role exists
4. the non-production backend has been initialized successfully
5. production has its own separately verified bucket and role

The deployment role should receive only the S3 state permissions and workload permissions required for its environment.

## Repository backend declaration

Both workload environments now declare the empty S3 backend in source:

```hcl
terraform {
  backend "s3" {
    use_lockfile = true
  }
}
```

Validation continues to use `terraform init -backend=false`, so CI does not require AWS credentials or remote-state access.

After the non-production state bucket and OIDC deployment role exist, initialize the non-production environment with backend configuration supplied outside source control:

```bash
terraform -chdir=infra/terraform/environments/nonprod init   -backend-config="bucket=<NONPROD_STATE_BUCKET>"   -backend-config="key=secretsharz/nonprod/terraform.tfstate"   -backend-config="region=ap-southeast-2"
```

Then verify the state object and lockfile behavior before any apply.

The production environment should use a different bucket and key:

```bash
terraform -chdir=infra/terraform/environments/production init   -backend-config="bucket=<PRODUCTION_STATE_BUCKET>"   -backend-config="key=secretsharz/production/terraform.tfstate"   -backend-config="region=ap-south-1"
```

## Current repository status

The repository has the remote backend declaration but CI still validates with `-backend=false`.

This is intentional. No automated infrastructure mutation should run until the non-production state bucket, locking, and OIDC deployment role are provisioned and verified.


## Minimum Terraform state-role permissions

For the S3 backend configured with `use_lockfile = true`, the deployment role needs access to the state object and its lock object.

For the non-production key `secretsharz/nonprod/terraform.tfstate`, scope the backend permissions to:

- `s3:ListBucket` on the state bucket, restricted to the non-production state prefix
- `s3:GetObject` and `s3:PutObject` on `secretsharz/nonprod/terraform.tfstate`
- `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject` on `secretsharz/nonprod/terraform.tfstate.tflock`

Terraform's current S3 backend uses `use_lockfile` for S3-native locking; DynamoDB-based locking is deprecated.

The application infrastructure role still needs its separate workload permissions; do not broaden the state policy to provide unrelated AWS access.
