import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerModule } from 'kfone-mq-library';
import {
  AppConfigModule,
  AppSettingsModule,
  HealthModule,
  PostgresDatabaseModule,
} from 'modules';
import { remoteLoader, TypedConfigModule } from 'nest-typed-config';
import configuration from './config/configuration';
import { BpmController } from './controllers/bpm.controller';
import { ConnectApplicationConfig, DatabaseConfig } from './dtos/appconfig.dto';
import ExceptionLoggerFilter from './filters/exception-filter';
import { LoggerModule } from './logger';
import { BpmService } from './services/bpm.service';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/config/env/dev.env',
      isGlobal: true,
      load: [configuration],
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
    TypedConfigModule.forRootAsync({
      schema: ConnectApplicationConfig,
      load:
        process.env.DEBUG === 'local'
          ? () => ({
              AWS_REGION: process.env.AWS_REGION,
              AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
              RABBITMQ_SECRET_NAME: process.env.RABBITMQ_SECRET_NAME,
              LOG_TO_DB: process.env.LOG_TO_DB,
              LOGIN_URL: process.env.LOGIN_URL,
            })
          : remoteLoader(`${process.env.REMOTE_LOADER_BPM_CONFIG_URL}`, {
              type: () => 'json',
              shouldRetry: (response) => response.status !== 200,
              retries: 3,
              retryInterval: 3000,
            }),
    }),
    LoggerModule,
    PostgresDatabaseModule,
    HealthModule,
    AppConfigModule,
    AppSettingsModule,
  ],
  controllers: [BpmController],
  providers: [
    BpmService,
    WebhookService,
    { provide: 'APP_FILTER', useClass: ExceptionLoggerFilter },
  ],
})
export class AppModule {}
