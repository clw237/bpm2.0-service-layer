import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'email_template_languages' })
export default class EmailTemplateLanguages {
  @PrimaryGeneratedColumn('uuid')
  template_language_key: string;

  @Column({ type: 'uuid' })
  template_key: string;

  @Column({ type: 'varchar', length: 10 })
  language_code: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'varchar', length: 255 })
  created_by_user: string;

  @Column({
    type: 'timestamp',
  })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255 })
  updated_by_user: string;
}
