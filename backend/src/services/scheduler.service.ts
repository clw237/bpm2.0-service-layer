import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSchedulerDto } from 'dtos';
import { Schedulers, UserPoolAttributesDef } from 'entities';
import { EmailCategoryScheduleTypeRepository } from 'repositories';
import { DataSource, Repository } from 'typeorm';
import { ISchedulerListItem } from '../interfaces';
import { LoggerService } from '../logger';

@Injectable()
export default class SchedulerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource,
    @InjectRepository(Schedulers)
    private readonly schedulerRepository: Repository<Schedulers>,
    @InjectRepository(UserPoolAttributesDef)
    private readonly UserPoolAttributesDefRepository: Repository<UserPoolAttributesDef>,
    @InjectRepository(EmailCategoryScheduleTypeRepository)
    private readonly emailCategoryScheduleTypeRepository: EmailCategoryScheduleTypeRepository,
  ) {}

  async getScheduleType(emailCategoryKey: string): Promise<any> {
    try {
      return await this.emailCategoryScheduleTypeRepository.getScheduleType(
        emailCategoryKey,
      );
    } catch (err) {
      this.logger.error(
        `Service: Failed to fetch email template for category ${emailCategoryKey}`,
        err.stack,
      );
      throw err;
    }
  }

  async createOrUpdateScheduler(dto: CreateSchedulerDto): Promise<Schedulers> {
    const { scheduler_key, scheduleData } = dto;

    let scheduler = scheduler_key
      ? await this.schedulerRepository.findOne({
          where: {
            scheduler_key: scheduler_key,
          },
        })
      : null;

    let result: Schedulers;
    if (scheduler) {
      result = this.schedulerRepository.merge(scheduler, {
        ...scheduleData,
        updated_at: new Date(),
      });
    } else {
      result = this.schedulerRepository.create({
        ...scheduleData,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return this.schedulerRepository.save(result);
  }

  async createOrUpdateSchedulers(
    dtos: CreateSchedulerDto[],
  ): Promise<Schedulers[]> {
    const results: Schedulers[] = [];
    for (const dto of dtos) {
      const result = await this.createOrUpdateScheduler(dto);
      results.push(result);
    }
    return results;
  }

  async getAllSchedulers(): Promise<Schedulers[]> {
    return await this.schedulerRepository.find();
  }

  async getSchedulerById(scheduler_key: string): Promise<Schedulers> {
    const scheduler = await this.schedulerRepository.findOne({
      where: { scheduler_key },
    });
    if (!scheduler) {
      throw new NotFoundException(
        `Scheduler with ID ${scheduler_key} not found`,
      );
    }
    return scheduler;
  }

  async getSchedulerByTypeAndTemplate(
    workspace_key: string,
    item_key: string,
  ): Promise<Schedulers[]> {
    const scheduler = await this.schedulerRepository.find({
      where: {
        workspace_key,
        item_key,
      },
    });

    if (!scheduler) {
      throw new NotFoundException(
        `Scheduler for ${workspace_key} and ${item_key} not found`,
      );
    }
    return scheduler;
  }

  // async updateScheduler(
  //   scheduler_key: string,
  //   updateDto: UpdateSchedulerDto,
  // ): Promise<Scheduler> {
  //   const scheduler = await this.getSchedulerById(scheduler_key);
  //   Object.assign(scheduler, updateDto);
  //   return this.schedulerRepository.save(scheduler);
  // }

  async deleteScheduler(scheduler_key: string): Promise<void> {
    const scheduler = await this.getSchedulerById(scheduler_key);
    await this.schedulerRepository.remove(scheduler);
  }

  async getSchedulerList(workspaceKey: string): Promise<ISchedulerListItem[]> {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select([
        's.scheduler_key as scheduler_key',
        's.workspace_key as workspace_key',
        's.template_key as template_key',
        's.item_key as item_key',
        's.schedule_json as schedule_json',
        // 's.max_occurrence as max_occurrence',
        's.item_type as item_type',
        't.schedule_type_code as schedule_type_code',
      ])
      .from('schedulers', 's')
      .innerJoin(
        'schedule_types',
        't',
        't.schedule_type_key = s.schedule_type_key',
      )
      .where('s.is_enabled = true')
      .andWhere('s.workspace_key = :workspaceKey', {
        workspaceKey: workspaceKey,
      })
      .andWhere('s.item_type = :itemType', { itemType: 'campaign' });

    const result = await queryBuilder.getRawMany();
    return result;
  }

  async getUserPoolAttributesDefMap(
    workspace_key: string,
  ): Promise<Map<string, string>> {
    //TODO: cache this
    const s = await this.UserPoolAttributesDefRepository.find({
      where: {
        workspace_key: workspace_key,
      },
    });

    let result = new Map();
    s.forEach((dynamic) => {
      result.set(
        dynamic.user_pool_attributes_def_code,
        dynamic.user_pool_attributes_def_key,
      );
    });
    return result;
  }
}
