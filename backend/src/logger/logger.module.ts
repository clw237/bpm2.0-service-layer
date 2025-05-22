import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../entities';
import CustomLoggerService from './custom-logger.service';
import LoggerService from './logger.service';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [
    CustomLoggerService,
    {
      provide: LoggerService,
      useFactory: () => LoggerService.getInstance(),
    },
  ],
  exports: [LoggerService, CustomLoggerService],
})
export default class LoggerModule {}
