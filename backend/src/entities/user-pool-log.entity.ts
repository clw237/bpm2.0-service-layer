import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_pool_log' })
export default class UserPoolLog {
  @PrimaryGeneratedColumn()
  user_pool_log_key: string;

  @Column({ type: 'uuid', nullable: true })
  workspace_key: string | null;

  @Column({ type: 'uuid', nullable: true })
  workspace_user_key: string | null;

  @Column()
  status: string;

  @Column()
  data: string;

  @Column()
  error: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by_user?: string | null;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by_user?: string | null;
}
