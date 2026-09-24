# Secret Sharz Terraform Foundation

This directory is the infrastructure-as-code foundation for the Secret Sharz AWS rebuild.

## Rules

- Do not run `terraform apply` against production from a developer laptop.
- Production state must live in an encrypted, versioned S3 backend with S3 state locking.
- GitHub Actions should authenticate to AWS through GitHub OIDC and short-lived role credentials.
- Do not store AWS access keys, secret keys, passwords, MFA codes, or other credentials in the repository.
- Keep management-account resources separate from workload resources.
- Primary production workload region: `ap-south-1` (Mumbai).
- Existing SecretSharz project/non-production workload may remain in its assigned `ap-southeast-2` (Sydney) region.
- Production account creation is blocked until the AWS Organizations account quota increase is approved.

## Environment layout

```text
infra/terraform/
  environments/
    nonprod/
    production/
  modules/
  bootstrap/
```

## State

The long-term backend will use Amazon S3. HashiCorp's current S3 backend supports state locking with `use_lockfile = true`; DynamoDB-based locking is deprecated. State buckets should have versioning enabled for recovery. See the official Terraform S3 backend documentation before bootstrap. 

Remote-state configuration is intentionally not active yet because the backend bucket and cross-account Terraform roles have not been provisioned.

## Deployment path

```text
GitHub
  -> GitHub Actions
  -> OIDC
  -> Terraform deployment role
  -> AWS account
```

The GitHub repository trust policy must restrict the `sub` claim to this repository and the intended branch/environment before production credentials are exposed to a workflow.

## Current status

- AWS account bootstrap: in progress
- Production member account: pending organization quota approval
- Terraform resources: not provisioned
- Remote state: not provisioned
- CI/CD AWS OIDC role: not provisioned
- Application infrastructure: not provisioned

This scaffold is intentionally safe to review without changing AWS resources.
