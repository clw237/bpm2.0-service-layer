import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerController } from 'controllers';
import {
  EmailSentResults,
  SchedulerEmails,
  Schedulers,
  ScheduleTaskLog,
  UserPool,
  UserPoolAttributes,
  UserPoolAttributesDef,
  Workspace,
} from 'entities';
import { ConsumerModule, ProducerModule } from 'kfone-mq-library';
import {
  EmailCategoryScheduleTypeRepository,
  EmailSendRepository,
  EmailSentResultsRepository,
  SchedulerEmailsRepository,
  ScheduleTaskLogRepository,
  UserPoolAttributesDefRepository,
  UserPoolAttributesRepository,
  UserPoolRepository,
  WorkspaceRepository,
} from 'repositories';
import {
  AppConfigService,
  MessageService,
  SchedulerFunctionsService,
  SchedulerRunnerService,
  SchedulerService,
} from 'services';
import { LoggerModule } from '../logger';
import { SchedulerEmailsService } from '../services/scheduler-emails.service';
import EmailUtils from './../utilities/email-utils';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Schedulers,
      ScheduleTaskLog,
      UserPool,
      UserPoolAttributes,
      UserPoolAttributesDef,
      Workspace,
      SchedulerEmails,
      EmailSentResults,
    ]),
    LoggerModule,
    ConsumerModule,
    ProducerModule,
  ],
  providers: [
    ScheduleTaskLogRepository,
    UserPoolRepository,
    UserPoolAttributesRepository,
    UserPoolAttributesDefRepository,
    WorkspaceRepository,
    AppConfigService,
    MessageService,
    SchedulerService,
    SchedulerEmailsService,
    EmailSendRepository,
    EmailSentResultsRepository,
    SchedulerEmailsRepository,
    EmailCategoryScheduleTypeRepository,
    SchedulerRunnerService,
    SchedulerFunctionsService,
    EmailUtils,
  ],
  controllers: [SchedulerController],
  exports: [SchedulerService, SchedulerRunnerService],
})
export default class SchedulerModule {}
