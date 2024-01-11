data "google_project" "this" {}

data "google_secret_manager_secret" "github-connection" {
  secret_id = "projects/${data.google_project.this.number}/secrets/${var.google-cloud-platform-github-connection-secret-name}"
}
