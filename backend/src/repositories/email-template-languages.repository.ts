import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCombinedEmailTemplateDto, EmailTemplatesDto } from 'dtos';
import {
  EmailCategoryMergeFields,
  EmailTemplate,
  EmailTemplateLanguages,
  Schedulers,
} from 'entities';
import { ItemType } from 'src/entities/email-template.entity';
import { Repository } from 'typeorm';
import { EmailUtils } from 'utilities';
import { LoggerService } from '../logger';

@Injectable()
export class EmailTemplateLanguagesRepository {
  constructor(
    private readonly emailUtils: EmailUtils,
    private readonly logger: LoggerService,

    @InjectRepository(EmailTemplateLanguages)
    private readonly emailTemplateLanguagesRepository: Repository<EmailTemplateLanguages>,

    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,

    @InjectRepository(EmailCategoryMergeFields)
    private readonly emailCategoryMergeFieldsRepository: Repository<EmailCategoryMergeFields>,

    @InjectRepository(Schedulers)
    private readonly schedulerRepository: Repository<Schedulers>,
  ) {}

  async createEmailTemplateLanguage(
    createCombinedEmailTemplateDto: CreateCombinedEmailTemplateDto,
  ): Promise<EmailTemplateLanguages> {
    try {
      const newEmailTemplate = this.emailTemplateRepository.create({
        template_name: createCombinedEmailTemplateDto.template_name,
        email_category_key: createCombinedEmailTemplateDto.email_category_key,
        workspace_key: createCombinedEmailTemplateDto.workspace_key,
        item_key: createCombinedEmailTemplateDto.item_key,
        item_type: createCombinedEmailTemplateDto.item_type,
        created_at: new Date(),
      });

      const savedEmailTemplate =
        await this.emailTemplateRepository.save(newEmailTemplate);

      const newEmail = this.emailTemplateLanguagesRepository.create({
        template_key: savedEmailTemplate.template_key,
        language_code: createCombinedEmailTemplateDto.language_code,
        subject: createCombinedEmailTemplateDto.subject,
        body: createCombinedEmailTemplateDto.body,
        created_at: new Date(),
      });

      return this.emailTemplateLanguagesRepository.save(newEmail);
    } catch (err) {
      this.logger.error(
        `createEmailTemplateLanguage: Failed to create email template with data: ${JSON.stringify(createCombinedEmailTemplateDto)}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplate(
    emailCategoryKey: string,
    workspaceKey?: string,
    itemKey?: string,
    lang?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<any> {
    try {
      const { total, data: templates } =
        await this.emailUtils.getEmailTemplateDetails({
          workspaceKey,
          itemKey,
          itemType: ItemType.CLIENT,
          emailCategoryKey,
          lang,
          sortBy,
          sortOrder,
          ...(page && limit ? { limit, offset: (page - 1) * limit } : {}),
        });

      const { total: defaultTemplatesTotal, data: defaultTemplates } =
        await this.emailUtils.getEmailTemplateDetails({
          workspaceKey,
          emailCategoryKey,
          itemType: ItemType.SYSTEM,
          lang,
          sortBy,
          sortOrder,
        });

      let mergeFields = {};

      if (emailCategoryKey === 'all') {
        const allMergeFields =
          await this.emailCategoryMergeFieldsRepository.find();

        allMergeFields.forEach((field) => {
          if (field.email_category_key) {
            if (!mergeFields[field.email_category_key]) {
              mergeFields[field.email_category_key] = [];
            }
            mergeFields[field.email_category_key].push(field);
          }
        });
      } else if (emailCategoryKey) {
        mergeFields = await this.emailCategoryMergeFieldsRepository.find({
          where: { email_category_key: emailCategoryKey },
        });
      }

      return {
        emailTemplate: {
          defaultTemplates,
          templates,
          total,
          defaultTemplatesTotal,
          mergeFields,
        },
      };
    } catch (err) {
      this.logger.error(
        `getEmailTemplate: Failed to get email templates for category ${emailCategoryKey}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplateById(
    templateKey: string,
    languageCode: string,
    emailCategoryKey?: string,
    needMergeFields = true,
  ): Promise<any> {
    try {
      let mergeFields = [] as EmailCategoryMergeFields[];

      if (emailCategoryKey && needMergeFields) {
        mergeFields = await this.emailCategoryMergeFieldsRepository.find({
          where: { email_category_key: emailCategoryKey },
        });
      }

      const { data: template } = await this.emailUtils.getEmailTemplateDetails({
        templateKey,
        languageCode,
      });

      return { ...template[0], mergeFields };
    } catch (err) {
      this.logger.error(
        `getEmailTemplateById: Failed to get email templates for key ${templateKey} and language ${languageCode}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplates(body: EmailTemplatesDto[]): Promise<any> {
    try {
      const templates = await Promise.all(
        body.map(async (template) => {
          const templateData = await this.getEmailTemplateById(
            template.template_key,
            template.lang,
            template.email_category_key,
            false,
          );
          const schedulerData = await this.schedulerRepository.find({
            where: {
              template_key: template.template_key,
              item_key: template.campaign_key,
            },
          });
          return {
            ...templateData,
            schedulerData:
              schedulerData.length > 0
                ? {
                    scheduler_name: schedulerData[0].scheduler_name,
                    schedule_json: schedulerData[0].schedule_json,
                  }
                : null,
          };
        }),
      );

      return templates;
    } catch (err) {
      this.logger.error(
        `getEmailTemplates: Failed to get email templates`,
        err.stack,
      );
      throw err;
    }
  }

  async updateTemplateLanguage(
    template_language_key: string,
    updates: Partial<EmailTemplateLanguages>,
  ): Promise<EmailTemplateLanguages> {
    try {
      const templateLanguage =
        await this.emailTemplateLanguagesRepository.findOne({
          where: { template_language_key },
        });
      if (!templateLanguage) {
        throw new Error(
          `Email template language with key ${template_language_key} not found.`,
        );
      }

      Object.assign(templateLanguage, updates, {
        updated_at: new Date(),
      });

      return this.emailTemplateLanguagesRepository.save(templateLanguage);
    } catch (err) {
      this.logger.error(
        `updateTemplateLanguage: Failed to update email template with data: ${JSON.stringify(updates)} and key: ${template_language_key}`,
        err.stack,
      );
      throw err;
    }
  }
}
