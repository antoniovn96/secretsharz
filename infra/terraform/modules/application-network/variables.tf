variable "name" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "az_count" {
  type    = number
  default = 2

  validation {
    condition     = var.az_count >= 2 && var.az_count <= 6
    error_message = "az_count must be between 2 and 6."
  }
}

variable "nat_gateway_count" {
  type    = number
  default = 1

  validation {
    condition     = var.nat_gateway_count >= 1 && var.nat_gateway_count <= 6
    error_message = "nat_gateway_count must be between 1 and 6."
  }
}

variable "enable_nat" {
  type    = bool
  default = true
}
