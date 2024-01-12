# Locals

locals {
  region  = "europe-west9"
  project = "salathiel-genese-name"
}

# Variables

variable "google-cloud-platform-credentials" { default = "" }
variable "google-cloud-platform-github-connection-secret-name" { default = "" }
variable "google-cloud-platform-github-connection-app-install-id" { default = "" }
