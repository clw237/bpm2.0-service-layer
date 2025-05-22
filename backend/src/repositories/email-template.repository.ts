import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckTemplateNameDto } from 'dtos';
import { EmailTemplate, ItemType } from 'entities';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger';

@Injectable()
export default class EmailTemplateRepository extends Repository<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    private readonly logger: LoggerService,
  ) {
    super(EmailTemplate, emailTemplateRepository.manager);
  }

  async insertNewTemplate(
    templateData: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    const newTemplate = this.emailTemplateRepository.create(templateData);
    return this.save(newTemplate);
  }

  async getEmailTemplateByKey(templateKey: string): Promise<any> {
    try {
      const existingTemplate = await this.emailTemplateRepository.findOne({
        where: {
          template_key: templateKey,
        },
      });

      return existingTemplate;
    } catch (err) {
      this.logger.error(
        `getEmailTemplateById: Failed to get email templates for key ${templateKey}`,
        err.stack,
      );
      throw err;
    }
  }

  async getEmailTemplateByEmailCategoryKey(
    email_category_key: string,
  ): Promise<EmailTemplate | null> {
    try {
      const existingTemplate = await this.emailTemplateRepository.findOne({
        where: {
          email_category_key: email_category_key,
          item_type: ItemType.SYSTEM,
        },
      });

      return existingTemplate;
    } catch (err) {
      this.logger.error(
        `getEmailTemplateByEmailCategoryKey: Failed to get email templates for email_category_key ${email_category_key}`,
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
      // Early return if any required field is missing
      throw new Error(
        'Missing required fields: template_key, workspace_key, or item_key',
      );
    }

    const existingTemplate = await this.emailTemplateRepository.findOne({
      where: {
        template_name,
        workspace_key,
        item_key,
      },
    });

    return !!existingTemplate;
  }
}
