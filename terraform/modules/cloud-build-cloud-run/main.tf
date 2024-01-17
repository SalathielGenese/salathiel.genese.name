resource "google_cloud_run_v2_service" "web" {
  launch_stage = "GA"
  location     = var.region
  ingress      = "INGRESS_TRAFFIC_ALL"
  name         = "${var.project-id}-web-${var.module-name}"
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project-id}/${var.project-id}-web/${var.project-id}-web-${var.module-name}:latest"
    }
  }
}

resource "google_cloud_run_service_iam_binding" "web" {
  service = google_cloud_run_v2_service.web.name
  role    = "roles/run.invoker"
  members = ["allUsers"]
}

#resource "google_cloud_run_domain_mapping" "web-www" {
#  count    = var.domain-www-subdomain ? 1 : 0
#  name     = "www.${var.domain}"
#  location = var.region
#  spec {
#    route_name = google_cloud_run_v2_service.web.name
#  }
#  metadata {
#    namespace = var.project-number
#  }
#}
#
#resource "google_cloud_run_domain_mapping" "web" {
#  name     = var.domain
#  location = var.region
#  spec {
#    route_name = google_cloud_run_v2_service.this.name
#  }
#  metadata {
#    namespace = var.project-number
#  }
#}

resource "google_cloudbuild_trigger" "web" {
  location = var.region
  name     = "${var.project-id}-web-${var.module-name}"
  repository_event_config {
    repository = var.repository-id
    push {
      branch = var.branch
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
      script = templatefile("${path.module}/cloud-build.sh.tfpl", {
        MODULE  = var.module-name,
        PROJECT = var.project-id,
      })
    }
  }
}

resource "google_dns_managed_zone" "web" {
  name     = "${var.project-id}-web"
  dns_name = var.domain
}
