import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_pool_attributes_def' })
export default class UserPoolAttributesDef {
  @PrimaryGeneratedColumn()
  user_pool_attributes_def_key: string;

  @Column()
  user_pool_attributes_def_code: string;

  @Column({ type: 'uuid' })
  workspace_key: string;

  @Column()
  type: string;

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
