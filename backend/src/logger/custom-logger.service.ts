import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogLevel } from 'kfone-common-library';
import { Repository } from 'typeorm';
import { Log } from '../entities';
import { AppConfigService } from '../services';
import LoggerService from './logger.service';

@Injectable()
export default class CustomLoggerService {
  private readonly logger = LoggerService.getInstance();

  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    private readonly appConfigService: AppConfigService,
  ) {}

  private isLogToDB(): boolean {
    return this.appConfigService.getConfigValue('LOG_TO_DB') === 'yes';
  }

  private async saveLog(
    level: LogLevel,
    message: string,
    ...optionalParams: any[]
  ) {
    if (this.isLogToDB()) {
      try {
        let context = undefined;
        let _message = message;
        const levelString: string = LogLevel[level];

        const obj = optionalParams?.length > 0 ? optionalParams[0] : null;
        if (obj && typeof obj === 'object') {
          if (obj.context) {
            context = obj.context;
          }
        } else {
          _message = `${message}\n${optionalParams?.join('\n')}`;
        }
        const log = this.logRepository.create({
          level: levelString || 'info',
          message: _message ?? null,
          context: context ?? undefined,
        });
        await this.logRepository.save(log);
      } catch (err) {
        console.error(err);
        this.logger.error(err.message, err.stack, ...err);
      }
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
    this.saveLog(LogLevel.INFO, message, ...optionalParams).catch((error) => {
      console.error('Error saving log:', error);
      this.logger.error(error.message, error.stack, ...error);
    });
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
    this.saveLog(LogLevel.DEBUG, message, ...optionalParams).catch((error) => {
      console.error('Error saving log:', error);
      this.logger.error(error.message, error.stack, ...error);
    });
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
    this.saveLog(LogLevel.WARN, message, ...optionalParams).catch((error) => {
      console.error('Error saving log:', error);
      this.logger.error(error.message, error.stack, ...error);
    });
  }

  error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
    this.saveLog(LogLevel.ERROR, message, ...optionalParams).catch((error) => {
      console.error('Error saving log:', error);
      this.logger.error(error.message, error.stack, ...error);
    });
  }
}
