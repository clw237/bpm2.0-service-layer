import { Campaign } from 'entities';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn() // This will become an auto-generated column
  id: number;

  @Column({ type: 'varchar', length: 500 })
  email: string;

  @Column({ type: 'varchar', length: 500 })
  username: string;

  @Column()
  createdAt: Date;

  @Column()
  lastModifiedAt: Date;

  @ManyToMany(() => Campaign, (campaign) => campaign.participants)
  campaigns: Campaign[];
}
