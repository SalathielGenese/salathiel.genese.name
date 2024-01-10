terraform {
  cloud {
    organization = "salathiel-genese"
    workspaces {
      name = "salathielgenesename"
    }
  }
}

locals {
  tfc-random-uuid = uuid()
}
