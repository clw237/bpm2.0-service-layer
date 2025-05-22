import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmailWhiteListDto } from './../dtos';
import { EmailWhiteListService } from './../services/email-whitelist.service';

@ApiTags('emailWhitelist')
@Controller({
  path: 'emailWhitelist',
  version: '1',
})
export default class EmailWhitelistController {
  constructor(private readonly emailWhiteListService: EmailWhiteListService) {}

  @Post('add')
  @ApiOperation({
    summary: 'Add email to whitelist',
    description: 'Add email to whitelist',
    operationId: 'add-emailwhitelist-skip_KfOneAuthorizer',
  })
  @ApiCreatedResponse({
    description: 'Email added to whitelist',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Not authorized to add email to whitelist',
  })
  async add(
    @Body()
    body: EmailWhiteListDto,
  ) {
    const { emails } = body;
    for (var email of emails) {
      await this.emailWhiteListService.addRecord(email);
    }
  }
}
