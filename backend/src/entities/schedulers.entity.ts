import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ItemType } from './email-template.entity';

@Entity({ name: 'schedulers' })
export default class Schedulers {
  @PrimaryGeneratedColumn('uuid')
  scheduler_key: string;

  @Column({ type: 'uuid' })
  workspace_key: string;

  @Column({ type: 'uuid' })
  schedule_type_key: string;

  @Column({ type: 'varchar', length: 255 })
  scheduler_name: string;

  @Column({ type: 'uuid' })
  template_key: string;

  @Column({ type: 'uuid' })
  item_key: string;

  @Column({ type: 'enum', enum: ItemType })
  item_type: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'json', nullable: true })
  schedule_json: object;

  @Column({ type: 'int', nullable: true })
  max_occurrence: number;

  @Column({ type: 'boolean', default: true })
  is_enabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 255 })
  created_by_user: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255 })
  updated_by_user: string;
}
