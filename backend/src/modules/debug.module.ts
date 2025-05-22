import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugService } from 'services';
import { DebugController } from '../controllers';
import {
  EmailSend,
  Log,
  UserPool,
  UserPoolAttributes,
  UserPoolLog,
} from '../entities';
import { LoggerModule, LoggerService } from '../logger';
import { Email1Service } from '../services/email1.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserPool,
      UserPoolAttributes,
      UserPoolLog,
      Log,
      EmailSend,
    ]),
    LoggerModule,
  ],
  providers: [DebugService, LoggerService, Email1Service],
  controllers: [DebugController],
  exports: [DebugService],
})
export default class DebugModule {}
