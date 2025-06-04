import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities';

@Injectable()
export default class LogRepository {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  /**
   * Logs an operation to the logs table.
   * @param level Log level (e.g. 'info', 'error')
   * @param message Log message (e.g. operation type)
   * @param context Optional context as an object (will be stringified)
   * @param loggend_in_user_key Optional user key who triggered the log
   * @param user_key_in_context Optional user key referenced in the log context
   * @param ip_address Optional IP address
   */
  async logOperation(
    level: string,
    message: string,
    context?: Record<string, any>,
    loggend_in_user_key?: string,
    user_key_in_context?: string,
    ip_address?: string,
  ): Promise<Log> {
    const log = this.logRepository.create({
      level,
      message,
      context: context ? JSON.stringify(context) : undefined,
      loggend_in_user_key,
      user_key_in_context,
      ip_address,
    });
    return this.logRepository.save(log);
  }

  /**
   * Finds all error-level logs.
   */
  async findRecentErrors(): Promise<Log[]> {
    return this.logRepository.find({
      where: { level: 'error' },
      order: { log_key: 'DESC' },
    });
  }
}
