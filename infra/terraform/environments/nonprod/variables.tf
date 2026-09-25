variable "aws_region" {
  description = "AWS Region for the existing SecretSharz non-production project account."
  type        = string
  default     = "ap-southeast-2"

  validation {
    condition     = var.aws_region == "ap-southeast-2"
    error_message = "The current SecretSharz non-production project is intentionally pinned to Sydney (ap-southeast-2)."
  }
}

variable "vpc_cidr" {
  description = "Private application database VPC CIDR."
  type        = string
  default     = "10.40.0.0/16"
}


variable "ecs_enabled" {
  description = "Enable the ECS/Fargate service only after the ECR image and runtime secrets are ready."
  type        = bool
  default     = false
}

variable "ecs_image_uri" {
  description = "Immutable container image URI for the Secret Sharz runtime."
  type        = string
  default     = ""
}

variable "ecs_secret_arns" {
  description = "Secrets Manager ARNs readable by the ECS task execution role."
  type        = list(string)
  default     = []
}

variable "ecs_secret_environment_variables" {
  description = "Environment variable to Secrets Manager mapping for ECS."
  type = list(object({
    name       = string
    value_from = string
  }))
  default = []
}

variable "assessment_migration_runner_enabled" {
  description = "Enable the one-off ECS task definition and cluster used to run database migrations."
  type        = bool
  default     = false
}

variable "assessment_migration_runner_image_uri" {
  description = "Immutable application image used by the migration runner."
  type        = string
  default     = ""
}

variable "assessment_migration_runner_secret_arns" {
  description = "Secrets Manager ARNs the migration task execution role may read."
  type        = list(string)
  default     = []
}

variable "assessment_migration_runner_secret_environment_variables" {
  description = "Secret environment variable mappings for the migration runner."
  type = list(object({
    name       = string
    value_from = string
  }))
  default = []
}
