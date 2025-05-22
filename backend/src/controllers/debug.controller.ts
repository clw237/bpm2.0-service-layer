import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmailSend,
  Log,
  UserPool,
  UserPoolAttributes,
  UserPoolLog,
} from 'entities';
import { LoggerService } from '../logger';
import { DebugService } from '../services';
import { Email1Service } from '../services/email1.service';

@ApiTags('debug')
@Controller({
  path: 'debug',
  version: '1',
})
export default class DebugController {
  constructor(
    private readonly emailService: Email1Service,
    private readonly debugService: DebugService,
    private readonly logger: LoggerService,
  ) {}

  @Get('getLogs')
  @ApiOperation({
    summary: 'Get logs with optional level filter and limit',
    description: 'Log Info API',
    operationId: 'getLogs-campaign-edit',
  })
  @ApiQuery({
    name: 'level',
    description: 'Optional: Log level to filter by (e.g., ERROR, INFO, WARN)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Optional: Maximum number of logs to return',
    required: false,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered list of logs',
    type: [Log],
  })
  getAllLogs(
    @Query('level') level?: string,
    @Query('limit') limit?: number,
  ): Promise<Log[]> {
    try {
      this.logger.info(
        `Getting all logs for level : ${level} and limit : ${limit}`,
      );
      return this.debugService.getAllLogs(level, limit);
    } catch (err) {
      throw err;
    }
  }

  @Get('emailStats')
  @ApiOperation({
    summary: 'Get email stats - total, bounce, send, delivery, open counts',
    description: 'emailStats',
    operationId: 'emailStats-campaign-edit',
  })
  @ApiOkResponse({
    description: 'Email stats successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        total_count: { type: 'number' },
        bounce_count: { type: 'number' },
        sent_count: { type: 'number' },
        delivery_count: { type: 'number' },
        open_count: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getEmailStats(): Promise<Record<string, any>> {
    this.logger.info(
      'Getting email stats - total, bounce, send, delivery, open counts',
    );
    return this.emailService.getEmailStats();
  }

  @Get('getBounceEmailLogs')
  @ApiOperation({
    summary: 'Get bounce data',
    description: 'Log Info API',
    operationId: 'getBounceLogs-campaign-edit',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Optional: Maximum number of records to return (Optional)',
    required: false,
    type: 'number',
  })
  getBounceEmailLogs(@Query('limit') limit?: number): Promise<any[]> {
    try {
      this.logger.info(`Getting bounce data with limit : ${limit}`);
      return this.emailService.getBounceLogs(limit);
    } catch (err) {
      throw err;
    }
  }

  @Get('getUserPoolInfo')
  @ApiOperation({
    summary: 'Get user pool information by email',
    description:
      'Retrieves user pool record along with related attributes and logs',
    operationId: 'getUserPoolInfo-campaign-edit',
  })
  @ApiQuery({
    name: 'email',
    description: 'Email address for user lookup',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description:
      'Optional: Maximum number of attributes and logs to return (Optional)',
    required: false,
    type: 'number',
  })
  @ApiOkResponse({
    description: 'User pool information successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        userPool: {
          type: 'object',
          nullable: true,
          description: 'User pool record information or null if not found',
        },
        userPoolAttributes: {
          type: 'array',
          description: 'List of user pool attributes',
          items: {
            type: 'object',
          },
        },
        userPoolLogs: {
          type: 'array',
          description: 'List of user pool logs',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getUserPoolData(
    @Query('email') email: string,
    @Query('limit') limit?: number,
  ): Promise<{
    userPool: UserPool | null;
    userPoolAttributes: UserPoolAttributes[];
    userPoolLogs: UserPoolLog[];
  } | null> {
    try {
      this.logger.info(
        `Getting user pool data for email: ${email} with limit: ${limit}`,
      );
      return await this.debugService.getUserPoolData(email, limit);
    } catch (err) {
      this.logger.error(
        `Error getting user pool data: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('getEmailSentRecords')
  @ApiOperation({
    summary: 'Get email sent records by email address',
    operationId: 'getEmailSentRecords-campaign-edit',
  })
  @ApiQuery({
    name: 'email_address',
    description: 'Email address to filter sent records',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'email_category_code',
    description:
      'Optional: filter based on email_category_code (e.g:, USER_INVITATION, PASSWORD_RESET, PARTICIPANT_INVITATION, ASSESSMENT_FEEDBACK, WELCOME, ASSESSMENT_REMINDER)',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of email sent records',
    type: [EmailSend],
  })
  getAllUsers(
    @Query('email_address') email_address: string,
    @Query('email_category_code') email_category_code: string,
  ): Promise<EmailSend[]> {
    try {
      return this.debugService.getAllEmails(email_address, email_category_code);
    } catch (err) {
      throw err;
    }
  }
}
