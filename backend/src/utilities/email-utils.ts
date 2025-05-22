import { InjectDataSource } from '@nestjs/typeorm';
import { EmailCategory, EmailTemplate } from 'entities';
import { DataSource } from 'typeorm';
import { allowedEmailTemplateQueryFields } from '../config/constants';

interface QueryProps {
  templateKey?: string;
  languageCode?: string;
  workspaceKey?: string;
  emailCategoryKey?: string;
  itemKey?: string;
  itemType?: string;
  lang?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}

export default class EmailUtils {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getEmailTemplateDetails(queryProps: QueryProps) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select([
        'etl.template_key',
        'etl.language_code',
        'etl.subject',
        'etl.body',
        'etl.created_by_user',
        'etl.created_at',
        'etl.updated_by_user',
        'etl.updated_at',
        'et.template_name',
        'et.item_key',
        'et.item_type',
        'et.workspace_key',
        'ec.email_category_key',
        'ec.email_category_name',
        'ec.is_enabled',
      ])
      .from('email_template_languages', 'etl')
      .innerJoin(EmailTemplate, 'et', 'etl.template_key = et.template_key')
      .innerJoin(
        EmailCategory,
        'ec',
        'et.email_category_key = ec.email_category_key AND et.workspace_key = ec.workspace_key AND ec.is_display = true',
      );

    if (queryProps.templateKey) {
      queryBuilder.andWhere('etl.template_key = :templateKey', {
        templateKey: queryProps.templateKey,
      });
    }

    if (queryProps.languageCode) {
      queryBuilder.andWhere('etl.language_code = :languageCode', {
        languageCode: queryProps.languageCode,
      });
    }

    if (queryProps.workspaceKey) {
      queryBuilder.andWhere('et.workspace_key = :workspaceKey', {
        workspaceKey: queryProps.workspaceKey,
      });
    }

    if (queryProps.emailCategoryKey && queryProps.emailCategoryKey !== 'all') {
      queryBuilder.andWhere('et.email_category_key = :emailCategoryKey', {
        emailCategoryKey: queryProps.emailCategoryKey,
      });
    }

    if (queryProps.itemKey) {
      queryBuilder.andWhere('et.item_key = :itemKey', {
        itemKey: queryProps.itemKey,
      });
    }

    if (queryProps.itemType) {
      queryBuilder.andWhere('et.item_type = :itemType', {
        itemType: queryProps.itemType,
      });
    }

    if (queryProps.lang) {
      queryBuilder.andWhere('etl.language_code = :lang', {
        lang: queryProps.lang,
      });
    }

    if (queryProps.search) {
      queryBuilder.andWhere(
        '(LOWER(et.template_name) LIKE LOWER(:search) OR LOWER(ec.email_category_name) LIKE LOWER(:search) OR LOWER(etl.subject) LIKE LOWER(:search))',
        { search: `%${queryProps.search}%` },
      );
    }

    if (queryProps.limit) {
      queryBuilder.limit(queryProps.limit);
    }

    if (queryProps.offset) {
      queryBuilder.offset(queryProps.offset);
    }

    if (queryProps.sortBy && queryProps.sortOrder) {
      queryBuilder.orderBy(
        allowedEmailTemplateQueryFields[queryProps.sortBy] || 'etl.updated_at',
        queryProps.sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC',
      );
    } else {
      queryBuilder.orderBy('etl.updated_at', 'DESC');
    }

    const result = await queryBuilder.getRawMany();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_data, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      data: result.map((r) => ({
        template_key: r.etl_template_key,
        language_code: r.etl_language_code,
        subject: r.etl_subject,
        body: r.etl_body,
        created_by_user: r.created_by_user,
        created_at: r.etl_created_at,
        updated_by_user: r.updated_by_user,
        updated_at: r.etl_updated_at,
        template_name: r.et_template_name,
        item_key: r.et_item_key,
        item_type: r.et_item_type,
        workspace_key: r.ec_workspace_key,
        email_category_key: r.ec_email_category_key,
        email_category_name: r.ec_email_category_name,
        is_enabled: r.ec_is_enabled,
      })),
    };
  }

  // Helper function to check if a date is in DST in a specific timezone
  isDaylightSavingTime(date, timeZone) {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);

    const janOffset = this.getTimezoneOffset(jan, timeZone);
    const julOffset = this.getTimezoneOffset(jul, timeZone);

    const currentOffset = this.getTimezoneOffset(date, timeZone);

    // If January and July have different offsets, DST is observed
    if (janOffset !== julOffset) {
      // Northern hemisphere has DST in summer (smaller offset)
      // Southern hemisphere has DST in winter (smaller offset)
      const summerOffset = Math.min(janOffset, julOffset);
      return currentOffset === summerOffset;
    }

    return false;
  }

  // Helper function to get timezone offset in minutes for a date in a specific timezone
  getTimezoneOffset(date, timeZone) {
    // Create a date string in the target timezone
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));

    // Get UTC timestamp for both dates and calculate the difference in minutes
    const diff = (tzDate.getTime() - date.getTime()) / 60000;

    return diff;
  }
}
