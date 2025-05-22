import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'schedule_task_log' })
export default class ScheduleTaskLog {
  @PrimaryGeneratedColumn('uuid')
  schedule_task_log_key: string = uuidv4();

  @Column({ type: 'varchar', length: 120 })
  schedule_task_name: string;

  @Column({
    type: 'enum',
    enumName: 'schedule_task_status',
    nullable: true,
  })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  started_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  ended_at?: Date;
}
