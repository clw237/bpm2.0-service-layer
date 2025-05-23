region = "us-east-1"              ## Region for which you want to select endpoint
ENVIRONMENT= "stg"
INSTANCE =  "kfone"
location = "northvirginia"
applications = [
    "common",
    "platform",
    "insight",
    "hrms",
    "connect",
]
application_id    = "iolz0vg" # Connect App
deployment_strategy_id = "wtqujoj" # common deployment strategy id

# Application specific configurations
AWS_REGION = "us-east-1"
AWS_SECRET_NAME = "/system/platform/postgres/shared/ccf-user-pwd"
RABBITMQ_SECRET_NAME = "/system/platform/rabbitmq/admin-secret-001"
LOG_TO_DB = "yes"
LOGIN_URL = "https://home.kornferrytalent-stage.com"

## Tagging Variables

Line-Of-Business     = "KF Digital"
Applications-Dept    = "One Platform - Core Engine"
Cost-Center          = "US21GPS"
WBS-Code             = "PLATFORM.08"
infra_KFDAppGroup    = "KFOne Platform"
infra_KFDAppSubGroup = "DevOps"
Env                  = "STAGING"
Owner                = "Seshagiri Nuthalapat"
Accessibility        = "private"
Classification       = "Proprietary"
HasPII               = "TBD"
Compliance           = "TBD"
Tech-Owner           = "Varma Saripalli"
