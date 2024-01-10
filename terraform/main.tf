terraform {
  cloud {
    organization = "salathiel-genese"
    workspaces {
      name = "salathielgenesename"
    }
  }
}

locals {
  random-uuid = uuid()
}

resource "terraform_data" "echo" {
  triggers_replace = local.random-uuid
  provisioner "local-exec" {
    command = "echo ${local.random-uuid}"
  }
}
