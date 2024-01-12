data "google_project" "this" {}

data "google_secret_manager_secret" "github-connection" {
  secret_id = var.google-cloud-platform-github-connection-secret-name
}

data "google_secret_manager_secret_version" "github-connection" {
  secret = data.google_secret_manager_secret.github-connection.id
}

import {
  id = "projects/${data.google_project.this.number}/locations/${local.region}/connections/${nonsensitive(var.google-cloud-platform-github-connection-username)}"
  to = google_cloudbuildv2_connection.github-connection
}
resource "google_cloudbuildv2_connection" "github-connection" {
  location = local.region
  name     = var.google-cloud-platform-github-connection-username
  github_config {
    app_installation_id = var.google-cloud-platform-github-connection-app-installation-id
    authorizer_credential {
      oauth_token_secret_version = data.google_secret_manager_secret_version.github-connection.id
    }
  }
}

resource "google_cloudbuildv2_repository" "web" {
  name              = "${local.project}-web"
  project           = data.google_project.this.number
  parent_connection = google_cloudbuildv2_connection.github-connection.id
  remote_uri        = "https://github.com/SalathielGenese/salathiel.genese.name.git"
}

resource "google_cloudbuild_trigger" "web" {
  location = local.region
  name = "${local.project}-web-prod"
  repository_event_config {
    repository = google_cloudbuildv2_repository.web.id
    push {
      branch = "main"
    }
  }

  build {
    step {
      # Noops
      name   = "ubuntu"
      script = "echo no-op"
    }
  }
}
