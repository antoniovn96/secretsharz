# Secret Sharz — Non-Production PostgreSQL Bootstrap

**Status:** Terraform foundation implemented; AWS apply remains a controlled operator action.

## Target

The non-production Secret Sharz environment is configured for:

- AWS Sydney: `ap-southeast-2`
- private VPC
- two private subnets in separate Availability Zones
- application workload security group
- private PostgreSQL RDS instance
- encrypted GP3 storage
- RDS-managed master password in AWS Secrets Manager
- 3-day backup retention
- no public database access

RDS manages the master password in Secrets Manager rather than storing a password in Terraform configuration. AWS documents that when RDS manages the master password, it generates and manages the credential in Secrets Manager. citeturn106310search0

## Operator sequence

From:

`infra/terraform/environments/nonprod`

run:

```bash
terraform init -backend=false
terraform plan
terraform apply
```

The first apply creates the network and PostgreSQL foundation.

After apply, retrieve the Terraform output:

```bash
terraform output postgres_endpoint
terraform output -raw postgres_master_user_secret_arn
```

Then retrieve the RDS-managed secret using the AWS CLI:

```bash
aws secretsmanager get-secret-value \
  --secret-id "<MASTER_USER_SECRET_ARN>" \
  --region ap-southeast-2
```

The returned JSON contains the managed username/password and connection fields supplied by RDS.

## DATABASE_URL

Build the server-side `DATABASE_URL` from the RDS endpoint and secret values.

Do not:

- commit the password
- put the URL in `NEXT_PUBLIC_*`
- paste the password into GitHub issues or source files
- place credentials in Terraform variables
- expose the database endpoint to the browser

## Migration

After connectivity is available:

```bash
DATABASE_URL="postgresql://..." \
DATABASE_SSL=true \
npm run db:migrate

DATABASE_URL="postgresql://..." \
DATABASE_SSL=true \
npm run db:verify
```

Then run the assessment tests.

## Network constraint

The current non-production network intentionally creates private subnets only. This keeps the database non-public and avoids introducing a NAT gateway before the ECS application network is defined.

The later ECS/Fargate foundation will need its own controlled egress design for image pulls, Secrets Manager access and other outbound services.

## Safety

Do not point this process at production.

Production Terraform is defined separately and is intentionally not the first target while the dedicated production AWS account is still pending.
