import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'whitelist' })
export default class EmailWhiteList {
  @PrimaryColumn()
  email: string;

  @CreateDateColumn()
  created_at?: Date | null;

  @Column({ type: 'uuid', nullable: true })
  created_by_user?: string | null;

  @UpdateDateColumn({ nullable: true })
  updated_at?: Date | null;

  @Column({ type: 'uuid', nullable: true })
  updated_by_user?: string | null;
}
