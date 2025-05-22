import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_pool_attributes' })
export default class UserPoolAttributes {
  @PrimaryGeneratedColumn()
  user_pool_attribute_key: string;

  @Column({ type: 'uuid' })
  user_pool_key: string;

  @Column({ type: 'uuid' })
  user_pool_attribute_def_key: string;

  @Column({ type: 'uuid' })
  event_key: string;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'varchar' })
  value_dt: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by_user: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by_user: string | null;
}
