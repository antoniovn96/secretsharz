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
