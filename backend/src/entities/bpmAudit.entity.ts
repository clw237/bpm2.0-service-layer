import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BpmAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operationType: string;

  @Column('jsonb')
  requestBody: Record<string, any>;

  @Column('jsonb', { nullable: true })
  responseBody: Record<string, any>;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: true })
  statusCode: number;

  @Column()
  endpoint: string;
}
