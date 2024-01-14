# Locals

locals {
  module-prod = "prod"
  region      = "europe-west1"
  project     = "salathiel-genese-name"
}

# Variables

variable "google-cloud-platform-credentials" {
  sensitive = true
  default   = ""
  type      = string
}
variable "google-cloud-platform-github-connection-username" {
  sensitive = true
  default   = ""
  type      = string
}
variable "google-cloud-platform-github-connection-secret-name" {
  sensitive = true
  default   = ""
  type      = string
}
variable "google-cloud-platform-github-connection-app-installation-id" {
  sensitive = true
  default   = -1
  type      = number
}
