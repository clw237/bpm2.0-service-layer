import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from './';

@Entity()
export default class Campaign {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column({ name: 'reminder_offset_days' })
  reminderDaysBefore: number;

  @Column({ name: 'max_retry_count' })
  maxRetries: number;

  @Column({ name: 'retry_interval_days' })
  retryIntervalDays: number;

  @ManyToMany(() => User, (user) => user.campaigns)
  participants: User[];

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSync: Date;
}
