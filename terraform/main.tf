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

resource "google_cloudbuildv2_repository" "web-prod" {
  name              = "${local.project}-web"
  project           = data.google_project.this.number
  parent_connection = google_cloudbuildv2_connection.github-connection.id
  remote_uri        = "https://github.com/SalathielGenese/salathiel.genese.name.git"
}

resource "google_cloudbuild_trigger" "web-prod" {
  location = local.region
  name = "${local.project}-web-prod"
  repository_event_config {
    repository = google_cloudbuildv2_repository.web-prod.id
    push {
      branch = "^main$"
    }
  }

  build {
    step {
      # Build Docker image for PROD
      name   = "gcr.io/cloud-builders/docker"
      env = [
        "PROJECT_NUMBER=$PROJECT_NUMBER",
        "COMMIT_SHA=$COMMIT_SHA",
        "LOCATION=$LOCATION",
      ]
      script = <<END_OF_SCRIPT
target="${local.project}-web"
image="$LOCATION-docker.pkg.dev/$PROJECT_NUMBER/$target/$target-prod:$( date +"%Y%m%dT%H%M%SZ" )-$COMMIT_SHA"

docker build --tag "$image" .
docker push "$image"
END_OF_SCRIPT
    }
  }
}

resource "google_artifact_registry_repository" "web" {
  format        = "DOCKER"
  repository_id = "${local.project}-web"
}

resource "google_cloud_run_v2_service" "web-prod" {
  launch_stage = "GA"
  location = local.region
  ingress = "INGRESS_TRAFFIC_ALL"
  name = "${local.project}-web-prod"
  template {
    containers {
#      image = "${local.region}.pkg.dev/${data.google_project.this.number}/${local.project}-web/${local.project}-web-prod"
      image = "krys/echo-server"
    }
  }
}

resource "google_cloud_run_service_iam_binding" "web-prod" {
  service  = google_cloud_run_v2_service.web-prod.name
  role     = "roles/run.invoker"
  members = ["allUsers"]
}
