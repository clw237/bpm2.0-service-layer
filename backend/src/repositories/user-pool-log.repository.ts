import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserPoolLog } from '../entities/index';

@Injectable()
export default class UserPoolLogRepository extends Repository<UserPoolLog> {
  constructor(private dataSource: DataSource) {
    super(UserPoolLog, dataSource.createEntityManager());
  }

  async addRecord(
    workspace_key: string | null,
    workspace_user_key: string | null,
    status: string,
    error: string,
    data: string,
  ): Promise<InsertResult | null> {
    const values: UserPoolLog = {
      user_pool_log_key: uuidv4(),
      workspace_key,
      workspace_user_key,
      status,
      data,
      error,
    };
    return this.createQueryBuilder('user_pool_log')
      .insert()
      .into('user_pool_log')
      .values(values)
      .returning('user_pool_log_key')
      .execute();
  }

  async updateRecord(
    user_pool_log_key: string,
    status: string,
    error: string,
    data: string,
  ): Promise<void> {
    const updateData: any = {
      status,
      error,
      updated_at: new Date(),
    };

    console.log('user_pool_log_key >>');
    console.log(user_pool_log_key);

    if (data) {
      updateData.data = data;
    }

    const user_pool_log_record = await this.update(
      { user_pool_log_key },
      updateData,
    );

    if (!user_pool_log_record.affected || user_pool_log_record.affected === 0) {
      throw new BadRequestException(`User pool log update record failed`);
    }
  }
}
