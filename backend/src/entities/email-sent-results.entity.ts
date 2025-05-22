import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_sent-results')
export default class EmailSentResults {
  @PrimaryGeneratedColumn('uuid')
  result_key: string;

  @Column('uuid')
  email_send_key: string;

  @Column()
  message_id: string;

  @Column()
  result: string;

  @Column()
  result_code: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  created_by_user: string;

  @UpdateDateColumn()
  updated_at: Date | null;

  @Column()
  updated_by_user: string;
}
