import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export default class EmailCategoryScheduleTypeRepository extends Repository<any> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    super(EmailCategoryScheduleTypeRepository, dataSource.manager);
  }

  async getScheduleType(email_category_key: string): Promise<any> {
    try {
      return await this.dataSource
        .createQueryBuilder()
        .select([
          'ecst.schedule_type_key as schedule_type_key',
          'ecst.email_category_key as email_category_key',
          'ecst.sort_order as sort_order',
          'ecst.schedule_display_name as schedule_display_name',
          'st.meatadata as metadata',
        ])
        .from('email_category_schedule_type', 'ecst')
        .innerJoin(
          'schedule_types',
          'st',
          'ecst.schedule_type_key = st.schedule_type_key',
        )
        .where('ecst.email_category_key = :email_category_key', {
          email_category_key,
        })
        .andWhere('ecst.schedule_display_name IS NOT NULL')
        .orderBy('ecst.sort_order', 'ASC')
        .getRawMany();
    } catch (err) {
      this.logger.error(
        `getScheduleType: Failed to get schedule type for category ${email_category_key}`,
        err.stack,
      );
      throw err;
    }
  }
}
