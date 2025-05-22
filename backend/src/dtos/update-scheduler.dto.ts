import { PartialType } from '@nestjs/swagger';
import CreateSchedulerDto from './create-scheduler.dto';

export default class UpdateSchedulerDto extends PartialType(
  CreateSchedulerDto,
) {}
