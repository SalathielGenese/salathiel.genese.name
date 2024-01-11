resource "google_cloud_run_service" "this" {
  name     = "salathiel-dot-genese-dot-name"
  location = local.region
}
