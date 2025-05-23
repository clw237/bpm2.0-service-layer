module "naming" {
  source            = "../modules/Naming/"
  organization      = var.INSTANCE
  environment       = var.ENVIRONMENT
  location          = var.location
  Line-Of-Business  = var.Line-Of-Business
  Applications-Dept = var.Applications-Dept
  Cost-Center       = var.Cost-Center
  WBS-Code          = var.WBS-Code
  KFDAppSubgroup    = var.infra_KFDAppSubGroup
  KFDAppGroup       = var.infra_KFDAppGroup
  Environment       = var.Env
  Accessibility     = var.Accessibility
  Classification    = var.Classification
  Owner             = var.Owner
  HasPII            = var.HasPII
  Compliance        = var.Compliance
  Tech-Owner        = var.Tech-Owner
  generator         =  {
    "env" = {
      "rabbitmq" = 1
    }

    "mq" = {
      "security_group" = 1
      "subnet"         = 1
    }
    "tf" = {
      "simple_storage_service"  = 1
    }
    "nifi" = {
      "simple_storage_service" = 1
    }
    "devops" = {
      "simple_storage_service" = 1
    }
    "edw" = {
      "simple_storage_service" = 1
    }
    "platformsvc" = {
      "virtual_private_network" = 1
    }
    "infra-runner" = {
      "subnet" = 1
    }
    "app-runner" = {
      "subnet" = 1
    }
    "infra-gha" = {
      "security_group" = 1
    }
    "app-gha" = {
      "security_group" = 1
    }
    "ocp-app" = {
      "virtual_private_network" = 1
    }
    "ocp-mgt" = {
      "virtual_private_network" = 1
    }
    "idm-tfstate" = {
      "simple_storage_service" = 1
    }
    "ocp-tfstate" = {
      "simple_storage_service" = 1
    }
    "ocp-mgt-backups" = {
      "simple_storage_service" = 1
    }
    "gateway" = {
      "virtual_private_network" = 1
    }
    "iam"={
      "lambda_function"=1
      "iam_role"          = 1
      "iam_policy"        = 1
    }
    "env" = {
      "rabbitmq" = 1
    }
  }
}
