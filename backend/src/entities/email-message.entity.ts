import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_message')
export default class EmailMessage {
  @PrimaryGeneratedColumn('uuid')
  emailTemplateKey: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  languageCode: string;

  @Column('uuid')
  key: string;

  @Column('uuid')
  workspaceKey: string;

  @Column('uuid')
  workspaceUserKey: string;

  @Column()
  toEmailaddress: string;

  @Column('uuid')
  clientKey: string;

  @Column()
  metaData: JSON | null;
}
