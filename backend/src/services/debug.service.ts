import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  EmailSend,
  Log,
  UserPool,
  UserPoolAttributes,
  UserPoolLog,
} from '../entities/index';
import { LoggerService } from '../logger';

@Injectable()
export default class DebugService extends Repository<UserPoolLog> {
  constructor(
    @InjectRepository(UserPool)
    private readonly userPoolRepository: Repository<UserPool>,
    @InjectRepository(UserPoolAttributes)
    private readonly userPoolAttributeRepository: Repository<UserPoolAttributes>,
    private dataSource: DataSource,
    @InjectRepository(EmailSend)
    private readonly emailSendRepository: Repository<EmailSend>,
    private readonly logger: LoggerService,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {
    super(UserPoolLog, dataSource.createEntityManager());
  }

  async getUserPoolData(
    email: string,
    limit?: number,
  ): Promise<{
    userPool: UserPool | null;
    userPoolAttributes: UserPoolAttributes[];
    userPoolLogs: UserPoolLog[];
  } | null> {
    const userPool = await this.userPoolRepository.findOne({
      where: { email_address: email },
    });

    if (!userPool) {
      return null;
    }

    let attributesQuery = this.userPoolAttributeRepository
      .createQueryBuilder('user_pool_attributes')
      .where('user_pool_attributes.user_pool_key = :userPoolKey', {
        userPoolKey: userPool.user_pool_key,
      });

    if (limit) {
      attributesQuery = attributesQuery.limit(limit);
    }

    const userPoolAttributes = await attributesQuery.getMany();

    let logsQuery = this.createQueryBuilder('user_pool_log').where(
      `user_pool_log.data->'message'->>'email' = :email`,
      { email },
    );

    if (limit) {
      logsQuery = logsQuery.limit(limit);
    }

    const userPoolLogs = await logsQuery.getMany();

    return {
      userPool,
      userPoolAttributes,
      userPoolLogs,
    };
  }

  async getAllLogs(level?: string, limit?: number): Promise<Log[]> {
    try {
      this.logger.info(`Getting all logs for level: ${level}`);
      const queryBuilder = this.logRepository
        .createQueryBuilder('logs')
        .orderBy('logs.Created_at', 'DESC');
      if (level) {
        queryBuilder.andWhere('logs.level = :level', { level });
      }
      if (limit) {
        queryBuilder.limit(limit);
      } else {
        queryBuilder.limit(100);
      }
      return queryBuilder.getMany();
    } catch (err) {
      this.logger.error(
        `Failed to get all logs for level : ${level}`,
        err.stack,
      );
      throw err;
    }
  }

  async getAllEmails(
    email?: string,
    email_category_code?: string,
  ): Promise<EmailSend[]> {
    try {
      const queryBuilder = this.emailSendRepository
        .createQueryBuilder('es')
        .select(
          'es.*, ec.email_category_key, ec.email_category_code, ec.email_category_name',
        )
        .innerJoin('email_template', 'et', 'es.template_key = et.template_key')
        .innerJoin(
          'email_category',
          'ec',
          'ec.email_category_key = et.email_category_key',
        );

      if (email) {
        queryBuilder.andWhere('es.email_address = :email', { email });
      }

      if (email_category_code) {
        queryBuilder.andWhere('ec.email_category_code = :email_category_code', {
          email_category_code,
        });
      }

      return await queryBuilder
        .orderBy('es.created_at', 'DESC')
        .take(100)
        .getRawMany();
    } catch (err) {
      this.logger.error(
        `Failed to get all emails${email ? ` for email : ${email}` : ''}${
          email_category_code
            ? ` with category code : ${email_category_code}`
            : ''
        }`,
        err.stack,
      );
      throw err;
    }
  }
}
