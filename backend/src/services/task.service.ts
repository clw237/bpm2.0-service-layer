import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export default class TaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getAllCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    console.log('jobs() >>');
    console.log(jobs);
    const jobList: any[] = [];
    console.log(`Total jobs: ${jobs.size}`);
    for (const [name, job] of jobs.entries()) {
      console.log(`Processing job: ${name}`);
      jobList.push({
        name,
        running: !!job.running,
        cronTime: String(job.cronTime?.source || job.cronTime || 'Unknown'),
        nextDate: job.nextDate() ? String(job.nextDate()) : null,
      });
    }

    return {
      success: true,
      jobs: jobList,
      count: jobList.length,
    };
  }

  getCronJobInfo(name: string) {
    console.log('name >>', name);
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      return {
        success: true,
        job: {
          name,
          running: job.running,
          cronTime: job.cronTime.source,
          nextDate: job.nextDate(),
        },
      };
    } catch {
      throw new NotFoundException(`Job ${name} not found`);
    }
  }

  startCronJob(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (job.running) {
        return {
          success: true,
          message: `Job ${name} is already running`,
        };
      }
      job.start();
      return {
        success: true,
        message: `Job ${name} started successfully`,
      };
    } catch {
      throw new NotFoundException(`Job ${name} not found`);
    }
  }

  stopCronJob(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job.running) {
        return {
          success: true,
          message: `Job ${name} is already stopped`,
        };
      }
      job.stop();
      return {
        success: true,
        message: `Job ${name} stopped successfully`,
      };
    } catch {
      throw new NotFoundException(`Job ${name} not found`);
    }
  }
}
