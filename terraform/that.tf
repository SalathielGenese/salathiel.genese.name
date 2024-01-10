resource "null_resource" "this" {
  triggers = {that-uuid= uuid()}
  provisioner "local-exec" {
    command = "echo this-uuid = ${self.triggers.that-uuid}"
  }
}
