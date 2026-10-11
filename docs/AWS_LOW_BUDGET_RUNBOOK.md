# Secret Sharz — Non-Production AWS Cost Reduction Runbook

## Why this change is needed

The October 1–11 cost export showed an estimated bill of **US$77.26** and **US$41.09 of NAT Gateway charges** for approximately 232 hours, including about 464.447 GB processed. At the same rate, NAT alone could exceed $120 in a full month. The $4.60 regional data-transfer line is also close to 464 GB at $0.01/GB, so cross-AZ traffic through the one shared NAT gateway is a plausible contributor; confirm this against AWS metrics before making the final removal.

The monthly target is **US$100 maximum, including variable usage and tax**. This is a target, not a guaranteed ceiling.


## Deploy the approved homepage to AWS non-production

This deploy path is prepared in the non-production Terraform plan/apply workflows. It is not executed by this PR.

1. Review the separate homepage preview and merge its draft PR to `rebuild/platform-foundation-v1` only after approving it. Do not merge into `main`.
2. From GitHub Actions, run **Secret Sharz Container Publish** against `rebuild/platform-foundation-v1`, selecting environment `nonprod`. It builds and pushes an immutable SHA-tagged image to ECR; it does **not** update ECS.
3. Copy the immutable ECR URI from that workflow's summary.
4. Run **Secret Sharz Nonprod Terraform Plan** with that exact `ecs_image_uri`. The workflow verifies the ECR account, repository and SHA tag before planning. Review the plan and do not proceed if it shows database replacement or unexpected deletion.
5. Only after reviewing the plan, run **Secret Sharz Nonprod Terraform Apply** with the same image URI and enter `APPLY_NONPROD`. This is the explicit apply gate. Stage 1 leaves NAT enabled.
6. Check ECS service/ALB target health, `/healthz`, login, and database connectivity before planning Stage 2.

Both Terraform workflows default to the current known image only for backwards-compatible planning; explicitly provide the newly published URI to deploy the homepage commit. Never select the `production` environment for this rollout.

## Stage 1 — Move non-production ECS outbound traffic off NAT (this change)

- Keep the NAT Gateway enabled while validating.
- Keep RDS PostgreSQL in private subnets.
- Place only the non-production ECS application tasks in the existing public subnets and give the Fargate task ENI a public IP for outbound access.
- Keep the application security group restricted: application port 3000 accepts inbound traffic only from the ALB security group, never from `0.0.0.0/0`.
- Move one-off non-production maintenance/migration tasks to public subnets too, so they can still pull ECR images and reach CloudWatch Logs and Secrets Manager without NAT.
- Production keeps private task placement by default; its Terraform environment does not set the new task placement variables.

**Do not remove NAT in Stage 1.** The purpose is to establish and validate the alternate egress path with a rollback option.

## Stage 1 verification

1. Run the non-production Terraform plan workflow and inspect all resource changes before applying.
2. Apply only after the plan shows the expected ECS network configuration update and no unintended database replacement.
3. Verify the ECS service reaches the desired running count and the ALB target group is healthy.
4. Test `/healthz`, one authenticated test flow, and a database connection.
5. Run `scripts/aws-budget-audit.ps1` and inspect NAT Gateway CloudWatch byte metrics / VPC flow logs if enabled. Confirm the app and one-off jobs no longer rely on the NAT path.

## Stage 2 — Remove NAT (separate follow-up change)

Only after Stage 1 is live and verified, set `enable_nat = false` in the non-production environment and run a new Terraform plan. The plan should remove the NAT Gateway and its Elastic IP and remove the NAT default routes from private route tables. RDS stays private and does not require outbound internet access.

**Do not apply Stage 2** if any other private workload still needs general internet egress. If a private workload is discovered, migrate its egress path first or retain NAT until it has been addressed.

## Budget guard

Create an AWS monthly cost budget for **US$100**, plus alerts at **US$60 actual**, **US$80 actual**, **US$90 actual**, and **US$80 forecast**. AWS Budgets alerts are notifications, not a hard spending limit. Keep an eye on NAT Gateway bytes, regional data transfer, RDS, ALB, Fargate, public IPv4, and CloudWatch Logs after each change.

The companion `scripts/aws-budget-audit.ps1` is read-only. It prints the active account/region, NAT gateways and routes, VPC endpoints, ECS subnet and public-IP settings, RDS placement, ALB status, and Cost Explorer service/usage-type lines. It does not stop, delete, or modify resources.
