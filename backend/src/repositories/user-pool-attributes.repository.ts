import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserPoolAttributes } from '../entities/index';

@Injectable()
export default class UserPoolAttributesRepository extends Repository<UserPoolAttributes> {
  constructor(private dataSource: DataSource) {
    super(UserPoolAttributes, dataSource.createEntityManager());
  }

  async getUserPoolAttributes(
    user_pool_attributes_def_key: string,
    userPoolKey: string,
  ): Promise<UserPoolAttributes | null> {
    return this.createQueryBuilder('user_pool_attributes')
      .where(
        'user_pool_attributes.user_pool_attribute_def_key = :user_pool_attributes_def_key',
        { user_pool_attributes_def_key },
      )
      .andWhere('user_pool_attributes.user_pool_key = :userPoolKey', {
        userPoolKey,
      })
      .getOne();
  }

  async addRecord(
    user_pool_key: string,
    user_pool_attribute_def_key: string,
    user_pool_attribute_def_type: string,
    event_key: string,
    value: string,
  ): Promise<InsertResult | null> {
    const values: UserPoolAttributes = {
      user_pool_attribute_key: uuidv4(),
      user_pool_key,
      user_pool_attribute_def_key,
      event_key,
      value,
      value_dt: user_pool_attribute_def_type === 'datetime' ? value : null,
      created_at: new Date(),
      created_by_user: uuidv4(),
      updated_at: null,
      updated_by_user: null,
    };
    return this.createQueryBuilder('user_pool_attributes')
      .insert()
      .into('user_pool_attributes')
      .values(values)
      .returning('*')
      .execute();
  }

  async updateRecord(
    user_pool_attribute_key: string,
    updateData: Partial<{
      value: string;
      user_pool_attribute_def_type?: string;
      event_key?: string;
    }>,
  ): Promise<UpdateResult> {
    const updateValues: Partial<UserPoolAttributes> = {
      updated_at: new Date(),
    };

    if (updateData.value !== undefined) {
      updateValues.value = updateData.value;
    }

    // Perform the update operation
    return this.createQueryBuilder('user_pool_attributes')
      .update('user_pool_attributes')
      .set(updateValues)
      .where('user_pool_attribute_key = :key', { key: user_pool_attribute_key })
      .returning('*')
      .execute();
  }
}
