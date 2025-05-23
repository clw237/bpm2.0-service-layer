variable "Accessibility" {
  type    = string
  validation {
    condition     = length(var.Accessibility) > 0
    error_message = "Not null."
  }
  description = "Accessibility tag. Available values are [private, public, intranet, authenticated, anonymous]"
}

variable "Classification" {
  type    = string
  validation {
    condition     = length(var.Classification) > 0
    error_message = "Not null."
  }
  description = "Data Classification. Available values are [Public, Proprietary (default), Confidential, Restricted, Confidential:geo-restricted, Proprietary:geo-restricted]"
}
variable "HasPII" {
  type    = string
  validation {
    condition     = length(var.HasPII) > 0
    error_message = "Not null."
  }
  description = "This is the boolean value true or false for HasPII"
}
variable "Compliance" {
  type    = string
  validation {
    condition     = length(var.Compliance) > 0
    error_message = "Not null."
  }
  description = "This is the Compliance. Available values are [HIPAA, PCI, GDPR, ITAR, FedRAMP, CCPA]"
}
variable "KFDAppGroup" {
  type    = string
  default = null
  description = "This is the KFDAppGroup. Available values are [IC2-KFCT-Leader, IC2-KFCT-EmployeeExperience]"
}
variable "KFDAppSubgroup" {
  type    = string
  default = null
  description = "This is the KFDAppSubgroup. Available values are [Internal Mobility, Success Profile, Executive Dashboard, EE Application, EEC-Learing, EEC-Assessment]"
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

variable "Owner" {
  type    = string
  default = null
  description = "Owner for this resource"
}
variable "Environment" {
  type    = string
  default = ""
  description = "Envrionment for tag"
}
variable "Tech-Owner" {
  type    = string
  default = null
  description = "Tech-Owner for this resource"
}

# General
variable "location" {
  validation {
    condition = contains([
      "canadacentral"
      , "cac"
      , "canadaeast"
      , "cae"
      , "uaecentral"
      , "uac"
      , "uaenorth"
      , "uan"
      , "centralus"
      , "uc"
      , "northvirginia"
      , "ue1"
      , "eastus2"
      , "ue2"
      , "northcentralus"
      , "unc"
      , "southcentralus"
      , "usc"
      , "westus"
      , "uw"
      , "westus2"
      , "uw2"
      , "westus3"
      , "uw3"
      , "europe"
      , "eu"
      , "northeurope"
      , "en"
      , "westeurope"
      , "ew"
    ], var.location)
    error_message = "Invalid location."
  }
}

variable "organization" {
  type = string
}

variable "environment" {
  type = string
  validation {
    condition = contains([
      "sandbox"
      , "sbx"
      , "development"
      , "dev"
      , "quality_assurance"
      , "qa1"
      , "staging"
      , "stg"
      , "production"
      , "prd"
    ], var.environment)
    error_message = "Invalid environment."
  }
}

variable "generator" {
  type = map(map(number))
  validation {
    condition = (
      var.generator != null
      && length(var.generator) > 0
      && !contains(
        [for domain, resources in var.generator : (
          domain != null
          && !contains(
            [for resource_type, resource_count in resources : (
              resource_count != null && resource_count >= 0
          )], false)
      )], false)
    )
    error_message = "Invalid input for 'generator' variable."
  }
}
