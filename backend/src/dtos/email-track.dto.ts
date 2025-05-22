import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { EMAIL_SEND_NOTIFICATION } from './../config/constants';

type EmailSendNotificationType =
  (typeof EMAIL_SEND_NOTIFICATION)[keyof typeof EMAIL_SEND_NOTIFICATION];

export class NotificationBounceRecipientsDto {
  @ApiProperty({
    description: 'emailAddress',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    description: 'action',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: 'status',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'diagnosticCode',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  diagnosticCode: string;
}

export class NotificationMailHeaders {
  @ApiProperty({
    description: 'name',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'value',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class MailCommonHeadersDto {
  @ApiProperty({
    description: 'from',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: 'date', type: String, format: 'date' })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'to',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'messageId',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'subject',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}

export class MailTagsDto {
  @ApiProperty({
    description: 'ses:source-tls-version',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:source-tls-version': string[];

  @ApiProperty({
    description: 'ses:operation',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:operation': string[];

  @ApiProperty({
    description: 'ses:configuration-set',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:configuration-set': string[];

  @ApiProperty({
    description: 'ses:source-ip',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:source-ip': string[];

  @ApiProperty({
    description: 'ses:from-domain',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:from-domain': string[];

  @ApiProperty({
    description: 'ses:caller-identity',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  'ses:caller-identity': string[];
}

export class NotificationMailDto {
  @ApiProperty({ description: 'Timestamp', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'source',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({
    description: 'sourceArn',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sourceArn: string;

  // @ApiProperty({
  //   description: 'sourceIp',
  //   type: String,
  //   required: true,
  // })
  // @IsString()
  // @IsNotEmpty()
  // sourceIp: string;

  @ApiProperty({
    description: 'sendingAccountId',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sendingAccountId: string;

  @ApiProperty({
    description: 'messageId',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'destination',
    type: Array<string>,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  destination: string[];

  @ApiProperty({
    description: 'headersTruncated',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  headersTruncated: boolean;

  @ApiProperty({
    description: 'headers',
    type: [NotificationMailHeaders],
    required: true,
  })
  @IsNotEmpty()
  headers: NotificationMailHeaders[];

  @ApiProperty({
    description: 'commonHeaders',
    type: MailCommonHeadersDto,
    required: true,
  })
  @IsNotEmpty()
  commonHeaders: MailCommonHeadersDto;

  @ApiProperty({
    description: 'tags',
    type: MailTagsDto,
    required: true,
  })
  @IsNotEmpty()
  tags: MailTagsDto;
}

export class NotificationBounceDto {
  @ApiProperty({
    description: 'feedbackId',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  feedbackId: string;

  @ApiProperty({
    description: 'bounceType',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bounceType: string;

  @ApiProperty({
    description: 'bounceSubType',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bounceSubType: string;

  @ApiProperty({
    description: 'bouncedRecipients',
    type: [NotificationBounceRecipientsDto],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  bouncedRecipients: NotificationBounceRecipientsDto[];

  @ApiProperty({ description: 'timestamp', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'reportingMTA',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reportingMTA: string;
}

export class NotificationOpenDto {
  @ApiProperty({ description: 'timestamp', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'userAgent',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({
    description: 'ipAddress',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}

export class NotificationDto {
  @ApiProperty({
    description: 'Type of Notification - Send/Bounce',
    type: String,
    required: true,
    enum: Object.values(EMAIL_SEND_NOTIFICATION), // This will document the possible values in Swagger
  })
  @IsString()
  @IsNotEmpty()
  eventType: EmailSendNotificationType;

  @ApiProperty({
    description: 'Mail Details',
    type: NotificationMailDto,
    required: true,
  })
  @IsObject()
  @IsNotEmpty()
  mail: NotificationMailDto;

  @ApiProperty({
    description: 'Bounce details',
    type: NotificationBounceDto,
    required: false,
  })
  @IsObject()
  bounce?: NotificationBounceDto;

  @ApiProperty({
    description: 'Open details',
    type: NotificationBounceDto,
    required: false,
  })
  @IsObject()
  open?: NotificationOpenDto;
}

export default class EmailTrackDto {
  @ApiProperty({
    description: 'Type of action - Notification',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  Type: string;

  @ApiProperty({
    description: 'Message ID',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  MessageId: string;

  @ApiProperty({
    description: 'Topic ARN',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  TopicArn: string;

  @ApiProperty({
    description: 'Message contains the SES event payload',
    type: JSON,
    required: true,
  })
  @IsString()
  @IsJSON()
  @IsNotEmpty()
  Message: string;

  @ApiProperty({ description: 'Timestamp', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  Timestamp: string;

  @ApiProperty({
    description: 'SignatureVersion',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  SignatureVersion: string;

  @ApiProperty({
    description: 'Signature',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  Signature: string;

  @ApiProperty({
    description: 'SigningCertURL',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  SigningCertURL: string;

  @ApiProperty({
    description: 'UnsubscribeURL',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  UnsubscribeURL: string;
}
