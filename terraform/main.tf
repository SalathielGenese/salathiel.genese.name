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
  name     = "${local.project}-web-prod"
  repository_event_config {
    repository = google_cloudbuildv2_repository.web-prod.id
    push {
      branch = "^main$"
    }
  }

  build {
    step {
      # Build Docker image for PROD
      name = "gcr.io/cloud-builders/docker"
      env  = [
        "COMMIT_SHA=$COMMIT_SHA",
        "LOCATION=$LOCATION",
      ]
      script = <<END_OF_SCRIPT
        target="${local.project}-web"
        tag="$( date +"%Y%m%dT%H%M%SZ" )-$COMMIT_SHA"
        image="$LOCATION-docker.pkg.dev/${local.project}/$target/$target-prod"

        docker build --tag "$image:$tag" .
        docker push "$image:$tag"

        docker tag "$image:$tag" "$image:latest"
        docker push "$image:latest"
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
  location     = local.region
  ingress      = "INGRESS_TRAFFIC_ALL"
  name         = "${local.project}-web-prod"
  template {
    containers {
      image = "${local.region}-docker.pkg.dev/${local.project}/${local.project}-web/${local.project}-web-prod:latest"
    }
  }
}

resource "google_cloud_run_service_iam_binding" "web-prod" {
  service = google_cloud_run_v2_service.web-prod.name
  role    = "roles/run.invoker"
  members = ["allUsers"]
}

resource "google_cloud_run_domain_mapping" "web-prod-www" {
  name     = "www.salathiel.genese.name"
  location = local.region
  spec {
    route_name = google_cloud_run_v2_service.web-prod.name
  }
  metadata {
    namespace = data.google_project.this.number
  }
}

resource "google_cloud_run_domain_mapping" "web-prod" {
  name     = "salathiel.genese.name"
  location = local.region
  spec {
    route_name = google_cloud_run_v2_service.web-prod.name
  }
  metadata {
    namespace = data.google_project.this.number
  }
}
