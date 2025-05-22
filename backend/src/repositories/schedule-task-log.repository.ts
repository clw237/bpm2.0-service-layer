import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerStatusEnum } from '../config/constants';
import { ScheduleTaskLog } from '../entities';

import { LoggerService } from '../logger';

@Injectable()
export default class ScheduleTaskLogRepository {
  constructor(
    @InjectRepository(ScheduleTaskLog)
    private scheduleTaskLogRepository: Repository<ScheduleTaskLog>,
    private readonly logger: LoggerService,
  ) {}

  async createScheduleTaskLog(
    data: Partial<ScheduleTaskLog>,
  ): Promise<ScheduleTaskLog> {
    try {
      const newRow = this.scheduleTaskLogRepository.create({
        ...data,
      });
      return await this.scheduleTaskLogRepository.save(newRow);
    } catch (err) {
      this.logger.error(
        `Failed to create ScheduleTaskLog with data: ${JSON.stringify(data)}`,
        err.stack,
      );
      throw err;
    }
  }

  async updateEndDate(
    logKey: string,
    status: SchedulerStatusEnum,
    result?: Record<string, any>,
  ): Promise<void> {
    await this.scheduleTaskLogRepository.update(logKey, {
      ended_at: new Date().toISOString(),
      status,
      result,
    });
  }
}
