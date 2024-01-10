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

resource "null_resource" "this" {
  triggers = {that-uuid= uuid()}
  provisioner "local-exec" {
    command = "echo this-uuid = ${self.triggers.that-uuid}"
  }
}

resource "terraform_data" "echo" {
  triggers_replace = local.tfc-random-uuid
  provisioner "local-exec" {
    command = "echo ${local.tfc-random-uuid}"
  }
}
