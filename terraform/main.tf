data "google_cloud_run_service" "these" {
  name     = "salathiel-dot-genese-dot-name"
  location = local.region
}
