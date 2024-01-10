resource "terraform_data" "echo" {
  provisioner "local-exec" {
    command = "echo ${local.tfc-random-uuid}"
  }
}
