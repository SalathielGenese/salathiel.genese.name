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
  project = local.project
  region  = local.region
}
