import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { EmailSentResults } from '../entities/index';

@Injectable()
export default class EmailSentResultsRepository extends Repository<EmailSentResults> {
  constructor(private dataSource: DataSource) {
    super(EmailSentResults, dataSource.createEntityManager());
  }

  async addRecord(
    message_id: string,
    email_send_key: string,
    result_code: string,
    result: string,
  ): Promise<InsertResult | null> {
    const values: any = {
      email_send_key,
      message_id,
      result,
      result_code,
    };

    return this.createQueryBuilder('email_sent_results')
      .insert()
      .into('email_sent_results')
      .values(values)
      .execute();
  }
}
