import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'workspaces' })
export default class Workspace {
  @PrimaryGeneratedColumn('uuid')
  workspace_key: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  workspace_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by_user: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by_user: string | null;
}
