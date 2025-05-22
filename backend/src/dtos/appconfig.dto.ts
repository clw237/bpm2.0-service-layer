import { IsDefined, IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  @IsDefined()
  database: string;

  @IsString()
  @IsDefined()
  host: string;

  @IsString()
  @IsDefined()
  port: string;
}

export class ConnectApplicationConfig {
  @IsString()
  @IsDefined()
  AWS_REGION: string;

  @IsString()
  @IsDefined()
  AWS_SECRET_NAME: string;

  @IsString()
  @IsDefined()
  RABBITMQ_SECRET_NAME: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_EXCHANGE_NAME: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_EMAIL_QUEUE_NAME: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_EMAIL_ROUTING_KEY: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_APPLICATION_ID: string;

  @IsString()
  @IsDefined()
  WORKFLOW_DOMAIN: string;

  @IsString()
  @IsDefined()
  SES_TEST_EMAIL: string;

  @IsString()
  @IsDefined()
  SES_CONFIGURATION_SET: string;

  @IsString()
  @IsDefined()
  SES_FROM_EMAIL: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_SCHEDULER_ROUTING_KEY: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_EMAIL_STATUS_ROUTING_KEY: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_SCHEDULER_QUEUE_NAME: string;

  @IsString()
  @IsDefined()
  CONNECT_RMQ_EMAIL_STATUS_QUEUE_NAME: string;

  @IsString()
  @IsDefined()
  LOG_TO_DB: string;

  @IsString()
  @IsDefined()
  LOGIN_URL: string;
}
