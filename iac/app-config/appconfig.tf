module "appconfig_iam_profile" {
  source             = "../modules/AppConfigProfile/"
  profile_name       = "connect-config"
  application_id = var.application_id
  deployment_strategy_id = var.deployment_strategy_id
  content = {
    AWS_REGION = var.AWS_REGION,
    AWS_SECRET_NAME = var.AWS_SECRET_NAME,
    CONNECT_RMQ_APPLICATION_ID = var.CONNECT_RMQ_APPLICATION_ID,
    RABBITMQ_SECRET_NAME = var.RABBITMQ_SECRET_NAME,
    LOG_TO_DB = var.LOG_TO_DB,
    LOGIN_URL = var.LOGIN_URL
  }
}
