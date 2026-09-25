terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0, < 7.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Application = "SecretSharz"
      Environment = "NonProduction"
      ManagedBy   = "Terraform"
    }
  }
}

locals {
  environment = "nonprod"
}

module "network" {
  source = "../../modules/application-network"

  name              = "secretsharz-nonprod"
  vpc_cidr          = var.vpc_cidr
  az_count          = 2
  nat_gateway_count = 1
  enable_nat        = true
}

module "postgres" {
  source = "../../modules/postgres-rds"

  name                          = "secretsharz-nonprod-postgres"
  vpc_id                        = module.network.vpc_id
  subnet_ids                    = module.network.private_subnet_ids
  application_security_group_id = module.network.application_security_group_id

  engine_version          = "16"
  instance_class          = "db.t4g.micro"
  allocated_storage       = 20
  max_allocated_storage   = 100
  multi_az                = false
  backup_retention_period = 3
  deletion_protection     = false
  skip_final_snapshot     = true
  apply_immediately       = true
}

output "postgres_endpoint" {
  value = module.postgres.db_endpoint
}

output "postgres_master_user_secret_arn" {
  value     = module.postgres.master_user_secret_arn
  sensitive = true
}

output "application_security_group_id" {
  value = module.network.application_security_group_id
}


module "container_registry" {
  source = "../../modules/container-registry"

  name = "secretsharz-nonprod"
}

output "container_registry_url" {
  value = module.container_registry.repository_url
}


module "application_runtime" {
  source = "../../modules/application-runtime"

  name                          = "secretsharz-nonprod"
  enabled                       = var.ecs_enabled
  vpc_id                        = module.network.vpc_id
  public_subnet_ids             = module.network.public_subnet_ids
  private_subnet_ids            = module.network.private_subnet_ids
  application_security_group_id = module.network.application_security_group_id
  image_uri                     = var.ecs_image_uri
  secret_arns                   = var.ecs_secret_arns
  secret_environment_variables  = var.ecs_secret_environment_variables
  environment_variables = [
    {
      name  = "NODE_ENV"
      value = "production"
    },
    {
      name  = "PORT"
      value = "3000"
    },
    {
      name  = "DATABASE_SSL"
      value = "true"
    },
    {
      name  = "DATABASE_SSL_REJECT_UNAUTHORIZED"
      value = "true"
    }
  ]
}

output "application_load_balancer_dns_name" {
  value = module.application_runtime.load_balancer_dns_name
}

module "assessment_migration_runner" {
  source = "../../modules/assessment-migration-runner"

  name                          = "secretsharz-nonprod-assessment-migrations"
  enabled                       = var.assessment_migration_runner_enabled
  vpc_id                        = module.network.vpc_id
  private_subnet_ids            = module.network.private_subnet_ids
  application_security_group_id = module.network.application_security_group_id
  image_uri                     = var.assessment_migration_runner_image_uri
  secret_arns                   = var.assessment_migration_runner_secret_arns
  secret_environment_variables  = var.assessment_migration_runner_secret_environment_variables
}

output "assessment_migration_runner_cluster_name" {
  value = module.assessment_migration_runner.cluster_name
}

output "assessment_migration_runner_task_definition_arn" {
  value = module.assessment_migration_runner.task_definition_arn
}
