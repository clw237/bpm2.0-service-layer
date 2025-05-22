import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'logs' })
export default class Log {
  @PrimaryGeneratedColumn('uuid')
  log_key: string;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  context: string;

  @Column({ nullable: true })
  loggend_in_user_key?: string;

  @Column({ nullable: true })
  user_key_in_context?: string;

  @Column({ nullable: true })
  ip_address?: string;
}
