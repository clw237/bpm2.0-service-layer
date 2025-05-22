region = "us-east-1"              ## Region for which you want to select endpoint
ENVIRONMENT= "sbx"
INSTANCE =  "kfone"
location = "northvirginia"
applications = [
    "common",
    "platform",
    "insight",
    "hrms",
    "connect"
]
application_id    = ""
deployment_strategy_id = ""

# Application specific configurations

## Tagging Variables


AWS_REGION = "us-east-1"
AWS_SECRET_NAME = "/system/platform/postgres/shared/ccf-user-pwd"
RABBITMQ_SECRET_NAME = "/system/platform/rabbitmq/admin-secret-001"
CONNECT_RMQ_EXCHANGE_NAME = "kfone_connect_exchange_topic"
CONNECT_RMQ_EMAIL_QUEUE_NAME = "kfone.connect.email"
CONNECT_RMQ_EMAIL_STATUS_QUEUE_NAME = "kfone.connect.status"
CONNECT_RMQ_SCHEDULER_QUEUE_NAME = "kfone.connect.scheduler"
CONNECT_RMQ_EMAIL_ROUTING_KEY= "email.send.ses"
CONNECT_RMQ_APPLICATION_ID = "connect_consumer"
WORKFLOW_DOMAIN="https://workflow-orchestration-api.apps.app01.sbx-use1.int-kfone.com"
CONNECT_RMQ_SCHEDULER_ROUTING_KEY= "scheduler.users.listen"
CONNECT_RMQ_EMAIL_STATUS_ROUTING_KEY = "email.status.update"
SES_TEST_EMAIL = "KFONE_DEV@kornferry.com"
SES_CONFIGURATION_SET = "kfone-sbx-use1-configsets-connect-email"
SES_FROM_EMAIL = "noreply@kornferrytalent-sbx.com"
LOG_TO_DB = "yes"
LOGIN_URL = "https://home.kornferrytalent-sbx.com"



Line-Of-Business     = "KF Digital"
Applications-Dept    = "One Platform - Core Engine"
Cost-Center          = "US21GPS"
WBS-Code             = "PLATFORM.08"
infra_KFDAppGroup    = "KFOne Platform"
infra_KFDAppSubGroup = "DevOps"
Env                  = "Sandbox"
Owner                = "Seshagiri Nuthalapat"
Accessability        = "private"
Classification       = "Proprietary"
HasPII               = "TBD"
Compliance           = "TBD"
Tech-Owner           = "Varma Saripalli"
