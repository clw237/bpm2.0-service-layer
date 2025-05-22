import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsumerService, KFOneMessage } from 'kfone-mq-library';
import * as mustache from 'mustache';
import { Repository } from 'typeorm';
import {
  EmailCategory,
  EmailMessage,
  EmailTemplate,
  EmailTemplateLanguages,
  Schedulers,
} from '../entities/index';
import { LoggerService } from '../logger';
import { AppConfigService } from '../services';
import {
  EMAIL_SEND_STATUS,
  KFONE_CONNECT_WORKSPACE_KEY,
} from './../config/constants';
import {
  EmailCategoryRepository,
  EmailTemplateRepository,
} from './../repositories';
import { EmailWhiteListService } from './../services/email-whitelist.service';
import { EmailService } from './../services/email.service';
import { EmailSendService } from './../services/emailSend.service';
import { MailerService } from './../services/mailer.service';
import { convertToFriendlyFormat } from './../utilities/scheduler-utils';
@Injectable()
export default class EmailTemplateInitAppService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly emailService: EmailService,
    private readonly emailSend: EmailSendService,
    private readonly mailerService: MailerService,
    private readonly emailWhiteListService: EmailWhiteListService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
    private readonly emailCategoryRepository: EmailCategoryRepository,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @InjectRepository(Schedulers)
    private readonly schedulerRepository: Repository<Schedulers>,
  ) {}

  async onModuleInit() {
    console.log('Consumer Service Initiated');

    const RABBITMQ_QUEUE_NAME = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_EMAIL_QUEUE_NAME',
    );
    const consumerId = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_APPLICATION_ID',
    );
    console.log('RABBITMQ_QUEUE_NAME', RABBITMQ_QUEUE_NAME);
    console.log('consumerId', consumerId);

    await this.consumerService.listen(
      RABBITMQ_QUEUE_NAME,
      this.handleMessage.bind(this),
      consumerId,
    );
  }

  async getEmailTemplateByIdOrDefault(
    emailTemplateKey: string,
    languageCode: string,
  ) {
    let targetLanguageTemplate: EmailTemplateLanguages | null =
      await this.emailService.getEmailTemplateByLanguage(
        emailTemplateKey,
        languageCode,
      );

    if (targetLanguageTemplate?.body) {
      return targetLanguageTemplate;
    } else {
      //       // if no language template found for the the given language code, look for default language - en-US
      targetLanguageTemplate =
        await this.emailService.getEmailTemplateByLanguage(
          emailTemplateKey,
          'en-US',
        );
      if (targetLanguageTemplate?.body) {
        return targetLanguageTemplate;
      } else {
        //throw new Error(`No email body available ${emailTemplateKey}`);
        return null;
      }
    }
  }

  async getTargetToEmailAddress(message: EmailMessage) {
    //const isProduction = process.env.NODE_ENV === 'production';
    const testEmail = this.appConfigService.getConfigValue('SES_TEST_EMAIL');
    if (testEmail) {
      const isInWhiteList = await this.checkIfEmailWhiteListed(
        message.toEmailaddress,
      );
      if (isInWhiteList) {
        return message.toEmailaddress;
      } else {
        return testEmail;
      }
    }
    return message.toEmailaddress;
  }

  async validateEmailPayload(message) {
    const errorItems: any = [];
    // validate required fields
    if (
      !message.firstName ||
      !message.toEmailaddress ||
      (!message.emailCategoryCode && !message.emailTemplateKey)
    ) {
      errorItems.push({
        error: `Either firstName, toEmailaddress or (emailCategoryCode and emailTemplateKey) missing from the message `,
        item: {
          firstName: message.firstName || '',
          lastName: message.lastName || '',
          toEmailaddress: message.toEmailaddress || '',
          emailCategoryCode: message.emailCategoryCode || '',
          passwordLink: message.passwordLink || '',
        },
      });
      return { message, errorItems };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(message.toEmailaddress)) {
      errorItems.push({
        error: `Invalid format for email address: ${message.toEmailaddress}`,
        item: {
          firstName: message.firstName || '',
          lastName: message.lastName || '',
          toEmailaddress: message.toEmailaddress || '',
          emailCategoryCode: message.emailCategoryCode || '',
          passwordLink: message.passwordLink || '',
        },
      });
      return { message, errorItems };
    }

    if (
      (message.emailCategoryCode === 'PASSWORD_RESET' ||
        message.emailCategoryCode === 'USER_INVITATION') &&
      !message.passwordLink
    ) {
      errorItems.push({
        error: `No passwordLink provided for emailCategoryCode : ${message.emailCategoryCode}`,
        item: {
          firstName: message.firstName || '',
          lastName: message.lastName || '',
          toEmailaddress: message.toEmailaddress || '',
          emailCategoryCode: message.emailCategoryCode || '',
          passwordLink: message.passwordLink || '',
        },
      });
      return { message, errorItems };
    }

    if (message.emailCategoryCode === 'ASSESSMENT_REMINDER') {
      if (message.emailTemplateKey && message.campaignKey) {
        const schedulerRecord = await this.schedulerRepository.findOne({
          where: {
            template_key: message.emailTemplateKey,
            item_key: message.campaignKey,
          },
        });
        if (schedulerRecord) {
          message.deadLineDate = convertToFriendlyFormat(
            (schedulerRecord?.schedule_json as any)?.assessmentDeadlineInUtc,
            (schedulerRecord?.schedule_json as any)?.timezone,
          );
        }
      }
    }

    if (!message.emailTemplateKey) {
      const emailCategoryRecord: EmailCategory | null =
        await this.emailCategoryRepository.getEmailCategoryFromCategoryCode(
          message.emailCategoryCode,
        );
      if (emailCategoryRecord) {
        const emailTemplateRecord: EmailTemplate | null =
          await this.emailTemplateRepository.getEmailTemplateByEmailCategoryKey(
            emailCategoryRecord.email_category_key,
          );
        if (emailTemplateRecord) {
          message.emailTemplateKey = emailTemplateRecord.template_key;
        } else {
          errorItems.push({
            error: `No emailTemplateRecord found for the email_category_key: ${emailCategoryRecord.email_category_key} `,
            item: {
              firstName: message.firstName || '',
              lastName: message.lastName || '',
              toEmailaddress: message.toEmailaddress || '',
              emailCategoryCode: message.emailCategoryCode || '',
              passwordLink: message.passwordLink || '',
            },
          });
          return { message, errorItems };
        }
      } else {
        errorItems.push({
          error: `No emailCategoryRecord found for the provided emailCategoryCode: ${message.emailCategoryCode} `,
          item: {
            firstName: message.firstName || '',
            lastName: message.lastName || '',
            toEmailaddress: message.toEmailaddress || '',
            emailCategoryCode: message.emailCategoryCode || '',
            passwordLink: message.passwordLink || '',
          },
        });
        return { message, errorItems };
      }
    }
    return { message, errorItems };
  }

  async handleMessage(message: KFOneMessage): Promise<void> {
    const { payload, properties } = message;
    let recordId = '';
    console.log('<<<<<<<<<<<<<<<<message1', properties.payloadId);
    console.log('<<<<<<<<<<<<<<<<message', message);

    try {
      if (payload) {
        const message: EmailMessage = JSON.parse(payload);

        message.languageCode ??= 'en-US';
        message.workspaceKey ??= KFONE_CONNECT_WORKSPACE_KEY;
        message.workspaceUserKey ??= KFONE_CONNECT_WORKSPACE_KEY;

        const validatation: any = await this.validateEmailPayload(message);

        const email_send_data = {
          message,
          body: '',
          subject: '',
        };

        const hasError = validatation.errorItems.length > 0;

        const addRecordResult = await this.emailSend.addRecord(
          properties.traceId,
          message.toEmailaddress,
          message.emailTemplateKey ?? null,
          message.languageCode,
          null,
          message.workspaceUserKey,
          EMAIL_SEND_STATUS.IN_PROGRESS,
          JSON.stringify(email_send_data),
          hasError ? JSON.stringify(validatation.errorItems) : null,
          message.metaData ?? null,
        );

        if (addRecordResult?.success) {
          recordId = addRecordResult.email_send_key ?? '';
        } else {
          //duplicate email send record
          console.log('duplicate email send record');
          return;
        }

        if (hasError) {
          return;
        }

        const targettoEmailaddress =
          await this.getTargetToEmailAddress(message);

        if (!recordId) {
          throw new Error('Email send add record failed');
        }

        if (message?.emailTemplateKey && message?.languageCode) {
          let targetLanguageTemplate = await this.getEmailTemplateByIdOrDefault(
            message.emailTemplateKey,
            message.languageCode,
          );

          if (targetLanguageTemplate) {
            await this.processEmail(
              targetLanguageTemplate,
              message,
              email_send_data,
              targettoEmailaddress,
              recordId,
            );
          } else {
            // log error in email_send
            await this.emailSend.updateRecord(
              recordId,
              EMAIL_SEND_STATUS.ERROR,
              `No language template found with template_key ${message.emailTemplateKey}`,
              null,
              JSON.stringify(email_send_data),
            );
          }
        } else {
          // log error in email_send
          await this.emailSend.updateRecord(
            recordId,
            EMAIL_SEND_STATUS.ERROR,
            `No language_code or email template_key found in the request`,
            null,
            JSON.stringify(email_send_data),
          );
        }
      }
    } catch (e) {
      console.log('exception >>');
      console.log(e);
      if (recordId) {
        await this.emailSend.updateRecord(
          recordId,
          EMAIL_SEND_STATUS.ERROR,
          `An exception occurred : ${e.message}`,
          null,
          JSON.stringify(message),
        );
      }
      this.logger.error(
        'Error in handleMessage',
        e.stack,
        e.message,
        JSON.stringify(message),
      );
    }
  }

  async processEmail(
    targetLanguageTemplate,
    message,
    email_send_data,
    targettoEmailaddress,
    recordId,
  ): Promise<string> {
    const emailBody = mustache.render(targetLanguageTemplate.body, message);

    email_send_data.body = emailBody;
    email_send_data.subject = mustache.render(
      targetLanguageTemplate.subject,
      message,
    );

    let message_id: string | null = null;
    try {
      message_id = await this.mailerService.sendEmailViaNodeMailer(
        targettoEmailaddress,
        targetLanguageTemplate.subject,
        { html: emailBody },
        this.appConfigService.getConfigValue('SES_FROM_EMAIL'),
      );

      await this.emailSend.updateRecord(
        recordId,
        EMAIL_SEND_STATUS.SENT,
        '',
        message_id,
        JSON.stringify(email_send_data),
      );
    } catch (e) {
      // log error in email_send
      await this.emailSend.updateRecord(
        recordId,
        EMAIL_SEND_STATUS.ERROR,
        `An exception occurred : ${e.message}`,
        null,
        JSON.stringify(email_send_data),
      );
    }

    console.log('message_id >>');
    console.log(message_id);

    return message_id ?? '';
  }

  async onModuleDestroy() {
    await this.consumerService.onModuleDestroy();
  }

  async checkIfEmailWhiteListed(email: string): Promise<boolean> {
    return this.emailWhiteListService.checkIfEmailWhiteListed(email);
  }
}
