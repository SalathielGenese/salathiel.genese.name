terraform {
  cloud {
    organization = "salathiel-genese"
    workspaces {
      name = "salathielgenesename"
    }
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.11.0"
    }
  }
}

provider "google" {
  credentials = var.google-cloud-platform-credentials
  project = local.project
  region  = local.region
}
