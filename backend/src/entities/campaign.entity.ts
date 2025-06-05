import { User } from 'src/entities';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export default class Campaign {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  workflowTemplateId: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column()
  reminderDaysBefore: number;

  @Column('simple-array')
  assessments: string[];

  @Column({ nullable: true })
  bpmWorkflowInstanceId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'campaign_participants', // Explicit join table name
    joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: User[];

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    update: false, // Prevent accidental updates
  })
  createdAt: Date;
}
