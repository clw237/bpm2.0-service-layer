export const EMAIL_SEND_STATUS = {
  SENT: 'Sent',
  ERROR: 'Error',
  IN_PROGRESS: 'InProgress',
};

export const SCHEDULER_EMAIL_STATUS = {
  READY_TO_SEND: 'ReadyToSend',
  SENT_TO_QUEUE: 'SentToQueue',
  ERROR: 'Error',
};

export const SCHEDULE_TYPE = {
  WEEKLY: 'Weekly',
  DATE: 'Date',
};

export const SCHEDULE_TYPE_CODE = {
  REMINDER: 'reminder',
  DATE: 'specificDay',
};

export const EMAIL_SEND_DESCRIPTION = {
  SENT: 'Email Sent Confirmed',
  ERROR: 'Email Sent Failed',
  IN_PROGRESS: 'Email Sent. Waiting for confirmation',
};

export const USER_POOL_STATUS = {
  COMPLETE: 'Complete',
  ERROR: 'Error',
  IN_PROGRESS: 'InProgress',
};

export const EMAIL_SEND_NOTIFICATION = {
  BOUNCE: 'Bounce',
  OPEN: 'Open',
  SEND: 'Send',
  DELIVERY: 'Delivery',
} as const;

export enum SchedulerStatusEnum {
  STARTED = 'Started',
  COMPLETED = 'Completed',
  ERROR = 'Error',
}

export const allowedEmailTemplateQueryFields: Record<string, string> = {
  templateName: 'et.template_name',
  categoryName: 'ec.email_category_name',
  subject: 'etl.subject',
  updatedAt: 'etl.updated_at',
};

export const KFONE_CONNECT_WORKSPACE_KEY =
  '832e16ed-39f3-4441-a18f-656b62e72d0f';
