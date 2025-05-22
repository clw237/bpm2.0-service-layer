import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CheckTemplateNameDto,
  CreateCombinedEmailTemplateDto,
  EmailTemplatesDto,
  UpdateEmailTemplateLanguagesDto,
} from 'dtos';
import { EmailTemplate, EmailTemplateLanguages, Schedulers } from 'entities';
import {
  EmailCategoryRepository,
  EmailTemplateRepository,
  WorkspaceRepository,
} from 'repositories';
import { ItemType } from 'src/entities/email-template.entity';
import { DataSource } from 'typeorm';
import { EmailUtils } from 'utilities';
import { LoggerService } from '../logger';
import { EmailTemplateLanguagesRepository } from './../repositories/email-template-languages.repository';
import AppConfigService from './app-config.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailUtils: EmailUtils,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
    private readonly emailTemplateLanguagesRepository: EmailTemplateLanguagesRepository,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    private readonly emailCategoryRepository: EmailCategoryRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly appConfigService: AppConfigService,
  ) {}

  async createEmailTemplate(
    createCombineEmailTemplateDto: CreateCombinedEmailTemplateDto,
  ): Promise<EmailTemplateLanguages> {
    try {
      return await this.emailTemplateLanguagesRepository.createEmailTemplateLanguage(
        createCombineEmailTemplateDto,
      );
    } catch (err) {
      this.logger.error('Services: Failed to create user', err.stack);
      throw err;
    }
  }

  async getEmailTemplateById(
    template_key: string,
    language_code: string,
    email_category_key?: string,
  ): Promise<any> {
    try {
      return await this.emailTemplateLanguagesRepository.getEmailTemplateById(
        template_key,
        language_code,
        email_category_key,
      );
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email template for key ${template_key} and language ${language_code}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplates(body: EmailTemplatesDto[]): Promise<any> {
    try {
      return await this.emailTemplateLanguagesRepository.getEmailTemplates(
        body,
      );
    } catch (err) {
      this.logger.error(`Services: Failed to fetch email templates`, err.stack);
      throw err;
    }
  }

  async getEmailTemplateByLanguage(
    template_key: string,
    language_code: string,
  ): Promise<any> {
    try {
      const queryBuilder = this.dataSource
        .createQueryBuilder()
        .select([
          'etl.template_key as template_key',
          'etl.language_code  as template_key',
          'subject',
          'body',
        ])
        .from('email_template_languages', 'etl')
        .innerJoin(EmailTemplate, 'et', 'etl.template_key = et.template_key');

      queryBuilder.andWhere('etl.template_key = :templateKey', {
        templateKey: template_key,
      });

      queryBuilder.andWhere('etl.language_code = :languageCode', {
        languageCode: language_code,
      });

      const result = await queryBuilder.getRawOne();

      return result;
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email template for key ${template_key} and language ${language_code}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplateByKey(template_key: string): Promise<any> {
    try {
      return await this.emailTemplateRepository.getEmailTemplateByKey(
        template_key,
      );
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email template for key ${template_key}`,
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
      return await this.emailTemplateLanguagesRepository.getEmailTemplate(
        emailCategoryKey,
        workspaceKey,
        itemKey,
        lang,
        page,
        limit,
        sortBy,
        sortOrder,
      );
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email template for category ${emailCategoryKey}`,
        err.stack,
      );
      console.log('getEmailTemplate', err.message);
      console.log('getEmailTemplate', err.stack);
      throw err;
    }
  }

  async searchEmailTemplates(
    search: string,
    emailCategoryKey?: string,
    workspaceKey?: string,
    itemKey?: string,
    lang?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<Record<string, any>> {
    return await this.emailUtils.getEmailTemplateDetails({
      search,
      emailCategoryKey,
      workspaceKey,
      itemKey,
      lang,
      ...(page && limit ? { limit, offset: (page - 1) * limit } : {}),
      sortBy,
      sortOrder,
    });
  }

  async getEmailCategory(workspaceKey: string): Promise<any> {
    try {
      return await this.emailCategoryRepository.getEmailCategory(workspaceKey);
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email category ${workspaceKey}`,
        err.stack,
      );
      throw err;
    }
  }

  async getWorkspaceKey(workspace_name: string): Promise<any> {
    try {
      return await this.workspaceRepository.getWorkspaceByName(workspace_name);
    } catch (err) {
      this.logger.error(
        `Services: Failed to fetch email workspaceKey`,
        err.stack,
      );
      throw err;
    }
  }

  async checkIfTemplateNameExists({
    template_name,
    workspace_key,
    item_key,
  }: CheckTemplateNameDto): Promise<boolean> {
    if (!template_name || !workspace_key || !item_key) {
      throw new Error(
        'Services: Missing required fields: template_name, workspace_key, or item_key',
      );
    }

    const template =
      await this.emailTemplateRepository.checkIfTemplateNameExists({
        template_name,
        workspace_key,
        item_key,
      });
    return Boolean(template);
  }

  async updateEmailTemplateLanguage(
    template_language_key: string,
    updateDto: UpdateEmailTemplateLanguagesDto,
  ): Promise<EmailTemplateLanguages> {
    try {
      const updatedEmailTemplate =
        await this.emailTemplateLanguagesRepository.updateTemplateLanguage(
          template_language_key,
          {
            ...updateDto,
            updated_at: new Date(),
          },
        );

      if (updateDto.template_key) {
        const existingTemplate = await this.emailTemplateRepository.findOne({
          where: { template_key: updateDto.template_key },
        });

        if (existingTemplate) {
          existingTemplate.template_name = existingTemplate.template_name;
          existingTemplate.updated_by_user = updateDto.updated_by_user!;
          existingTemplate.updated_at = new Date();

          await this.emailTemplateRepository.save(existingTemplate);
        }
      } else {
        const newEmailTemplate = this.emailTemplateRepository.create({
          template_name: updateDto.template_name,
          workspace_key: updateDto.workspace_key,
          item_key: updateDto.item_key,
          item_type: updateDto.item_type,
          created_by_user: updateDto.created_by_user,
          created_at: new Date(),
        });

        await this.emailTemplateRepository.save(newEmailTemplate);
      }

      return updatedEmailTemplate;
    } catch (error) {
      throw new Error(
        `Services: Failed to update email template language: ${error.message}`,
      );
    }
  }

  async updateOrCreateEmailTemplateAndLanguages(
    dto: UpdateEmailTemplateLanguagesDto,
  ): Promise<{
    template: EmailTemplate;
    emailTemplateLanguage: EmailTemplateLanguages;
  }> {
    try {
      const {
        template_key,
        email_category_key,
        workspace_key,
        item_key,
        item_type,
        template_name,
        language_code,
        subject,
        body,
        updated_by_user,
        created_by_user,
      } = dto;

      const emailTemplateRepo = this.dataSource.getRepository(EmailTemplate);
      const emailTemplateLanguagesRepo = this.dataSource.getRepository(
        EmailTemplateLanguages,
      );

      let template = await emailTemplateRepo.findOne({
        where: { template_key, workspace_key, item_key },
      });

      if (template && template_key) {
        template.template_name = template_name ?? template.template_name;
        template.email_category_key =
          email_category_key ?? template.email_category_key;
        template.updated_at = new Date();
        template.updated_by_user = updated_by_user ?? template.updated_by_user;
      } else {
        template = emailTemplateRepo.create({
          template_name,
          email_category_key,
          workspace_key,
          item_key,
          item_type,
          created_by_user,
          updated_by_user,
        });
      }

      const savedTemplate = await emailTemplateRepo.save(template);

      let savedEmailTemplateLanguage = await emailTemplateLanguagesRepo.findOne(
        {
          where: { template_key: savedTemplate.template_key, language_code },
        },
      );

      if (savedEmailTemplateLanguage) {
        savedEmailTemplateLanguage.subject =
          subject ?? savedEmailTemplateLanguage.subject;
        savedEmailTemplateLanguage.body =
          body ?? savedEmailTemplateLanguage.body;
        savedEmailTemplateLanguage.updated_at = new Date();
        savedEmailTemplateLanguage.updated_by_user =
          updated_by_user ?? savedEmailTemplateLanguage.updated_by_user;
      } else {
        savedEmailTemplateLanguage = emailTemplateLanguagesRepo.create({
          template_key: savedTemplate.template_key,
          language_code,
          subject,
          body,
          created_by_user,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      const emailTemplateLanguage = await emailTemplateLanguagesRepo.save(
        savedEmailTemplateLanguage,
      );

      return { template: savedTemplate, emailTemplateLanguage };
    } catch (error) {
      throw new Error(
        `Services: Failed to update or create email template and languages: ${error.message}`,
      );
    }
  }

  async deleteEmailTemplate(templateKey: string): Promise<boolean> {
    const emailTemplateRepo = this.dataSource.getRepository(EmailTemplate);
    const emailTemplateLanguagesRepo = this.dataSource.getRepository(
      EmailTemplateLanguages,
    );
    const schedulerRepo = this.dataSource.getRepository(Schedulers);

    // Check if the template exists in the schedulers table
    const schedulerCount = await schedulerRepo.count({
      where: { template_key: templateKey },
    });

    if (schedulerCount > 0) {
      throw new HttpException(
        'Template is used in schedulers and cannot be deleted',
        HttpStatus.CONFLICT,
      );
    }

    const defaultTemplate = await emailTemplateRepo.findOne({
      where: { template_key: templateKey, item_type: ItemType.SYSTEM },
    });

    if (defaultTemplate) {
      throw new HttpException(
        'Cannot delete default template',
        HttpStatus.FORBIDDEN,
      );
    }

    await emailTemplateLanguagesRepo.delete({
      template_key: templateKey,
    });

    const result = await emailTemplateRepo.delete({
      template_key: templateKey,
    });

    return (result?.affected ?? 0) > 0;
  }

  async deleteEmailTemplates(
    templateKeys: string[],
  ): Promise<Record<string, any>> {
    const errors: Record<string, any> = {};
    const results: Record<string, any> = {};

    await Promise.all(
      templateKeys.map(async (templateKey) => {
        try {
          results[templateKey] = await this.deleteEmailTemplate(templateKey);
        } catch (error) {
          errors[templateKey] = error.message;
        }
      }),
    );

    return { errors, results };
  }
}
