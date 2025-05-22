provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    rabbitmq = {
      source = "cyrilgdn/rabbitmq"
      version = "1.8.0"
    }
  }
  backend "s3" {}
}

data "aws_mq_broker" "rabbitmq" {
  broker_name = module.naming.generated_names.env.rabbitmq[0]
}



data "aws_secretsmanager_secret" "rabbitmq_secret" {
  name = "/system/platform/rabbitmq/admin-secret-001"
}

data "aws_secretsmanager_secret_version" "rabbitmq_secret_version" {
  secret_id = data.aws_secretsmanager_secret.rabbitmq_secret.id
}

provider "rabbitmq" {
  endpoint = data.aws_mq_broker.rabbitmq.instances.0.console_url
  username = jsondecode(data.aws_secretsmanager_secret_version.rabbitmq_secret_version.secret_string)["username"]
  password = jsondecode(data.aws_secretsmanager_secret_version.rabbitmq_secret_version.secret_string)["password"]
}
