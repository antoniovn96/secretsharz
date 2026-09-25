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

## Current repository status

The Terraform environments still use local initialization with `-backend=false` in validation.

This is intentional. No automated infrastructure mutation should run until remote state and the OIDC deployment role are provisioned.
