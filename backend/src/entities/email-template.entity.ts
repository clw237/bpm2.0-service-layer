import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ItemType {
  SYSTEM = 'system',
  CLIENT = 'client',
  WORKSPACE = 'workspace',
}

@Entity({ name: 'email_template' })
export default class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  template_key: string;

  @Column({ type: 'varchar', length: 255 })
  template_name: string;

  @Column({ type: 'uuid' })
  email_category_key: string;

  @Column({ type: 'uuid' })
  workspace_key: string;

  @Column({ type: 'uuid' })
  item_key: string;

  @Column({ type: 'enum', enum: ItemType })
  item_type: ItemType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'varchar', length: 255, default: null })
  created_by_user: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, default: null })
  updated_by_user: string;
}
