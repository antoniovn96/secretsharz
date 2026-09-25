variable "name" {
  type = string
}

variable "enabled" {
  type = bool
  default = false
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "application_security_group_id" {
  type = string
}

variable "image_uri" {
  type = string
  default = ""
}

variable "cpu" {
  type = number
  default = 512
}

variable "memory" {
  type = number
  default = 1024
}

variable "secret_arns" {
  type = list(string)
  default = []
}

variable "secret_environment_variables" {
  type = list(object({)
    name       = string
    value_from = string
  }))
  default = []
}

variable "command" {
  type = list(string)
  default = ["node", "scripts/run-postgres-migrations.mjs"]
}

variable "log_retention_in_days" {
  type = number
  default = 30
}
