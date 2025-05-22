import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerModule } from 'kfone-mq-library';
import {
  AppConfigModule,
  AppSettingsModule,
  DebugModule,
  EmailModule,
  EmailTemplateLanguagesModule,
  EmailWhitelistModule,
  HealthModule,
  PostgresDatabaseModule,
  SchedulerModule,
  TaskModule,
  UserModule,
} from 'modules';
import { remoteLoader, TypedConfigModule } from 'nest-typed-config';
import { ConnectApplicationConfig, DatabaseConfig } from './dtos/appconfig.dto';
import { LoggerModule } from './logger';
import { EmailTemplateModule } from './modules/email-template.module';
import { MailerModule } from './modules/mailer.module';
import { UserPoolModule } from './modules/user-pool.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/config/env/dev.env',
      isGlobal: true,
    }),
    TypedConfigModule.forRootAsync({
      schema: DatabaseConfig,
      load:
        process.env.DEBUG === 'local'
          ? () => ({
              database: process.env.DB_DATABASE,
              host: process.env.DB_HOST,
              port: process.env.DB_PORT,
            })
          : remoteLoader(`${process.env.REMOTE_LOADER_DB_URL}`, {
              type: () => 'json',
              shouldRetry: (response) => response.status !== 200,
              retries: 3,
              retryInterval: 3000,
            }),
    }),
    ConsumerModule,
    EmailTemplateModule,
    UserPoolModule,
    MailerModule,
    TypedConfigModule.forRootAsync({
      schema: ConnectApplicationConfig,
      load:
        process.env.DEBUG === 'local'
          ? () => ({
              AWS_REGION: process.env.AWS_REGION,
              AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
              RABBITMQ_SECRET_NAME: process.env.RABBITMQ_SECRET_NAME,
              CONNECT_RMQ_APPLICATION_ID:
                process.env.CONNECT_RMQ_APPLICATION_ID,
              CONNECT_RMQ_EXCHANGE_NAME: process.env.CONNECT_RMQ_EXCHANGE_NAME,
              CONNECT_RMQ_EMAIL_QUEUE_NAME:
                process.env.CONNECT_RMQ_EMAIL_QUEUE_NAME,
              CONNECT_RMQ_EMAIL_ROUTING_KEY:
                process.env.CONNECT_RMQ_EMAIL_ROUTING_KEY,
              CONNECT_RMQ_SCHEDULER_ROUTING_KEY:
                process.env.CONNECT_RMQ_SCHEDULER_ROUTING_KEY,
              CONNECT_RMQ_EMAIL_STATUS_ROUTING_KEY:
                process.env.CONNECT_RMQ_EMAIL_STATUS_ROUTING_KEY,
              SES_TEST_EMAIL: process.env.SES_TEST_EMAIL,
              SES_CONFIGURATION_SET: process.env.SES_CONFIGURATION_SET,
              SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
              LOG_TO_DB: process.env.LOG_TO_DB,
              LOGIN_URL: process.env.LOGIN_URL,
              CONNECT_RMQ_EMAIL_STATUS_QUEUE_NAME:
                process.env.CONNECT_RMQ_EMAIL_STATUS_QUEUE_NAME,
              CONNECT_RMQ_SCHEDULER_QUEUE_NAME:
                process.env.CONNECT_RMQ_SCHEDULER_QUEUE_NAME,
              WORKFLOW_DOMAIN: process.env.WORKFLOW_DOMAIN,
            })
          : remoteLoader(`${process.env.REMOTE_LOADER_CONNECT_CONFIG_URL}`, {
              type: () => 'json',
              shouldRetry: (response) => response.status !== 200,
              retries: 3,
              retryInterval: 3000,
            }),
    }),
    LoggerModule,
    PostgresDatabaseModule,
    HealthModule,
    EmailTemplateLanguagesModule,
    SchedulerModule,
    EmailWhitelistModule,
    AppConfigModule,
    AppSettingsModule,
    UserModule,
    TaskModule,
    EmailModule,
    DebugModule,
  ],
})
export class AppModule {}
