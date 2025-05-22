import { Injectable } from '@nestjs/common';
import { Logger, LogLevel, ServiceName } from 'kfone-common-library';

@Injectable()
export default class LoggerService {
  private static instance: LoggerService;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(ServiceName.CONNECT);
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  log(message: string, logLevel: LogLevel, ...optionalParams: any[]): void {
    this.logger.log(message, logLevel, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }
}
