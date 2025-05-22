import { HttpService } from '@nestjs/axios';
import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import axios from 'axios';
import { Request, Response } from 'express';
import {
  EMAIL_SEND_NOTIFICATION,
  EMAIL_SEND_STATUS,
} from '../config/constants';
import { EmailSend } from '../entities';
import { LoggerService } from '../logger';
import { AppConfigService, EmailTemplateInitAppService } from '../services';
import { NotificationDto } from './../dtos/email-track.dto';
import { PublishDtoArray } from './../dtos/publish.dto';
import { EmailSendRepository } from './../repositories';
import {
  MessageService,
  SnsSignatureVerificationService,
} from './../services/index';

interface ErrorItem {
  error: string;
  item: any;
}

@ApiTags('email')
@Controller({
  path: 'email',
  version: '1',
})
export default class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly snsSignatureService: SnsSignatureVerificationService,
    private readonly logger: LoggerService,
    private readonly initService: EmailTemplateInitAppService,
    private readonly emailSendRepository: EmailSendRepository,
    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('publish')
  @ApiOperation({
    summary: 'Publish Array of Email Messages',
    description:
      'Publish an array of messages to RabbitMQ for email processing',
    operationId: 'publishArray-emailtemplate-skip_KfOneAuthorizer',
  })
  @ApiCreatedResponse({
    description: 'Message successfully published to RabbitMQ',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Not authorized to publish messages',
  })
  async publishArr(
    @Body()
    body: PublishDtoArray[],
  ) {
    const response = {
      sent: 0,
      errors: 0,
      errorItems: [] as ErrorItem[],
    };

    for (var message of body) {
      const validatation: any =
        await this.initService.validateEmailPayload(message);
      if (!validatation.errorItems.length) {
        response.sent++;
        await this.messageService.publishMessage(message);
      } else {
        response.errors++;
        response.errorItems.push(...validatation.errorItems);
      }
    }

    return response;
  }

  // @Get('/handleRequest')
  // @ApiOperation({
  //   summary: 'Call Email Service Directly',
  //   description: '',
  //   operationId: '',
  // })
  // @ApiCreatedResponse({
  //   description: '',
  // })
  // @ApiForbiddenResponse({
  //   description: 'Forbidden - Not authorized to Call Email Service Directly',
  // })
  // async handleRequest() {
  //   const test = {
  //     emailTemplateKey: 'a4d7741a-a4c5-46b0-a520-96d602ea5ad1',
  //     firstName: 'xxxxxxx',
  //     lastName: 'pxxx',
  //     languageCode: 'en-US',
  //     workspaceUserKey: '2f83aa25-5c20-4dc8-aebb-5f15a26c06a4',
  //     toEmailaddress: 'tttttt@test.com',
  //     campaignKey: 'e8d7ff7c-4b50-47a1-b2ba-8c75eaec91b8',
  //     launchedDate: '2025-04-15',
  //     loginUrl: 'https://home.kornferrytalent-dev.com',
  //     campaignName: 'TestD_1504_RemEmail1',
  //     emailCategoryCode: 'ASSESSMENT_REMINDER',
  //     metaData: {
  //       trackerKey: '8c52833d-06a9-4226-9a23-2348f343f941',
  //     },
  //   };
  //   const kfoneObj: any = {
  //     payload: JSON.stringify(test),
  //     properties: {
  //       payloadId: null,
  //       traceId: '8c52833d-06a9-4226-9a23-2348f343f941',
  //       applicationId: null,
  //     },
  //   };
  //   return this.initService.handleMessage(kfoneObj);
  // }

  @Post('track')
  @ApiOperation({
    summary: 'Track Email Status',
    description: 'Handle SNS notifications for email delivery status',
    operationId: 'track-emailtemplate-skip_KfOneAuthorizer',
  })
  @ApiCreatedResponse({
    description: 'Successfully processed SNS notification',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Invalid SNS notification',
  })
  track(@Body() body: any, @Req() req: any) {
    const rawMessage = req.rawBody ? req.rawBody.toString() : body;
    this.logger.info('From track', rawMessage);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Track Email Status',
    description: 'Handle SNS notifications for email delivery status',
    operationId: 'webhook-emailtemplate-skip_KfOneAuthorizer',
  })
  @ApiCreatedResponse({
    description: 'Successfully processed SNS notification',
    type: Boolean,
  })
  @HttpCode(200)
  async handleSnsWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('handleSnsWebhook:1');
    this.logger.info(JSON.stringify(req.body), 'SNS Message Received');

    const snsMessage = req.body ?? JSON.parse(req.body ?? {}) ?? '';

    if (snsMessage.Type === 'SubscriptionConfirmation') {
      const subscribeUrl = snsMessage.SubscribeURL;
      console.log('Subscription URL:', subscribeUrl);

      // Confirm the subscription by visiting the SubscribeURL
      try {
        const response = await axios.get(subscribeUrl);
        this.logger.info(response.data, 'Subscription confirmed successfully.');
        console.log('Subscription confirmed successfully.');
        return res.status(200).send('Subscription confirmed.');
      } catch (error) {
        console.error('Failed to confirm subscription:', error);
        return res.status(500).send('Failed to confirm subscription.');
      }
    }

    // Handle Notifications
    if (snsMessage.Type === 'Notification') {
      try {
        console.log('Received notification:', snsMessage.Message);

        const isValidSignature =
          await this.snsSignatureService.verifySnsMessage(snsMessage);

        if (!isValidSignature) {
          this.logger.error(
            `Invalid SNS message signature. SNS Message ID : ${snsMessage.MessageId}`,
          );
          throw new Error('Invalid SNS message signature');
        }

        const messageObj: NotificationDto = JSON.parse(snsMessage.Message);

        await this.messageService.updateEmailTrack(
          messageObj?.mail?.messageId,
          {
            status: messageObj?.bounce
              ? EMAIL_SEND_STATUS.ERROR
              : EMAIL_SEND_STATUS.SENT,
            updated_at: new Date(),
          },
          messageObj?.eventType,
          messageObj?.mail,
          messageObj?.bounce,
          messageObj?.open,
        );

        // check if the message Id in email_send table has meta data and a trackerkey inside it
        const emailSendObj: EmailSend | null =
          await this.emailSendRepository.getEmailSendByMessageId(
            messageObj?.mail?.messageId,
          );
        if (emailSendObj?.meta_data) {
          const meta_data = emailSendObj?.meta_data
            ? typeof emailSendObj.meta_data === 'string'
              ? JSON.parse(emailSendObj.meta_data)
              : emailSendObj.meta_data
            : {};
          if (
            (meta_data.trackerKey &&
              (messageObj?.eventType as string) ===
                EMAIL_SEND_NOTIFICATION.DELIVERY) ||
            (messageObj?.eventType as string) === EMAIL_SEND_NOTIFICATION.BOUNCE
          ) {
            // call workflow API
            try {
              const data = JSON.stringify({
                meta_data,
                status: messageObj?.eventType,
              });

              const WORKFLOW_DOMAIN =
                this.appConfigService.getConfigValue('WORKFLOW_DOMAIN');

              this.httpService.post(
                `${WORKFLOW_DOMAIN}/v1/email/trackerUpdate`,
                data,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              );
            } catch (error) {
              this.logger.error(
                error.message,
                '[SESWebhook] trackerUpdate',
                error.stack,
                req.body,
              );
              console.log(error);
            }
          }
        }

        return res.status(200).send('Notification received.');
      } catch (e) {
        console.error('Failed to confirm subscription:', e.message);
        this.logger.error(e.message, '[SESWebhook] Error', e.stack, req.body);
        return res.status(500).send('Failed to updated DB.');
      }
    }
  }
}
