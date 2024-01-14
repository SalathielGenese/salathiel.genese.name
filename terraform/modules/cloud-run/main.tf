resource "google_cloud_run_v2_service" "this" {
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

resource "google_cloud_run_service_iam_binding" "this" {
  service = google_cloud_run_v2_service.this.name
  role    = "roles/run.invoker"
  members = ["allUsers"]
}

resource "google_cloud_run_domain_mapping" "this-www" {
  count    = var.domain-www-subdomain ? 1 : 0
  name     = "www.${var.domain}"
  location = var.region
  spec {
    route_name = google_cloud_run_v2_service.this.name
  }
  metadata {
    namespace = var.project-number
  }
}

resource "google_cloud_run_domain_mapping" "this" {
  name     = "salathiel.genese.name"
  location = var.region
  spec {
    route_name = google_cloud_run_v2_service.this.name
  }
  metadata {
    namespace = var.project-number
  }
}
