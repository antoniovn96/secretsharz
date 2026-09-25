variable "aws_region" {
  description = "Primary AWS Region for Secret Sharz production workloads."
  type        = string
  default     = "ap-south-1"

  validation {
    condition     = var.aws_region == "ap-south-1"
    error_message = "Secret Sharz production is intentionally pinned to Mumbai (ap-south-1)."
  }
}

variable "production_account_id" {
  description = "AWS account ID for SecretSharz-Production. Supplied only after the production member account is created."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = (
      var.production_account_id == null ||
      can(regex("^[0-9]{12}$", var.production_account_id))
    )
    error_message = "production_account_id must be a 12-digit AWS account ID when supplied."
  }
}

variable "vpc_cidr" {
  description = "Primary production VPC CIDR."
  type        = string
  default     = "10.50.0.0/16"
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
