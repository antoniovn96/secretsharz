# Secret Sharz — GitHub Actions AWS/OIDC Container Publishing

The container publishing workflow is deliberately **manual**.

Workflow:

```
.github/workflows/container-publish.yml
```

It accepts `nonprod` or `production`, authenticates to AWS using GitHub OIDC, verifies the ECR repository, builds the application image with the environment's public Firebase configuration, and pushes an immutable commit-SHA tag. It does not push a mutable `latest` tag because the ECR repositories are configured as immutable.

The workflow does **not** deploy ECS and does **not** apply Terraform.

## GitHub Environment configuration

Create two GitHub Environments:

- `nonprod`
- `production`

Each environment needs the secret:

```
AWS_ROLE_ARN
```

Each environment also needs these non-secret Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

The public Firebase configuration is deliberately stored as GitHub Environment **Variables**, not server-side runtime secrets.

## AWS OIDC trust

The IAM role referenced by `AWS_ROLE_ARN` must trust the GitHub Actions OIDC provider and restrict the subject claim to this repository and the intended GitHub Environment.

GitHub's current OIDC documentation requires the workflow to grant `id-token: write`; the AWS credentials action then exchanges the workflow OIDC token for short-lived AWS credentials. urlGitHub OIDC with AWShttps://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws

The current `aws-actions/configure-aws-credentials` release is `v6.3.0`, which is pinned in the workflow. urlAWS configure-aws-credentialshttps://github.com/aws-actions/configure-aws-credentials/releases/tag/v6.3.0

The role should grant only the actions required for its environment. The image-publishing workflow needs ECR push access; it does not need PostgreSQL data access.

## Important separation

Container publication is separate from infrastructure application.

The current Terraform environments intentionally still have ECS disabled by default. Publishing an image therefore does not start application workloads.

Terraform state also remains a separate prerequisite before introducing an automated `terraform apply` workflow.
