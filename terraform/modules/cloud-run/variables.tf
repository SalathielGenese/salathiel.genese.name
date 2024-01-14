variable "project-number" { type = string }
variable "project-id" { type = string }
variable "region" { type = string }
variable "domain" { type = string }
variable "domain-www-subdomain" {
  type    = bool
  default = false
}
