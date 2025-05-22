import { Controller } from '@nestjs/common';
import {
  // ApiCreatedResponse,
  // ApiForbiddenResponse,
  // ApiOkResponse,
  // ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// import { LoggerService } from '../logger';

@ApiTags('emailsender')
@Controller({
  path: 'emailsender',
  version: '1',
})
export default class EmailSenderController {
  /*
  private readonly logger = LoggerService.getInstance();
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @Post('send-email')
  @ApiOperation({
    summary: 'sendEmail',
    description: 'sendEmail',
    operationId: 'sendEmail-emailtemplate-add',
  })
  @ApiCreatedResponse({
    description: 'The email has been successfully sent.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  sendEmail(@Body() dto: SendEmailDto): Promise<void> {
    return this.emailSenderService.sendEmail(dto);
  }

  @Get('all-emails')
  @ApiOperation({
    summary: 'getAllEmails',
    description: 'getAllEmails',
    operationId: 'getAllEmails-emailtemplate-lists',
  })
  @ApiOkResponse({
    description: 'Fetched all sent emails.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getAllEmails(): Promise<Email[]> {
    return this.emailSenderService.getAllEmails();
  }

  @Get(':email_id')
  @ApiOperation({
    summary: 'getEmailById',
    description: 'getEmailById',
    operationId: 'getEmailById-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'Fetched email by ID.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getEmailById(@Param('email_id') email_id: string): Promise<Email> {
    return this.emailSenderService.getEmailById(email_id);
  }

  @Patch(':email_id')
  @ApiOperation({
    summary: 'updateEmail',
    description: 'updateEmail',
    operationId: 'updateEmail-emailtemplate-edit',
  })
  @ApiOkResponse({
    description: 'The email has been successfully updated.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  updateEmail(
    @Param('email_id') email_id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<Email> {
    return this.emailSenderService.updateEmail(email_id, updateEmailDto);
  }

  @Delete(':email_id')
  @ApiOperation({
    summary: 'deleteEmail',
    description: 'deleteEmail',
    operationId: 'deleteEmail-emailtemplate-edit',
  })
  @ApiOkResponse({
    description: 'The email has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  deleteEmail(@Param('email_id') email_id: string): Promise<void> {
    return this.emailSenderService.deleteEmail(email_id);
  }
  */
}
