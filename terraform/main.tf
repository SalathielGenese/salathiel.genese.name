data "google_project" "this" {}

import {
  id = "projects/${data.google_project.this.number}/secrets/${var.google-cloud-platform-github-connection-secret-name}"
  to = google_secret_manager_secret.github-connection
}
resource "google_secret_manager_secret" "github-connection" {
  #  secret_id = var.google-cloud-platform-github-connection-secret-name
  secret_id = ""
  replication {
    auto {}
  }
}
#data "google_secret_manager_secret" "github-connection" {
#  secret_id = var.google-cloud-platform-github-connection-secret-name
#}
import {
  id = "projects/${data.google_project.this.number}/secrets/${var.google-cloud-platform-github-connection-secret-name}/versions/lates"
  to = google_secret_manager_secret_version.github-connection
}
resource "google_secret_manager_secret_version" "github-connection" {
  secret      = google_secret_manager_secret.github-connection.id
  secret_data = ""
}

#data "google_secret_manager_secret_version" "github-connection" {
#  secret = data.google_secret_manager_secret.github-connection.id
#}

import {
  #  id = "projects/${local.project}/locations/${local.region}/connections/${local.project}"
  id = "projects/${local.project}/locations/${local.region}/connections/${local.project}"
  to = google_cloudbuildv2_connection.github-connection
}
resource "google_cloudbuildv2_connection" "github-connection" {
  #  name = local.project
  #  location = local.region
  #
  #  github_config {
  #    app_installation_id = var.google-cloud-platform-github-connection-app-install-id
  #    authorizer_credential {
  #      oauth_token_secret_version = data.google_secret_manager_secret_version.github-connection.id
  #    }
  #  }
  location = ""
  name     = ""
}
