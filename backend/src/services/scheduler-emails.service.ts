import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { SchedulerEmailsRepository } from '../repositories/index';

@Injectable()
export class SchedulerEmailsService {
  constructor(
    private readonly schedulerEmailsRepository: SchedulerEmailsRepository,
  ) {}

  async addRecord(
    email_address: string,
    template_key: string,
    scheduler_key: string,
    language_code: string,
    unique_key,
    status: string,
    data: string,
    error: string,
  ): Promise<string | null> {
    const email_send_key = await this.schedulerEmailsRepository.addRecord(
      email_address,
      template_key,
      scheduler_key,
      language_code,
      unique_key,
      status,
      data,
      error,
    );
    if (!email_send_key) {
      throw new BadRequestException(`Scheduler emails add record failed`);
    }
    return email_send_key;
  }

  async updateRecord(
    scheduler_email_key: string,
    status: string,
    error: string | null,
    data?: string | null,
  ): Promise<UpdateResult | null> {
    const updateData: any = {
      status,
      error,
      updated_at: new Date(),
    };

    if (data) {
      updateData.data = data;
    }

    console.log('scheduler_email_key >>', scheduler_email_key);

    const scheduler_emails_updateRecord =
      await this.schedulerEmailsRepository.update(
        { scheduler_email_key },
        updateData,
      );

    if (
      !scheduler_emails_updateRecord.affected ||
      scheduler_emails_updateRecord.affected === 0
    ) {
      throw new BadRequestException(`Scheduler email update record failed`);
    }

    return scheduler_emails_updateRecord;
  }
}
