variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "application_security_group_id" {
  type = string
}

variable "engine_version" {
  type    = string
  default = "16"
}

variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "allocated_storage" {
  type    = number
  default = 20
}

variable "max_allocated_storage" {
  type    = number
  default = 100
}

variable "multi_az" {
  type    = bool
  default = false
}

variable "backup_retention_period" {
  type    = number
  default = 3
}

variable "deletion_protection" {
  type    = bool
  default = false
}

variable "skip_final_snapshot" {
  type    = bool
  default = true
}

variable "apply_immediately" {
  type    = bool
  default = true
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.name}-db-subnets"
  }
}

resource "aws_security_group" "database" {
  name        = "${var.name}-database"
  description = "PostgreSQL access restricted to Secret Sharz application workloads."
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from application workloads."
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.application_security_group_id]
  }

  egress {
    description = "Database outbound traffic."
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-database"
  }
}

resource "aws_db_instance" "this" {
  identifier = var.name

  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  db_name  = "secretsharz"
  username = "secretsharz_app"
  port     = 5432

  manage_master_user_password = true

  allocated_storage       = var.allocated_storage
  max_allocated_storage   = var.max_allocated_storage
  storage_type            = "gp3"
  storage_encrypted       = true
  backup_retention_period = var.backup_retention_period

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.database.id]
  publicly_accessible    = false

  multi_az                    = var.multi_az
  deletion_protection         = var.deletion_protection
  skip_final_snapshot        = var.skip_final_snapshot
  copy_tags_to_snapshot      = true
  auto_minor_version_upgrade = true
  apply_immediately          = var.apply_immediately

  backup_window      = "18:00-18:30"
  maintenance_window = "sun:19:00-sun:19:30"

  tags = {
    Name = var.name
  }
}

output "db_instance_id" {
  value = aws_db_instance.this.id
}

output "db_endpoint" {
  value = aws_db_instance.this.address
}

output "db_port" {
  value = aws_db_instance.this.port
}

output "master_user_secret_arn" {
  value     = try(aws_db_instance.this.master_user_secret[0].secret_arn, null)
  sensitive = true
}
