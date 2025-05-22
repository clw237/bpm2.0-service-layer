import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserPool } from '../entities/index';

@Injectable()
export default class UserPoolRepository extends Repository<UserPool> {
  constructor(private dataSource: DataSource) {
    super(UserPool, dataSource.createEntityManager());
  }

  async getUserPool(
    workspace_key: string,
    workspace_user_key: string,
  ): Promise<UserPool | null> {
    return this.createQueryBuilder('user_pool')
      .where('user_pool.workspace_key = :workspace_key', { workspace_key })
      .andWhere('user_pool.workspace_user_key = :workspace_user_key', {
        workspace_user_key,
      })
      .getOne();
  }

  async getUserPoolByWorkSpaceKey(
    workspace_key: string,
  ): Promise<UserPool | null> {
    return this.createQueryBuilder('user_pool')
      .where('user_pool.workspace_key = :workspace_key', { workspace_key })
      .getOne();
  }

  async addRecord(
    workspace_key: string,
    workspace_user_key: string,
    email_address: string,
    first_name: string,
    last_name: string,
  ): Promise<InsertResult | null> {
    const values: UserPool = {
      user_pool_key: uuidv4(),
      workspace_key,
      workspace_user_key,
      email_address,
      first_name,
      last_name,
    };
    return this.createQueryBuilder('user_pool')
      .insert()
      .into('user_pool')
      .values(values)
      .returning('*')
      .execute();
  }
}
