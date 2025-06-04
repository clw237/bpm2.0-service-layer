import { User } from 'entities';
import { Column, Entity, ManyToMany } from 'typeorm';

export type CampaignOption = 'Traits' | 'Competencies' | 'Drivers';
export const DEFAULT_OPTIONS: CampaignOption[] = [
  'Traits',
  'Competencies',
  'Drivers',
];

@Entity()
export default class Campaign {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column({ name: 'reminder_offset_days' })
  reminderDaysBefore: number;

  @ManyToMany(() => User, (user) => user.campaigns)
  participants: User[];

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSync: Date;

  @Column({
    type: 'text',
    array: true,
    default: () => `'{Traits,Competencies,Drivers}'`,
  })
  assessments: CampaignOption[];
}
