variable "region" {
  type = string
  default = "us-east-1"
}
variable "ENVIRONMENT" {
  type = string
  default = "sbx"
}
variable "INSTANCE" {
  type = string
  default = "kfone"
}
variable "location" {
  type = string
  default = "northvirginia"
}



variable "application_id" {
  type = string
}
variable "deployment_strategy_id" {
  type = string
}

variable "TEST_ITEM" {
  type = string
  default = ""
}


variable "AWS_REGION" {
  type = string
  default = ""
}

variable "AWS_SECRET_NAME" {
  type = string
  default = ""
}

variable "LOG_TO_DB" {
  type = string
  default = ""
}

variable "LOGIN_URL" {
  type = string
  default = ""
}



#### Tagging Variables ######

variable "Env" {
  type    = string
  default = ""
  description = "Envrionment for tag"
}
variable "Accessibility" {
  type        = string
  description = "Accessibility tag. Available values are [private, public, intranet, authenticated, anonymous]"
}
variable "Classification" {
  type        = string
  description = "Data Classification. Available values are [Public, Proprietary (default), Confidential, Restricted, Confidential:geo-restricted, Proprietary:geo-restricted]"
}
variable "HasPII" {
  type        = string
  description = "This is the boolean value true or false for hasPII"
}
variable "Compliance" {
  type        = string
  description = "This is the Compliance. Available values are [HIPAA, PCI, GDPR, ITAR, FedRAMP, CCPA]"
}
variable "Owner" {
  type        = string
  description = "Owner for this resource"
}
variable "infra_KFDAppGroup" {
  type        = string
  description = "Tag value for Infra KFDAppGroup "
}
variable "infra_KFDAppSubGroup" {
  type        = string
  description = "Tag value for Infra for Module"
}
variable "WBS-Code" {
  type        = string
  description = "WBS Code for the cost center for this infra"
}
variable "Cost-Center" {
  type        = string
  description = "Cost Centre for this infra"
}
variable "Applications-Dept" {
  type        = string
  description = "Tag value for Applications Department"
}
variable "Line-Of-Business" {
  type        = string
  description = "Tag value for Line of Business in KF Digital"
}
variable "Tech-Owner" {
  type        = string
  description = "Tech-Owner for this resource"
}


## mq variables
variable "rabbitmq_vhost" {
  type    = string
  description = "mq vhost name"
  default = "/"
}

variable "rabbitmq_kfone_iam_queue" {
  type    = string
  description = "mq queue name"
  default = "iam-listener-queue"
}

variable "rabbitmq_kfone_exchange" {
  type    = string
  description = "mq topic name to bind the queue"
  default = "kf1-topic"
}
variable "applications" {
  type    = list(string)
  default = []
}
