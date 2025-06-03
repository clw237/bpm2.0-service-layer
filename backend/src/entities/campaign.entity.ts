import { Column, Entity, OneToMany } from 'typeorm';
import { Participant } from './participant.entity';

@Entity()
export class Campaign {
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

  @OneToMany(() => Participant, (participant) => participant.campaign)
  participants: Participant[];

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSync: Date;
}
