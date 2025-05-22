import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerModule, ProducerModule } from 'kfone-mq-library';
import { EmailUtils } from 'utilities';
import {
  EmailCategory,
  EmailCategoryMergeFields,
  EmailSend,
  EmailTemplate,
  EmailTemplateLanguages,
  Schedulers,
  Workspace,
} from '../entities/index';
import {
  EmailCategoryRepository,
  EmailSendRepository,
  EmailSentResultsRepository,
  EmailTemplateRepository,
  EmailWhiteListRepository,
  WorkspaceRepository,
} from '../repositories/index';
import { EmailWhiteListService } from '../services/email-whitelist.service';
import { EmailService } from '../services/email.service';
import { EmailSendService } from '../services/emailSend.service';
import {
  AppConfigService,
  MessageService,
  SnsSignatureVerificationService,
} from '../services/index';
import {
  EmailTemplateController,
  MessageController,
} from './../controllers/index';
import { EmailTemplateLanguagesRepository } from './../repositories/email-template-languages.repository';
import { EmailTemplateInitAppService } from './../services';
import { MailerService } from './../services/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailTemplate,
      EmailTemplateLanguages,
      EmailSend,
      EmailCategoryMergeFields,
      EmailCategory,
      Workspace,
      Schedulers,
    ]),
    ProducerModule,
    ConsumerModule,
    HttpModule,
  ],
  providers: [
    EmailTemplateRepository,
    EmailTemplateLanguagesRepository,
    EmailSendRepository,
    EmailSentResultsRepository,
    EmailCategoryRepository,
    WorkspaceRepository,
    EmailWhiteListRepository,
    EmailService,
    EmailSendService,
    EmailWhiteListService,
    EmailUtils,
    MessageService,
    SnsSignatureVerificationService,
    MailerService,
    AppConfigService,
    EmailTemplateInitAppService,
  ],
  controllers: [EmailTemplateController, MessageController],
  exports: [
    EmailService,
    EmailSendService,
    EmailWhiteListService,
    EmailTemplateRepository,
    EmailTemplateLanguagesRepository,
    EmailSendRepository,
    EmailSentResultsRepository,
    EmailCategoryRepository,
    WorkspaceRepository,
    EmailWhiteListRepository,
    TypeOrmModule,
    MessageService,
    SnsSignatureVerificationService,
    MailerService,
    EmailUtils,
    EmailTemplateInitAppService,
  ],
})
export class EmailTemplateModule {}
