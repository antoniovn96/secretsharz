variable "name" {
  type = string
}

variable "enabled" {
  type    = bool
  default = false
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "task_subnet_ids" {
  description = "Optional explicit subnet list for Fargate tasks; defaults to private_subnet_ids."
  type        = list(string)
  default     = []
}

variable "task_assign_public_ip" {
  description = "Whether Fargate task ENIs receive public IPs. Disabled by default to preserve private production placement."
  type        = bool
  default     = false
}

variable "application_security_group_id" {
  type = string
}

variable "image_uri" {
  type    = string
  default = ""
}

variable "cpu" {
  type    = number
  default = 512
}

variable "memory" {
  type    = number
  default = 1024
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "health_check_path" {
  type    = string
  default = "/healthz"
}

variable "environment_variables" {
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "secret_environment_variables" {
  type = list(object({
    name       = string
    value_from = string
  }))
  default = []
}

variable "secret_arns" {
  type    = list(string)
  default = []
}
