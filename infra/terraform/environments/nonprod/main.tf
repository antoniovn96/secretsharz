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

  name     = "secretsharz-nonprod"
  vpc_cidr = var.vpc_cidr
  az_count = 2
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
