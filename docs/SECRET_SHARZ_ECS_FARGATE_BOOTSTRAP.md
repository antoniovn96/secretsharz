# Secret Sharz — ECS/Fargate Runtime Bootstrap

**Status:** Terraform runtime foundation added; service intentionally disabled until the first container image and runtime secrets exist.

## Components

The reusable `application-runtime` module provides:

- ECS/Fargate cluster
- task execution role
- optional Secrets Manager read permission
- CloudWatch log group
- internet-facing Application Load Balancer
- HTTP listener
- IP target group
- container health check using `/healthz`
- ECS service on private subnets
- deployment circuit breaker with rollback

## First image

The ECR repositories are created by the environment Terraform modules.

The Docker image must be built with the real public Firebase configuration because Next.js public environment variables are embedded into the client bundle during build.

Example build arguments:

```bash
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="..." \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..." \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="..." \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..." \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..." \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="..." \
  -t secretsharz:bootstrap .
```

Do not pass server-only secrets such as `FIREBASE_SERVICE_ACCOUNT` or `DATABASE_URL` as Docker build arguments.

## Runtime secrets

When ECS is enabled, server-only values should come from AWS Secrets Manager through the task definition.

The initial runtime secret set is expected to include:

- `DATABASE_URL`
- `FIREBASE_SERVICE_ACCOUNT`
- any remaining server-side external API credentials required by the existing application

The ECS task execution role reads only the explicitly supplied secret ARNs.

## Enabling ECS

The environment variables intentionally default to disabled:

```hcl
ecs_enabled = false
ecs_image_uri = ""
```

Enable the service only after:

1. ECR contains a tested immutable image.
2. Runtime Secrets Manager values exist.
3. The image has passed application smoke tests.
4. The non-production RDS migrations are complete.
5. The ALB health endpoint responds with HTTP 200.

## Public edge

The first runtime module exposes HTTP through the ALB.

CloudFront/WAF and HTTPS certificate management remain a separate edge layer. They should be introduced before production public traffic is cut over.

## Production protection

The production ECS service should remain disabled until:

- production AWS account is available
- RDS is provisioned
- secrets are present
- HTTPS edge is ready
- application migration/read-path validation is complete


## PostgreSQL connection wiring

The RDS module uses the AWS-managed master-user secret rather than creating a second database password secret in application Terraform.

For ECS, the runtime receives:

- `DATABASE_HOST` from the RDS endpoint
- `DATABASE_PORT=5432`
- `DATABASE_NAME=secretsharz`
- `DATABASE_USER` from the RDS secret `username` JSON key
- `DATABASE_PASSWORD` from the RDS secret `password` JSON key
- `DATABASE_SSL=true`
- `DATABASE_SSL_REJECT_UNAUTHORIZED=true`

The application PostgreSQL boundary accepts either the existing `DATABASE_URL` form or these discrete ECS variables. The migration runner uses the same contract.

This keeps the database credential in Secrets Manager and avoids placing the password in Docker build arguments or a Terraform-generated connection-string secret.
