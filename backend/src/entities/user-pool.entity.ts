import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_pool' })
export default class UserPool {
  @PrimaryGeneratedColumn()
  user_pool_key: string;

  @Column({ type: 'uuid' })
  workspace_key: string;

  @Column({ type: 'uuid' })
  workspace_user_key: string;

  @Column({ type: 'varchar' })
  email_address: string;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

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
