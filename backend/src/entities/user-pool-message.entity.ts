import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_pool_message')
export class UserPoolMessage {
  @PrimaryGeneratedColumn('uuid')
  userKey: string;

  @Column('uuid')
  workspaceKey: string;

  @Column('uuid')
  campaignKey: string;

  @Column()
  assessmentDeadline: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  events: UserPoolEvent[];
}

export class UserPoolEvent {
  @Column()
  eventType: string;

  @Column()
  eventValue: string;

  @Column()
  eventTypeKey: string;
}
