import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPoolAttributesDef } from '../entities/index';

@Injectable()
export default class UserPoolAttributesDefRepository extends Repository<UserPoolAttributesDef> {
  constructor(private dataSource: DataSource) {
    super(UserPoolAttributesDef, dataSource.createEntityManager());
  }

  async getUserPoolAttribueDef(
    type: string,
  ): Promise<UserPoolAttributesDef | null> {
    return this.createQueryBuilder('user_pool_attributes_def')
      .where('user_pool_attributes_def.user_pool_attributes_def_code = :type', {
        type,
      })
      .getOne();
  }
}
