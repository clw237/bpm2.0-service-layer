import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_send')
export default class EmailSend {
  @PrimaryGeneratedColumn('uuid')
  email_send_key: string;

  @Column()
  email_address: string;

  @Column('uuid')
  template_key: string;

  @Column()
  language_code: string;

  @Column({ type: 'varchar', nullable: true })
  message_id: string | null;

  @Column('uuid')
  workspace_user_key: string;

  @Column()
  status: string;

  @Column()
  data: string;

  @Column()
  error: string;

  @Column('jsonb', { nullable: true })
  meta_data: JSON | null;

  @Column('boolean', { nullable: true })
  is_delivered: boolean | null;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date | null;

  @Column('boolean', { nullable: true })
  is_bounced: boolean | null;

  @Column({ type: 'timestamp', nullable: true })
  bounced_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by_user: string | null;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by_user: string | null;
}
