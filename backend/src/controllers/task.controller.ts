import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from 'services';

@ApiTags('task')
@Controller({
  path: '/',
})
export default class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Get all registered cron jobs
  @ApiOperation({
    summary: 'Get all Cron Jobs',
    description: 'Get the list of all registered cron jobs',
    operationId: 'taskGetAllJobs-campaign-edit',
  })
  @Get('getAllJobs')
  getAllJobs() {
    return this.taskService.getAllCronJobs();
  }

  // Get specific job status
  @ApiOperation({
    summary: 'Get a specific Cron Job',
    description: '',
    operationId: 'taskGetSpecificJob-campaign-edit',
  })
  @Get('getJobStatus/:name')
  getJob(@Param('name') name: string) {
    return this.taskService.getCronJobInfo(name);
  }

  // Start a job
  @ApiOperation({
    summary: 'Start a Cron Job',
    description: 'Start a Cron Job by supplying the job name',
    operationId: 'taskStartCronJob-campaign-edit',
  })
  @Post('jobOperation/:name/start')
  startJob(@Param('name') name: string) {
    return this.taskService.startCronJob(name);
  }

  // Stop a job
  @ApiOperation({
    summary: 'Stop a Cron Job',
    description: 'Stop a Cron Job by supplying the job name',
    operationId: 'taskStopCronJob-campaign-edit',
  })
  @Post('jobOperation/:name/stop')
  stopJob(@Param('name') name: string) {
    return this.taskService.stopCronJob(name);
  }
}
