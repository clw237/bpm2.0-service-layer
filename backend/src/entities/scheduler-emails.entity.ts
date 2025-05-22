import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('scheduler_emails')
export default class SchedulerEmails {
  @PrimaryGeneratedColumn('uuid')
  scheduler_email_key: string;

  @Column()
  email_address: string;

  @Column('uuid')
  template_key: string;

  @Column('uuid')
  scheduler_key: string;

  @Column()
  language_code: string;

  @Column({ type: 'varchar' })
  unique_key: string | null;

  @Column()
  status: string;

  @Column()
  data: string;

  @Column()
  error: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by_user: string | null;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by_user: string | null;
}
