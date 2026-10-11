import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ROOT = process.cwd();

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('Terraform environments declare S3 remote state with native lockfile', () => {
  for (const environment of ['nonprod', 'production']) {
    const source = read(`infra/terraform/environments/${environment}/main.tf`);
    assert.match(source, /backend\s+"s3"\s*\{[\s\S]*?use_lockfile\s*=\s*true[\s\S]*?\}/);
  }
});

test('nonprod apply workflow requires explicit confirmation and uses the same plan for apply', () => {
  const source = read('.github/workflows/nonprod-terraform-apply.yml');
  assert.match(source, /APPLY_NONPROD/);
  assert.match(source, /terraform plan[\s\S]*?-out=nonprod\.tfplan/);
  assert.match(source, /terraform apply[\s\S]*?nonprod\.tfplan/);
  assert.match(source, /environment:\s*nonprod/);
  assert.match(source, /role-to-assume:\s*\$\{\{ secrets\.AWS_ROLE_ARN \}\}/);
});

test('ECS runtime receives verified TLS and RDS connection components', () => {
  const source = read('infra/terraform/environments/nonprod/main.tf');
  for (const token of [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_SSL',
    'DATABASE_SSL_REJECT_UNAUTHORIZED',
    'module.postgres.master_user_secret_arn',
  ]) {
    assert.match(source, new RegExp(token.replace(/[.*+?^$()|[\]\\]/g, '\\$&')));
  }
});

test('migration runner has database environment-variable inputs', () => {
  const variables = read('infra/terraform/modules/assessment-migration-runner/variables.tf');
  const main = read('infra/terraform/modules/assessment-migration-runner/main.tf');

  assert.match(variables, /variable "environment_variables"/);
  assert.match(main, /var\.environment_variables/);
  assert.match(main, /DATABASE_SSL/);
});


test('nonprod Fargate tasks can use public egress while PostgreSQL remains private', () => {
  const nonprod = read('infra/terraform/environments/nonprod/main.tf');
  const runtime = read('infra/terraform/modules/application-runtime/main.tf');
  const variables = read('infra/terraform/modules/application-runtime/variables.tf');

  assert.match(nonprod, /subnet_ids\s*=\s*module\.network\.private_subnet_ids/);
  assert.match(nonprod, /task_subnet_ids\s*=\s*module\.network\.public_subnet_ids/);
  assert.match(nonprod, /task_assign_public_ip\s*=\s*true/);
  assert.match(runtime, /subnets\s*=\s*length\(var\.task_subnet_ids\)\s*>\s*0\s*\?\s*var\.task_subnet_ids\s*:\s*var\.private_subnet_ids/);
  assert.match(runtime, /assign_public_ip\s*=\s*var\.task_assign_public_ip/);
  assert.match(variables, /variable "task_assign_public_ip"[\s\S]*?default\s*=\s*false/);
});

test('nonprod one-off ECS maintenance tasks use public egress without opening app ports to the internet', () => {
  const workflows = [
    '.github/workflows/nonprod-platform-verification.yml',
    '.github/workflows/nonprod-db-connectivity-diagnostic.yml',
    '.github/workflows/nonprod-db-migration-apply-bootstrap.yml',
    '.github/workflows/nonprod-db-migrate.yml',
    '.github/workflows/nonprod-schema-verify-bootstrap.yml',
  ];

  for (const path of workflows) {
    const source = read(path);
    assert.match(source, /assignPublicIp=ENABLED/, `${path} should give a public-subnet maintenance task outbound access`);
    assert.doesNotMatch(source, /assignPublicIp=DISABLED/, `${path} should not rely on NAT for its task`);
  }
});
