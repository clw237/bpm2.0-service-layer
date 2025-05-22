import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { KFOneMessage, ProducerService } from 'kfone-mq-library';
import { EMAIL_SEND_NOTIFICATION } from '../config/constants';
import {
  NotificationBounceDto,
  NotificationMailDto,
  NotificationOpenDto,
} from '../dtos/email-track.dto';
import { LoggerService } from '../logger';
import {
  EmailSendRepository,
  EmailSentResultsRepository,
} from '../repositories/index';
import { AppConfigService } from '../services';

@Injectable()
export default class MessageService implements OnModuleDestroy {
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    private readonly producerService: ProducerService,
    private readonly emailSendRepository: EmailSendRepository,
    private readonly emailSentResultsRepository: EmailSentResultsRepository,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async _publishMessage(payload: any) {
    const exchangeName = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_EXCHANGE_NAME',
    );
    const routingKey = this.appConfigService.getConfigValue(
      'CONNECT_RMQ_EMAIL_ROUTING_KEY',
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

    return { status: 'Message published successfully', success: true };
  }

  // publish message with retry
  async publishMessage(payload: any) {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this._publishMessage(payload);
        return result;
      } catch (err) {
        console.log(`Publish attempt ${attempt} failed: ${err.message}`);
        this.logger.error(
          `[publishMessage] Publish attempt ${attempt} failed.`,
          err.message,
          err.stack,
        );
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt); // exponential-ish backoff
        } else {
          console.log('Max retries reached. Failed to publish message.');
          this.logger.error(
            `[publishMessage] Max retries reached ${attempt}. Failed to publish message.`,
            err.message,
            err.stack,
          );

          return { status: err.message, success: false, retry: attempt };
        }
      }
    }
  }

  async publishEmailStatus(payload: any) {
    try {
      await this.publishMessage(payload);
      return { status: 'Message published successfully', success: true };
    } catch (e) {
      return { status: e.message, success: false };
    }
  }

  async updateEmailTrack(
    message_id: string,
    updateData: {
      status?: string;
      updated_at?: Date;
      is_delivered?: boolean;
      delivered_at?: string;
      is_bounced?: boolean;
      bounced_at?: string;
    },
    notificationType,
    mailMessage: NotificationMailDto,
    bounceMessage?: NotificationBounceDto,
    openMessage?: NotificationOpenDto,
  ) {
    const existingRecord = await this.emailSendRepository.findOne({
      where: { message_id: message_id },
    });

    if (!existingRecord) {
      console.log(`Record not found for message_id: ${message_id}`);
      return;
    }

    if (
      notificationType === EMAIL_SEND_NOTIFICATION.DELIVERY ||
      notificationType === EMAIL_SEND_NOTIFICATION.BOUNCE
    ) {
      if (notificationType === EMAIL_SEND_NOTIFICATION.DELIVERY) {
        updateData.is_delivered = true;
        updateData.delivered_at = mailMessage.timestamp;
      } else if (notificationType === EMAIL_SEND_NOTIFICATION.BOUNCE) {
        updateData.is_bounced = true;
        updateData.bounced_at = mailMessage.timestamp;
      }

      const updatedEntity = {
        ...existingRecord,
        ...updateData,
      };

      const savedRecord = await this.emailSendRepository.save(updatedEntity);

      if (!savedRecord) {
        throw new BadRequestException(`Email send update record failed`);
      }
    }

    let result = '';
    if (bounceMessage) {
      result = JSON.stringify(bounceMessage);
    } else if (openMessage) {
      result = JSON.stringify(openMessage);
    }
    await this.emailSentResultsRepository.addRecord(
      message_id,
      existingRecord.email_send_key,
      notificationType,
      result,
    );
  }

  async onModuleDestroy() {
    await this.producerService.onModuleDestroy();
  }
}
