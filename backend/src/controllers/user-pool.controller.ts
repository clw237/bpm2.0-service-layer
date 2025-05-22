import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PublishDto } from 'dtos';
import { UserPoolService } from '../services/index';

@ApiTags('userPool')
@Controller({
  path: 'userPool',
  version: '1',
})
export default class UserPoolController {
  constructor(private readonly userPoolService: UserPoolService) {}

  @Post('publish')
  @ApiOperation({
    summary: 'Publish User Message',
    description: 'Publish a message to RabbitMQ for User sync',
    operationId: 'publish-user-skip_KfOneAuthorizer',
  })
  @ApiCreatedResponse({
    description: 'Message successfully published to RabbitMQ',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Not authorized to publish messages',
  })
  publishUser(
    @Body()
    body: PublishDto,
  ) {
    const { message } = body;
    return this.userPoolService.publishUserMessage(message);
  }

  // @Get('/handleUserPoolRequest')
  // @ApiOperation({
  //   summary: 'Call User Pool Service Directly',
  //   description: '',
  //   operationId: '',
  // })
  // @ApiCreatedResponse({
  //   description: '',
  // })
  // @ApiForbiddenResponse({
  //   description: 'Forbidden - Not authorized to Call Email Service Directly',
  // })
  // handleUserPoolRequest() {
  //   const message = {
  //     emailTemplateKey: '65815446-275c-4cb4-a33b-f1924355f371',
  //     firstName: 'Dinesh',
  //     lastName: 'Yadav',
  //     languageCode: 'en-US',
  //     key: 'Key1',
  //     template_key: '832e16ed-39f3-4441-a18f-656b62e72d0g',
  //     workspaceKey: '832e16ed-39f3-4441-a18f-656b62e72d0f',
  //     workspaceUserKey: '832e16ed-39f3-4441-a18f-656b62e72d0f',
  //     toEmailaddress: 'KFONE_DEV@kornferry.com',
  //     clientKey: '5aa0d243-89ba-4484-9a35-f2cc3d1f7325',
  //   };
  //   const kfoneObj: any = {
  //     payload: JSON.stringify(message),
  //     properties: {
  //       payloadId: null,
  //       traceId: null,
  //       applicationId: null,
  //     },
  //   };
  //   return this.userPoolService.handleUserMessage(kfoneObj);
  // }
}
