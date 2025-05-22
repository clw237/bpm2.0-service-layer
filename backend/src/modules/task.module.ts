import { Module } from '@nestjs/common';
import { TaskController } from 'controllers';
import { TaskService } from 'services';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export default class TaskModule {}
