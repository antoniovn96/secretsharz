# Secret Sharz AWS Infrastructure — Working Decisions

Status: implementation baseline; production account still pending quota approval.

## Regional strategy

### Production
Primary application/data region:
- AWS Mumbai: `ap-south-1`

### Non-production
The existing SecretSharz project account was created with:
- AWS Sydney: `ap-southeast-2`

We will use that account as the initial development/staging environment instead of trying to move the project itself.

## Account separation

The organization currently contains:
- Management account
- SecretSharz project account
- SecretSharz-Team Identity Delegated Admin account

A dedicated member account named `SecretSharz-Production` is intended for live workloads.

The organization account quota increase to the AWS default of 10 is currently with AWS Support. Production account creation therefore remains blocked until the quota is approved.

## State-management direction

Terraform state will be stored remotely in S3 with:
- encryption
- versioning
- S3 state locking via `use_lockfile = true`

DynamoDB state locking is not part of the new baseline.

## CI/CD identity direction

GitHub Actions will use AWS OIDC and short-lived credentials. No long-lived AWS access keys will be stored in GitHub.

The production role trust policy must restrict the GitHub OIDC `sub` claim to the Secret Sharz repository and approved deployment ref/environment.

## Important boundary

The AWS infrastructure layer is separate from the Secret Sharz application identity model:

`AWS workforce identity -> AWS permissions`

is not the same as:

`Secret Sharz Person -> Account -> Assurance -> Relationships -> Consent -> Authorisation`

The application must not use AWS administrative identities as Secret Sharz user identities.
