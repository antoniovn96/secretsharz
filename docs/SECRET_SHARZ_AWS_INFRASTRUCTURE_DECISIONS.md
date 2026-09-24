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


## Approved implementation sequencing

### Application-first AWS migration

The first AWS runtime milestone will run the existing Next.js application on ECS/Fargate while Firebase remains a temporary migration dependency.

This preserves the existing application and allows infrastructure/runtime migration to proceed without forcing database, identity and UX migration into one destructive release.

### Production resilience baseline

For production sensitive workloads, the initial architecture will use:
- multi-AZ application placement;
- an RDS PostgreSQL production configuration with Multi-AZ resilience;
- encrypted automated backups;
- S3 object storage;
- CloudFront + WAF + ALB;
- ECS/Fargate.

The non-production Sydney environment remains intentionally lighter and cost-conscious.

### Public routing

VidyaVantage is part of Secret Sharz and will use:

secretsharz.com/vidyavantage

A separate public API hostname is not required for the first AWS application milestone. Same-origin application/API routes may be retained until an explicit architecture decision requires a separate API edge.

