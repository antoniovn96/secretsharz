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
