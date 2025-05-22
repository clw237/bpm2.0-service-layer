import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'email_category' })
export default class EmailCategory {
  @PrimaryGeneratedColumn()
  email_category_key: string;

  @Column({ type: 'varchar', length: 255 })
  email_category_name: string;

  @Column({ type: 'varchar', length: 255 })
  email_category_code: string;

  @Column({ type: 'uuid' })
  workspace_key: string;

  @Column({ type: 'boolean', default: false })
  is_enabled: boolean;

  @Column({ type: 'boolean', default: false })
  is_display: boolean;

  @Column({ type: 'int4' })
  sort_order: number;

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
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by_user: string;
}
