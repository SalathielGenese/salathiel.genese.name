data "google_project" "this" {}

data "google_secret_manager_secret" "web" {
  secret_id = var.google-cloud-platform-github-connection-secret-name
}

data "google_secret_manager_secret_version" "web" {
  secret = data.google_secret_manager_secret.web.id
}

import {
  id = "projects/${data.google_project.this.number}/locations/${local.region}/connections/${nonsensitive(var.google-cloud-platform-github-connection-username)}"
  to = google_cloudbuildv2_connection.web
}
resource "google_cloudbuildv2_connection" "web" {
  location = local.region
  name     = var.google-cloud-platform-github-connection-username
  github_config {
    app_installation_id = var.google-cloud-platform-github-connection-app-installation-id
    authorizer_credential {
      oauth_token_secret_version = data.google_secret_manager_secret_version.web.id
    }
  }
}

resource "google_cloudbuildv2_repository" "web" {
  name              = "${local.project}-web"
  project           = data.google_project.this.number
  parent_connection = google_cloudbuildv2_connection.web.id
  remote_uri        = "https://github.com/SalathielGenese/salathiel.genese.name.git"
}

resource "google_artifact_registry_repository" "web" {
  format        = "DOCKER"
  repository_id = "${local.project}-web"
}

module "staging" {
  repository-id        = google_cloudbuildv2_repository.web.id
  source               = "./modules/cloud-build-cloud-run"
  project-number       = data.google_project.this.number
  domain               = "staging.salathiel.genese.name"
  project-id           = local.project
  region               = local.region
  branch               = "^staging$"
  module-name          = "staging"
  domain-www-subdomain = false
}

resource "google_dns_managed_zone" "web" {
  dns_name    = "salathiel.genese.name"
  name        = "${local.project}-web"
  description = "Root domain"
  dnssec_config {
    state = "on"
  }
}

module "prod" {
  repository-id        = google_cloudbuildv2_repository.web.id
  source               = "./modules/cloud-build-cloud-run"
  project-number       = data.google_project.this.number
  domain               = "salathiel.genese.name"
  project-id           = local.project
  region               = local.region
  branch               = "^main$"
  module-name          = "prod"
  domain-www-subdomain = true
}
