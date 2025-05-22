import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateController } from 'controllers';
import {
  EmailCategory,
  EmailCategoryMergeFields,
  EmailTemplate,
  EmailTemplateLanguages,
  Schedulers,
  ScheduleTypes,
  Workspace,
} from 'entities';
import {
  EmailCategoryRepository,
  EmailTemplateRepository,
  WorkspaceRepository,
} from 'repositories';
import { EmailUtils } from 'utilities';
import { LoggerModule } from '../logger';
import { EmailTemplateLanguagesRepository } from './../repositories/email-template-languages.repository';
import { EmailService } from './../services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailTemplateLanguages,
      EmailTemplate,
      ScheduleTypes,
      Schedulers,
      EmailCategory,
      EmailCategoryMergeFields,
      Workspace,
    ]),
    LoggerModule,
  ],
  providers: [
    EmailService,
    EmailTemplateLanguagesRepository,
    EmailTemplateRepository,
    EmailCategoryRepository,
    EmailUtils,
    WorkspaceRepository,
  ],
  controllers: [EmailTemplateController],
})
export default class EmailTemplateLanguagesModule {}
