import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ type: 'varchar', length: 255 })
  status: 'draft' | 'active' | 'completed' | 'archived';

  @OneToMany(() => Participant, (participant) => participant.campaign)
  participants: Participant[];
}
