// repositories/audit.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmAuditLog } from '../entities/bpmAudit.entity';

@Injectable()
export class AuditRepository {
  constructor(
    @InjectRepository(BpmAuditLog)
    private readonly repo: Repository<BpmAuditLog>,
  ) {}

  logOperation(
    operationType: string,
    request: Record<string, any>,
    response: Record<string, any>,
  ): Promise<BpmAuditLog> {
    const log = this.repo.create({
      operationType,
      requestBody: request,
      responseBody: response,
      statusCode: 200,
      endpoint: '/campaigns',
    });
    return this.repo.save(log);
  }

  findRecentErrors(hours = 24): Promise<BpmAuditLog[]> {
    return this.repo
      .createQueryBuilder('log')
      .where('log.timestamp > NOW() - INTERVAL :hours', {
        hours: `${hours} hours`,
      })
      .andWhere('log.statusCode != 200')
      .getMany();
  }
}
