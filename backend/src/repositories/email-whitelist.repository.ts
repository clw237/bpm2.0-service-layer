import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmailWhiteList } from '../entities/index';

@Injectable()
export default class EmailWhiteListRepository extends Repository<EmailWhiteList> {
  constructor(private dataSource: DataSource) {
    super(EmailWhiteList, dataSource.createEntityManager());
  }

  async getWhiteListEmail(email: string): Promise<EmailWhiteList | null> {
    return this.createQueryBuilder('invitations')
      .where('invitations.email = :email', { email })
      .getOne();
  }

  async addRecord(email: string): Promise<string | null> {
    const values: EmailWhiteList = {
      email,
    };
    await this.createQueryBuilder('whitelist')
      .insert()
      .into('whitelist')
      .values(values)
      .execute();

    return email;
  }
}
