import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SchedulerEmails } from '../entities/index';

@Injectable()
export default class SchedulerEmailsRepository extends Repository<SchedulerEmails> {
  constructor(private dataSource: DataSource) {
    super(SchedulerEmails, dataSource.createEntityManager());
  }

  async addRecord(
    email_address: string,
    template_key: string,
    scheduler_key: string,
    language_code: string,
    unique_key: string | null,
    status: string,
    data: string,
    error: string,
  ): Promise<string | null> {
    const scheduler_email_key = uuidv4();
    const values: SchedulerEmails = {
      scheduler_email_key: scheduler_email_key,
      email_address,
      template_key,
      scheduler_key,
      language_code,
      unique_key,
      status,
      data,
      error,
      created_at: new Date(),
      created_by_user: null,
      updated_at: null,
      updated_by_user: null,
    };
    await this.createQueryBuilder('scheduler_emails')
      .insert()
      .into('scheduler_emails')
      .values(values)
      .execute();

    return scheduler_email_key;
  }
}
