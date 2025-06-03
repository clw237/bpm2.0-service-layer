import { Column, Entity, ManyToOne } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity()
export class Participant {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  status: 'pending' | 'completed' | 'inactive';

  @ManyToOne(() => Campaign, (campaign) => campaign.participants)
  campaign: Campaign;
}
