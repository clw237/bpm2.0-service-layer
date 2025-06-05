import { User } from 'src/entities';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export default class Campaign {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column()
  reminderDaysBefore: number;

  @Column('text', { array: true })
  assessments: string[];

  @Column({ nullable: true })
  bpmWorkflowId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'campaign_participants',
    joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: User[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
