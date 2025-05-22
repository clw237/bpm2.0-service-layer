import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'email_category_schedule_type' })
export default class EmailCategoryScheduleType {
  @PrimaryColumn({ type: 'uuid' })
  schedule_type_key: string;

  @Column({ type: 'uuid' })
  email_category_key: string;

  @Column({ type: 'int4' })
  sort_order: number;

  @Column({ type: 'varchar', length: 255 })
  schedule_display_name: string;

  @Column({ type: 'json', nullable: true })
  metadata: object;

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
