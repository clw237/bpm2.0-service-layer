import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserPoolReminderDto } from 'dtos';
import { UserPool } from 'entities';
import { MessageService } from 'services';
import { DataSource } from 'typeorm';
import { ISchedulerListItem } from '../interfaces';
import { LoggerService } from '../logger';
import { AppConfigService, SchedulerService } from '../services';
import {
  SCHEDULE_TYPE_CODE,
  SCHEDULER_EMAIL_STATUS,
} from './../config/constants';
import {
  checkDeadlineReminder,
  convertToFriendlyFormat,
  isTargetDate,
} from './../utilities/scheduler-utils';
import { SchedulerEmailsService } from './scheduler-emails.service';

@Injectable()
export default class SchedulerFunctionsService {
  constructor(
    @Inject(forwardRef(() => SchedulerService))
    private readonly schedulerService: SchedulerService,
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource,
    private readonly schedulerEmailsService: SchedulerEmailsService,
    private readonly messageService: MessageService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async runScheduler(): Promise<Record<string, any>> {
    const WORKSPACE_KEY = '832e16ed-39f3-4441-a18f-656b62e72d0f'; //TODO: handle all workspace

    try {
      const schdulerlist =
        await this.schedulerService.getSchedulerList(WORKSPACE_KEY);

      const attribDefMap =
        await this.schedulerService.getUserPoolAttributesDefMap(WORKSPACE_KEY);

      const processed: any = [];

      for (const schduler of schdulerlist) {
        let proceedWithLookUp = false;
        const schedulerOptions: any = schduler.schedule_json;
        let matchedFrequency: number | null = null;

        try {
          switch (schduler.schedule_type_code) {
            case SCHEDULE_TYPE_CODE.DATE:
              proceedWithLookUp = isTargetDate(schedulerOptions?.utcDate);
              break;
            case SCHEDULE_TYPE_CODE.REMINDER:
              const frequencyLookUp = checkDeadlineReminder(
                schedulerOptions?.assessmentDeadlineInUtc,
                schedulerOptions?.frequency,
              );

              //console.log('frequencyLookUp >>');
              //console.log(frequencyLookUp);

              proceedWithLookUp = frequencyLookUp.shouldRemind;
              matchedFrequency = frequencyLookUp.frequency;

              break;
            default:
              break;
          }

          // console.log('proceedWithLookUp >>');
          // console.log(proceedWithLookUp);

          if (proceedWithLookUp) {
            let users = [] as UserPoolReminderDto[];
            users = await this.getUsersWithAssessmentReminder(
              schduler,
              attribDefMap,
              matchedFrequency,
            );

            processed.push({
              scheduler_key: schduler.scheduler_key,
              assessment_deadline: schedulerOptions?.assessmentDeadlineInUtc,
              reminder_type: matchedFrequency ? 'Frequency' : 'Date',
              reminder_value: matchedFrequency
                ? matchedFrequency
                : schedulerOptions?.assessmentDeadlineInUtc,
            });

            if (users?.length > 0) {
              for (const user of users) {
                user.reminder_date = convertToFriendlyFormat(
                  schedulerOptions?.assessmentDeadlineInUtc,
                  schedulerOptions?.timezone,
                );
                await this.sendEmail(user, schduler);
              }
            }
          }
        } catch (error) {
          this.logger.error(
            error.message,
            'runScheduler item',
            error.stack,
            JSON.stringify(schduler),
          );
        }
      }

      return { total: schdulerlist.length, processed };
    } catch (error) {
      this.logger.error(error.message, 'runScheduler', error.stack);
    }
    return { total: 0 };
  }

  async getUsersWithAssessmentReminder(
    schedule: ISchedulerListItem,
    attribDefMap: Map<string, string>,
    frequency?: number | null,
  ): Promise<UserPoolReminderDto[]> {
    const campaignKeyAttribDefKey = attribDefMap.get('campaignKey');
    const assessmentStatusDefKey = attribDefMap.get('assessmentStatus');
    const workspaceKey = schedule.workspace_key;
    const scheduleTypeCode = schedule.schedule_type_code;
    const campaignKey: string | null = schedule.item_key;

    let uniqueKey: string | null = null;
    switch (schedule.schedule_type_code) {
      case SCHEDULE_TYPE_CODE.DATE:
        uniqueKey = `CONCAT(
          '${campaignKey}'::uuid::text, 
          ':', 
          u.workspace_user_key, 
          ':', 
          '${scheduleTypeCode}'::text
        )`;
        break;
      case SCHEDULE_TYPE_CODE.REMINDER:
        uniqueKey = `CONCAT(
          '${campaignKey}'::uuid::text, 
          ':', 
          u.workspace_user_key, 
          ':', 
          '${scheduleTypeCode}'::text, 
          ':', 
          ${frequency}::text
        )`;
        break;
      default:
        break;
    }

    // console.log('uniqueKey >>', uniqueKey);

    const result = await this.dataSource
      .getRepository(UserPool)
      .createQueryBuilder('u')
      .select([
        `u.workspace_key as workspace_key`,
        `u.workspace_user_key as workspace_user_key`,
        `u.email_address as email_address`,
        `u.last_name as last_name`,
        `u.first_name as first_name`,
        `u.language_code as language_code`,
        `${uniqueKey} AS unique_key`,
        ...(frequency !== null ? [`${frequency} as reminder`] : []),
      ])
      .where('u.workspace_key = :workspaceKey', { workspaceKey })
      .andWhere((qb) => {
        const subQuery1 = qb
          .subQuery()
          .select('a.user_pool_key')
          .from('user_pool_attributes', 'a')
          .where('a.user_pool_key = u.user_pool_key')
          .andWhere('LOWER(a.value) != :completed', { completed: 'completed' })
          .andWhere('a.user_pool_attribute_def_key = :assessmentStatusDefKey', {
            assessmentStatusDefKey,
          })
          .getQuery();

        return `u.user_pool_key IN ${subQuery1}`;
      })
      .andWhere((qb) => {
        const subQuery2 = qb
          .subQuery()
          .select('a.user_pool_key')
          .from('user_pool_attributes', 'a')
          .where('a.user_pool_key = u.user_pool_key')
          .andWhere('a.value = :campaignKey', { campaignKey })
          .andWhere(
            'a.user_pool_attribute_def_key = :campaignKeyAttribDefKey',
            {
              campaignKeyAttribDefKey,
            },
          )
          .getQuery();

        return `u.user_pool_key IN ${subQuery2}`;
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('scheduler_emails', 'se')
          .where(`se.unique_key = ${uniqueKey}`)

          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .setParameters({ campaignKey, scheduleTypeCode })
      .limit(300)
      .getRawMany();

    return result as UserPoolReminderDto[];
  }

  async sendEmail(
    userPoolReminderDto: UserPoolReminderDto,
    scheduler: ISchedulerListItem,
  ) {
    const loginUrl = this.appConfigService.getConfigValue('LOGIN_URL');

    try {
      const message = {
        campaignKey: scheduler.item_key,
        campaignName: '',
        emailTemplateKey: scheduler.template_key,
        firstName: userPoolReminderDto.first_name,
        languageCode: userPoolReminderDto.language_code,
        lastName: userPoolReminderDto.last_name,
        loginUrl: loginUrl,
        toEmailaddress: userPoolReminderDto.email_address,
        workspaceUserKey: userPoolReminderDto.workspace_key,
        deadLineDate: userPoolReminderDto.reminder_date,
        metaData: {
          campaignUserKey: userPoolReminderDto.workspace_user_key,
          emailCampaignCode: 'ASSESSMENT_REMINDER',
        },
      };

      const scheduler_email_key: string | null =
        await this.schedulerEmailsService.addRecord(
          message.toEmailaddress,
          message.emailTemplateKey,
          scheduler.scheduler_key,
          message.languageCode,
          userPoolReminderDto.unique_key,
          SCHEDULER_EMAIL_STATUS.READY_TO_SEND,
          JSON.stringify(message),
          '',
        );
      const recordId = scheduler_email_key ?? '';
      if (!scheduler_email_key) {
        throw new Error('Email send add record failed');
      }
      const messageStatus = await this.messageService.publishMessage(message);

      if (messageStatus?.success) {
        // email_send Sent
        await this.schedulerEmailsService.updateRecord(
          recordId,
          SCHEDULER_EMAIL_STATUS.SENT_TO_QUEUE,
          null,
          JSON.stringify(message),
        );
      } else {
        // email_send Error
        await this.schedulerEmailsService.updateRecord(
          recordId,
          SCHEDULER_EMAIL_STATUS.ERROR,
          messageStatus?.status,
          JSON.stringify(message),
        );
      }
    } catch (error) {
      console.error('Error sending email:', error);
      this.logger.error(error.message, 'sendEmail', error.stack);
    }
  }
}
