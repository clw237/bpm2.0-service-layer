import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSchedulerDto } from 'dtos';
import { Schedulers } from 'entities';
import { SchedulerService } from 'services';
import { LoggerService } from '../logger';

@ApiTags('emailscheduler')
@Controller({
  path: 'emailscheduler',
  version: '1',
})
export default class SchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly logger: LoggerService,
  ) {}

  @Post('create-or-update-scheduler')
  @ApiOperation({
    summary: 'createOrUpdateScheduler',
    description: 'Create or update a scheduler',
    operationId: 'createOrUpdateScheduler-emailtemplate-add',
  })
  @ApiCreatedResponse({
    description: 'The Scheduler has been successfully created or updated.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createOrUpdateScheduler(
    @Body() dto: CreateSchedulerDto | CreateSchedulerDto[],
  ): Promise<Schedulers | Schedulers[]> {
    if (Array.isArray(dto)) {
      return await this.schedulerService.createOrUpdateSchedulers(dto);
    } else {
      return await this.schedulerService.createOrUpdateScheduler(dto);
    }
  }

  @Get('all-schedulers')
  @ApiOperation({
    summary: 'getAllSchedulers',
    description: 'getAllSchedulers',
    operationId: 'getAllSchedulers-emailtemplate-lists',
  })
  @ApiCreatedResponse({
    description: 'Fetched all schedulers.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getAllSchedulers(): Promise<Schedulers[]> {
    return this.schedulerService.getAllSchedulers();
  }

  //@Get('/scheduler/:scheduler_key')
  @Get('/scheduler')
  @ApiOperation({
    summary: 'getSchedulerById',
    description: 'getSchedulerById',
    operationId: 'getSchedulerById-emailtemplate-view',
  })
  @ApiCreatedResponse({
    description: 'Fetched scheduler by ID.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getSchedulerById(
    @Query('scheduler_key') scheduler_key: string,
    @Query('workspace_key') workspace_key: string,
    @Query('item_key') item_key: string,
  ): Promise<Schedulers | Schedulers[]> {
    if (scheduler_key && scheduler_key !== 'null') {
      return this.schedulerService.getSchedulerById(scheduler_key);
    }

    return this.schedulerService.getSchedulerByTypeAndTemplate(
      workspace_key,
      item_key,
    );
  }

  // @Patch(':scheduler_key')
  // @ApiOperation({
  //   summary: 'updateScheduler',
  //   description: 'updateScheduler',
  //   operationId: 'updateScheduler-emailtemplate-edit',
  // })
  // @ApiCreatedResponse({
  //   description: 'The Scheduler has been successfully updated.',
  // })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // updateScheduler(
  //   @Param('scheduler_key') scheduler_key: string,
  //   @Body() updateSchedulerDto: UpdateSchedulerDto,
  // ): Promise<Scheduler> {
  //   return this.schedulerService.updateScheduler(
  //     scheduler_key,
  //     updateSchedulerDto,
  //   );
  // }

  @Delete(':scheduler_key')
  @ApiOperation({
    summary: 'deleteScheduler',
    description: 'deleteScheduler',
    operationId: 'deleteScheduler-emailtemplate-edit',
  })
  @ApiCreatedResponse({
    description: 'The Scheduler has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  deleteScheduler(
    @Param('scheduler_key') scheduler_key: string,
  ): Promise<void> {
    return this.schedulerService.deleteScheduler(scheduler_key);
  }

  // @Get('/type/email-category/:email_category_key')
  @Get('/type/email-category')
  @ApiOperation({
    summary: 'getScheduleType',
    description: 'getScheduleType',
    operationId: 'getScheduleType-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getScheduleType(
    @Query('email_category_key') emailCategoryKey: string,
  ): Promise<any> {
    return this.schedulerService.getScheduleType(emailCategoryKey);
  }
}
