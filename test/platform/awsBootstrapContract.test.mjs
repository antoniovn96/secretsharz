import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  'infra/aws-bootstrap/nonprod-github-oidc-state.yml',
  'utf8',
);

test('nonprod AWS bootstrap has the expected state protections', () => {
  assert.match(source, /DeletionPolicy: Retain/);
  assert.match(source, /UpdateReplacePolicy: Retain/);
  assert.match(source, /BlockPublicAcls: true/);
  assert.match(source, /BlockPublicPolicy: true/);
  assert.match(source, /IgnorePublicAcls: true/);
  assert.match(source, /RestrictPublicBuckets: true/);
  assert.match(source, /VersioningConfiguration:/);
  assert.match(source, /Status: Enabled/);
  assert.match(source, /aws:SecureTransport: "false"/);
});

test('nonprod AWS bootstrap restricts GitHub OIDC trust to the rebuild branch', () => {
  assert.match(
    source,
    /Condition:\s*\n\s+StringEquals:\s*\n\s+token\.actions\.githubusercontent\.com:aud: sts\.amazonaws\.com\s*\n\s+token\.actions\.githubusercontent\.com:sub: repo:antoniovn96\/secretsharz:ref:refs\/heads\/rebuild\/platform-foundation-v1/,
  );
  assert.match(
    source,
    /token\.actions\.githubusercontent\.com:sub: repo:antoniovn96\/secretsharz:ref:refs\/heads\/rebuild\/platform-foundation-v1/,
  );
  assert.match(source, /StringEquals:/);
  assert.doesNotMatch(source, /AdministratorAccess/);
  assert.doesNotMatch(source, /PowerUserAccess/);
});

test('nonprod AWS bootstrap scopes Terraform state and lock-file access', () => {
  assert.match(source, /secretsharz\/nonprod\/terraform\.tfstate/);
  assert.match(source, /secretsharz\/nonprod\/terraform\.tfstate\.tflock/);
  assert.match(source, /s3:GetBucketLocation/);
  assert.match(source, /s3:DeleteObject/);
  assert.match(source, /s3:ListBucket/);
  assert.match(source, /iam:CreatePolicyVersion/);
  assert.match(source, /iam:DeletePolicyVersion/);
  assert.match(source, /secretsharz-nonprod-\*/);
  assert.match(source, /ec2:ModifyVpcAttribute/);
  assert.match(source, /ecr:PutLifecyclePolicy/);
  assert.match(source, /ecr:DeleteLifecyclePolicy/);
});


test("nonprod bootstrap preflight validates the deployed trust boundary", () => {
  const workflow = fs.readFileSync(".github/workflows/nonprod-bootstrap-preflight.yml", "utf8");
  assert.match(workflow, /Secret Sharz Nonprod Bootstrap Preflight/);
  assert.match(workflow, /aws s3api get-bucket-versioning/);
  assert.match(workflow, /aws s3api get-public-access-block/);
  assert.match(workflow, /aws iam get-role/);
  assert.match(workflow, /SecretSharz-GitHubActions-NonProd/);
  assert.match(workflow, /rebuild\/platform-foundation-v1/);
  assert.doesNotMatch(workflow, /terraform apply/);
});
