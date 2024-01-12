data "google_project" "this" {}

data "google_secret_manager_secret" "github-connection" {
  secret_id = var.google-cloud-platform-github-connection-secret-name
}

data "google_secret_manager_secret_version" "github-connection" {
  secret = data.google_secret_manager_secret.github-connection.id
}

resource "google_cloudbuildv2_connection_iam_member" "cloudbuild-iam-secret_manager-secret_create" {
  member = "user:service-809847579306@gcp-sa-cloudbuild.iam.gserviceaccount.com"
  name   = "${local.project}-cloudbuild-iam-secret_manager"
  role   = "secretmanager.secrets.create"
}

resource "google_cloudbuildv2_connection_iam_member" "cloudbuild-iam-secret_manager-secret_setiampolicy" {
  member = "user:service-809847579306@gcp-sa-cloudbuild.iam.gserviceaccount.com"
  name   = "${local.project}-cloudbuild-iam-secret_manager"
  role   = "secretmanager.secrets.setIamPolicy"
}

import {
  id = "projects/${data.google_project.this.number}/locations/${local.region}/connections/${local.project}"
  to = google_cloudbuildv2_connection.github-connection
}
resource "google_cloudbuildv2_connection" "github-connection" {
  location = local.region
  name     = local.project
  github_config {
    app_installation_id = var.google-cloud-platform-github-connection-app-install-id
    authorizer_credential {
      oauth_token_secret_version = data.google_secret_manager_secret_version.github-connection.id
    }
  }
  depends_on = [
    google_cloudbuildv2_connection_iam_member.cloudbuild-iam-secret_manager-secret_setiampolicy,
    google_cloudbuildv2_connection_iam_member.cloudbuild-iam-secret_manager-secret_create
  ]
}
