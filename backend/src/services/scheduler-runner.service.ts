import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleTaskLogRepository } from 'repositories';
import { SchedulerStatusEnum } from '../config/constants';
import { LoggerService } from '../logger';
import { SchedulerFunctionsService } from '../services';

const SCHEDULER_SYNC_TASK_NAME = 'userPoolSchedulerSyncTaskName';

@Injectable()
export default class SchedulerRunnerService {
  private isRunning: Record<string, boolean> = {};
  constructor(
    private readonly logger: LoggerService,
    private readonly scheduleTaskLogRepository: ScheduleTaskLogRepository,

    @Inject(forwardRef(() => SchedulerFunctionsService))
    private readonly schedulerFunctionsService: SchedulerFunctionsService,
  ) {}

  async taskRunner(
    taskName: string,
    task: () => Promise<Record<string, any> | null>,
  ) {
    let logKey = '';

    if (this.isRunning[taskName] == true) {
      this.logger.warn(
        taskName + 'Task is already running, skipping this execution.',
      );
      return;
    }
    let result: Record<string, any> | null = null;

    try {
      this.isRunning[taskName] = true;

      const log = await this.scheduleTaskLogRepository.createScheduleTaskLog({
        schedule_task_name: taskName,
        status: SchedulerStatusEnum.STARTED,
      });

      logKey = log.schedule_task_log_key;

      result = await task();

      await this.scheduleTaskLogRepository.updateEndDate(
        logKey,
        SchedulerStatusEnum.COMPLETED,
        result ?? undefined,
      );
    } catch (error) {
      this.logger.error('Task failed:', error);
      console.log(error);

      await this.scheduleTaskLogRepository.updateEndDate(
        logKey,
        SchedulerStatusEnum.ERROR,
        {
          message: error.message,
          stack: error.stack,
        },
      );
    } finally {
      this.isRunning[taskName] = false;
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES, {
    name: SCHEDULER_SYNC_TASK_NAME,
  })
  async runSchedulerSync() {
    await this.taskRunner(SCHEDULER_SYNC_TASK_NAME, () => {
      //TODO: to run locally, remove this condition
      if (process.env.NODE_ENV === 'local') {
        return Promise.resolve({ env: process.env.NODE_ENV });
      }
      return this.schedulerFunctionsService.runScheduler();
    });
  }
}
