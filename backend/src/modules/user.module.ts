import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSend, User } from 'entities';
import { UserRepository } from 'repositories';
import { UserService } from 'services';
import { LoggerModule } from '../logger';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailSend]), LoggerModule],
  providers: [UserService, UserRepository, EmailSend],
})
export default class UserModule {}
