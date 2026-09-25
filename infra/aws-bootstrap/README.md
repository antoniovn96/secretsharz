# Secret Sharz — AWS Non-production Bootstrap

This template bootstraps the pieces that must exist before workload Terraform can use the Sydney non-production AWS account.

It creates:
- a versioned, encrypted, public-access-blocked S3 Terraform state bucket
- a TLS-only state bucket policy
- a GitHub Actions IAM OIDC provider when the account does not already have one
- a GitHub Actions non-production role trusted only by the Secret Sharz rebuild branch
- the state and workload permissions required by the current non-production Terraform and migration workflows

## Region

Use:

    ap-southeast-2

The OIDC provider is global within the AWS account even though the CloudFormation stack is launched in Sydney.

## Before deployment

The AWS account administrator should verify whether this account already contains:

    https://token.actions.githubusercontent.com

The template supports both cases:

- CreateGitHubOidcProvider=true when the provider does not exist
- CreateGitHubOidcProvider=false and GitHubOidcProviderArn=<existing ARN> when it already exists

AWS can retrieve the OIDC provider thumbprint during provider creation when no thumbprint list is supplied.

## Deploy

From an AWS-authenticated administrator workstation:

    aws cloudformation deploy \
      --region ap-southeast-2 \
      --stack-name secretsharz-nonprod-bootstrap \
      --template-file infra/aws-bootstrap/nonprod-github-oidc-state.yml \
      --capabilities CAPABILITY_NAMED_IAM \
      --parameter-overrides CreateGitHubOidcProvider=true

When the provider already exists:

    aws cloudformation deploy \
      --region ap-southeast-2 \
      --stack-name secretsharz-nonprod-bootstrap \
      --template-file infra/aws-bootstrap/nonprod-github-oidc-state.yml \
      --capabilities CAPABILITY_NAMED_IAM \
      --parameter-overrides \
        CreateGitHubOidcProvider=false \
        GitHubOidcProviderArn=arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com

The state bucket defaults to:

    secretsharz-terraform-state-nonprod-<ACCOUNT_ID>

## Verify outputs

Run:

    aws cloudformation describe-stacks \
      --region ap-southeast-2 \
      --stack-name secretsharz-nonprod-bootstrap \
      --query 'Stacks[0].Outputs'

Copy the StateBucketName output into the GitHub nonprod Environment variable:

    TERRAFORM_STATE_BUCKET

Set the GitHub nonprod Environment secret:

    AWS_ROLE_ARN

using the stack's GitHubActionsRoleArn output.

## Security boundary

The role trust is restricted to:

    repo:antoniovn96/secretsharz:ref:refs/heads/rebuild/platform-foundation-v1

The template does not create long-lived AWS access keys.

The state bucket is retained if the bootstrap stack is deleted or replaced.

## Next

Once the stack exists and the GitHub Environment values are configured, run the manual Secret Sharz Nonprod Terraform Plan workflow.

Do not run the apply workflow until the plan has been reviewed.

The bootstrap template does not create RDS, ECS, ECR, VPC, or application resources. Those remain under workload Terraform.