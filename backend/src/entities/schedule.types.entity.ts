import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedule_types' })
export default class ScheduleType {
  @PrimaryGeneratedColumn('uuid')
  schedule_type_key: string;

  @Column({ type: 'varchar', length: 255 })
  schedule_type_code: string;

  @Column({ type: 'varchar', length: 255 })
  schedule_display_name: string;

  @Column({ type: 'int4' })
  sort_order: number;

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
