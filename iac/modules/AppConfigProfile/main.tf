
resource "aws_appconfig_configuration_profile" "profile" {
  name           = var.profile_name
  application_id = var.application_id
  location_uri   = "hosted"
  description    = "A common AppConfig configuration profile"
}



resource "aws_appconfig_hosted_configuration_version" "config_version" {
  application_id          = var.application_id
  configuration_profile_id =  aws_appconfig_configuration_profile.profile.configuration_profile_id
  content                = jsonencode(var.content)
  content_type           = "application/json"
  description            = "Hosted configuration version 1"
}

resource "aws_appconfig_deployment" "deployment" {
  application_id           =  var.application_id
  configuration_profile_id =  aws_appconfig_configuration_profile.profile.configuration_profile_id
  configuration_version    =  aws_appconfig_hosted_configuration_version.config_version.version_number
  environment_id           =  sort(data.aws_appconfig_environments.env.environment_ids)[0]
  deployment_strategy_id    = var.deployment_strategy_id
  description               = "A common deployment"
}


data "aws_appconfig_environments" "env" {
  application_id = var.application_id
}