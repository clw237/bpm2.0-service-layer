import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class Email1Service {
  constructor(private readonly dataSource: DataSource) {}

  async getEmailStats(): Promise<Record<string, any>> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(*) as total_count',
        "SUM(CASE WHEN result_code = 'Bounce' THEN 1 ELSE 0 END) as bounce_count",
        "SUM(CASE WHEN result_code = 'Send' THEN 1 ELSE 0 END) as sent_count",
        "SUM(CASE WHEN result_code = 'Delivery' THEN 1 ELSE 0 END) as delivery_count",
        "SUM(CASE WHEN result_code = 'Open' THEN 1 ELSE 0 END) as open_count",
      ])
      .from('email_sent_results', 'esr')
      .getRawOne();

    return (
      result || {
        total_count: 0,
        bounce_count: 0,
        sent_count: 0,
        delivery_count: 0,
        open_count: 0,
      }
    );
  }

  async getBounceLogs(limit = 100): Promise<any[]> {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select(['es.email_address', 'es.bounced_at', 'esr.result'])
      .from('email_send', 'es')
      .innerJoin('email_sent_results', 'esr', 'es.message_id = esr.message_id')
      .where('esr.result_code = :resultCode', { resultCode: 'Bounce' })
      .orderBy('esr.created_at', 'DESC')
      .limit(limit);

    return queryBuilder.getRawMany();
  }
}
