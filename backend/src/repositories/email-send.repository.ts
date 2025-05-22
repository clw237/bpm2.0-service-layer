import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmailSend } from '../entities/index';

@Injectable()
export default class EmailSendRepository extends Repository<EmailSend> {
  constructor(private dataSource: DataSource) {
    super(EmailSend, dataSource.createEntityManager());
  }

  async getEmailSend(template_key: string): Promise<EmailSend | null> {
    return this.createQueryBuilder('email_send')
      .where('email_send.email_send_key = :template_key', { template_key })
      .getOne();
  }

  async getEmailSends(): Promise<EmailSend[] | null> {
    return this.createQueryBuilder('email_send').getMany();
  }

  async getEmailSendByMessageId(message_id): Promise<EmailSend | null> {
    return this.createQueryBuilder('email_send')
      .where('email_send.message_id = :message_id', { message_id })
      .getOne();
  }

  async addRecord(
    email_send_key: string,
    email_address: string,
    template_key: string,
    language_code: string,
    message_id: string | null,
    workspace_user_key: string,
    status: string,
    data: string,
    error: string,
    meta_data: JSON | null = null,
    is_delivered: boolean | null = null,
    delivered_at: Date | null = null,
    is_bounced: boolean | null = null,
    bounced_at: Date | null = null,
  ): Promise<{
    success: boolean;
    email_send_key: string | null;
    message: string | null;
  } | null> {
    try {
      const values: EmailSend = {
        email_send_key: email_send_key,
        email_address,
        template_key,
        language_code,
        message_id,
        workspace_user_key,
        status,
        data,
        error,
        meta_data,
        is_delivered,
        delivered_at,
        is_bounced,
        bounced_at,
        created_at: new Date(),
        created_by_user: null,
        updated_at: null,
        updated_by_user: null,
      };
      await this.createQueryBuilder('email_send')
        .insert()
        .into('email_send')
        .values(values)
        //.returning('email_send_key')
        .execute();
      return { success: true, email_send_key, message: null };
    } catch (error) {
      if (error.code === '23505') {
        // Postgres duplicate key error code
        return {
          success: false,
          email_send_key: null,
          message: 'Duplicate email send record',
        };
      }
      console.error('Error adding email send record:', error);
      throw error;
    }
  }
}
