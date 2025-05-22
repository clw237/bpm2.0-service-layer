import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
