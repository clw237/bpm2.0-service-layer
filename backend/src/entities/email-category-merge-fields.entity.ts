import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'email_category_merge_fields' })
export default class EmailCategoryMergeFields {
  @PrimaryGeneratedColumn()
  email_category_merge_field_key: string;

  @Column({ type: 'uuid' })
  email_category_key: string;

  @Column({ type: 'varchar', length: 255 })
  merge_field_key: string;

  @Column({ type: 'varchar', length: 255 })
  merge_field_description: string;

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
