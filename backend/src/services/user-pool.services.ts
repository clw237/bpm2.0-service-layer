import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ConsumerService,
  KFOneMessage,
  ProducerService,
} from 'kfone-mq-library';
import { v4 as uuidv4 } from 'uuid';
import { USER_POOL_STATUS } from '../config/constants';
import { UserPoolAttributesDef } from '../entities/index';
import { UserPoolMessage } from '../entities/user-pool-message.entity';
import {
  UserPoolAttributesDefRepository,
  UserPoolAttributesRepository,
  UserPoolLogRepository,
  UserPoolRepository,
} from '../repositories';
import { AppConfigService } from '../services';

@Injectable()
export default class UserPoolService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly consumerService: ConsumerService,
    private appConfigService: AppConfigService,
    private readonly UserPoolRepo: UserPoolRepository,
    private readonly UserPoolLogRepo: UserPoolLogRepository,
    private readonly UserPoolAttributesRepo: UserPoolAttributesRepository,
    private readonly UserPoolAttributesDefRepo: UserPoolAttributesDefRepository,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit() {
    console.log('User Pool Consumer Service Initiated');
    const consumerId = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_APPLICATION_ID',
    );
    const RABBITMQ_SCHEDULER_QUEUE_NAME = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_SCHEDULER_QUEUE_NAME',
    );

    console.log('RABBITMQ_SCHEDULER_QUEUE_NAME', RABBITMQ_SCHEDULER_QUEUE_NAME);
    console.log('consumerId', consumerId);

    await this.consumerService.listen(
      RABBITMQ_SCHEDULER_QUEUE_NAME,
      this.handleUserMessage.bind(this),
      consumerId,
    );
  }

  async publishUserMessage(payload: any) {
    const exchangeName = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_EXCHANGE_NAME',
    );
    const routingKey = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_SCHEDULER_ROUTING_KEY',
    );
    const producerId = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_APPLICATION_ID',
    );
    const kFOneMessagePayload: string = JSON.stringify(payload);

    const kFOneMessage = new KFOneMessage(
      kFOneMessagePayload,
      randomUUID(),
      producerId,
    );

    await this.producerService.publish(
      exchangeName,
      `${routingKey}`.toLowerCase(),
      kFOneMessage,
    );

    return { status: 'Message published successfully' };
  }

  async handleUserMessage(message: KFOneMessage): Promise<void> {
    const { payload } = message;
    let workspace_key: string | null = null;
    let workspace_user_key: string | null = null;
    let campaign_key: string | null = null;
    let assensement_deadline: string | null = null;
    let email_address = '';

    const data: any = {
      message: null,
      result: null,
    };

    try {
      if (payload) {
        const userMessage: UserPoolMessage = JSON.parse(payload);
        console.log('<<<<<<<<<<<<<<<<user message', userMessage);

        workspace_key = userMessage.workspaceKey;
        workspace_user_key = userMessage.userKey;
        email_address = userMessage.email;
        campaign_key = userMessage.campaignKey;
        assensement_deadline = userMessage.assessmentDeadline;

        data.message = userMessage;

        const user_pool_log_insert = await this.UserPoolLogRepo.addRecord(
          workspace_key,
          workspace_user_key,
          USER_POOL_STATUS.IN_PROGRESS,
          '',
          JSON.stringify(data),
        );

        console.log('user_pool_log_insert >>');
        console.log(user_pool_log_insert);

        const checkExistingPoolRecord: any =
          await this.UserPoolRepo.getUserPool(
            workspace_key,
            workspace_user_key,
          );

        // console.log('checkExistingPoolRecord >>');
        // console.log(checkExistingPoolRecord?.user_pool_log_key);

        let userPoolInsert: any;
        if (!checkExistingPoolRecord) {
          userPoolInsert = await this.UserPoolRepo.addRecord(
            workspace_key,
            workspace_user_key,
            email_address,
            userMessage.firstName,
            userMessage.lastName,
          );

          if (!userPoolInsert) {
            throw new Error('Failed to insert record in UserPool');
          }

          data.result = userPoolInsert;
        } else {
          data.result = checkExistingPoolRecord;
        }

        await this.UserPoolLogRepo.updateRecord(
          user_pool_log_insert?.raw[0].user_pool_log_key,
          USER_POOL_STATUS.COMPLETE,
          '',
          JSON.stringify(data),
        );

        if (campaign_key) {
          userMessage.events.push({
            eventType: 'campaignKey',
            eventValue: campaign_key,
            eventTypeKey: uuidv4(),
          });
        }

        if (assensement_deadline) {
          userMessage.events.push({
            eventType: 'assessmentDeadline',
            eventValue: assensement_deadline,
            eventTypeKey: uuidv4(),
          });
        }

        for (const event of userMessage.events) {
          data.result = null;

          const defLookUp: UserPoolAttributesDef | null =
            await this.UserPoolAttributesDefRepo.getUserPoolAttribueDef(
              event.eventType,
            );

          console.log('defLookUp >>');
          console.log(defLookUp);

          if (!defLookUp) {
            await this.UserPoolLogRepo.updateRecord(
              user_pool_log_insert?.raw[0].user_pool_log_key,
              USER_POOL_STATUS.ERROR,
              `Failed to locate record in UserPoolAttributes Def using user_pool_attributes_def_code = ${event.eventType}`,
              JSON.stringify(data),
            );
            throw new Error(
              'Failed to locate record in UserPoolAttributes Def',
            );
          }

          console.log('event.eventValue >>');
          console.log(event.eventValue);

          console.log('checkExistingPoolRecord >>');
          console.log(checkExistingPoolRecord);

          console.log('userPoolInsert.raw[0].user_pool_key >>');
          console.log(userPoolInsert?.raw[0]?.user_pool_key);

          const checkExistingPoolAttributeRecord: any =
            await this.UserPoolAttributesRepo.getUserPoolAttributes(
              defLookUp.user_pool_attributes_def_key,
              checkExistingPoolRecord
                ? checkExistingPoolRecord.user_pool_key
                : userPoolInsert.raw[0].user_pool_key,
            );

          console.log('checkExistingPoolAttributeRecord >>');
          console.log(checkExistingPoolAttributeRecord);

          if (!checkExistingPoolAttributeRecord) {
            const userPoolAttributeInsert =
              await this.UserPoolAttributesRepo.addRecord(
                checkExistingPoolRecord
                  ? checkExistingPoolRecord.user_pool_key
                  : userPoolInsert.raw[0].user_pool_key,
                defLookUp.user_pool_attributes_def_key,
                defLookUp.type,
                event.eventTypeKey,
                event.eventValue?.toLowerCase(),
              );

            if (!userPoolAttributeInsert) {
              throw new Error(
                'Failed to insert record in userPoolAttributeInsert',
              );
            }

            data.result = userPoolAttributeInsert;
          } else {
            if (
              event.eventTypeKey === checkExistingPoolAttributeRecord.event_key
            ) {
              // update value
              const updatePoolAttributeRecord =
                await this.UserPoolAttributesRepo.updateRecord(
                  checkExistingPoolAttributeRecord.user_pool_attribute_key,
                  { value: event.eventValue?.toLowerCase() },
                );
              data.result = updatePoolAttributeRecord.raw[0];
            } else {
              data.result = checkExistingPoolAttributeRecord;
            }
          }

          await this.UserPoolLogRepo.updateRecord(
            user_pool_log_insert?.raw[0].user_pool_log_key,
            USER_POOL_STATUS.COMPLETE,
            '',
            JSON.stringify(data),
          );
        }
      }
    } catch (e) {
      console.log('exception >>');
      console.log(e);
      await this.UserPoolLogRepo.addRecord(
        workspace_key,
        workspace_user_key,
        USER_POOL_STATUS.ERROR,
        e.message,
        JSON.stringify(data),
      );
    }
  }

  async onModuleDestroy() {
    await this.consumerService.onModuleDestroy();
  }
}
