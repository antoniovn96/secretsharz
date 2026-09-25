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
      Environment = "Production"
      ManagedBy   = "Terraform"
    }
  }
}

locals {
  environment = "production"
}

module "network" {
  source = "../../modules/application-network"

  name             = "secretsharz-production"
  vpc_cidr         = var.vpc_cidr
  az_count         = 3
  nat_gateway_count = 2
  enable_nat       = true
}

module "postgres" {
  source = "../../modules/postgres-rds"

  name                          = "secretsharz-production-postgres"
  vpc_id                        = module.network.vpc_id
  subnet_ids                    = module.network.private_subnet_ids
  application_security_group_id = module.network.application_security_group_id

  engine_version          = "16"
  instance_class          = "db.m6g.large"
  allocated_storage       = 100
  max_allocated_storage   = 1000
  multi_az                = true
  backup_retention_period = 7
  deletion_protection     = true
  skip_final_snapshot       = false
  final_snapshot_identifier = "secretsharz-production-postgres-final"
  apply_immediately          = false
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
