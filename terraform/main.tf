data "google_project" "this" {}

data "google_secret_manager_secret" "github-connection" {
  secret_id = var.google-cloud-platform-github-connection-secret-name
}

data "google_secret_manager_secret_version" "github-connection" {
  secret = data.google_secret_manager_secret.github-connection.id
}

import {
  id = "projects/${data.google_project.this.number}/locations/${local.region}/connections/${local.project}"
  to = google_cloudbuildv2_connection.github-connection
}
resource "google_cloudbuildv2_connection" "github-connection" {
  location = local.region
  name     = local.project
}
