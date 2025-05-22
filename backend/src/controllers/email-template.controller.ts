import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  //ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CheckTemplateNameDto,
  EmailDelete,
  EmailTemplatesDto,
  UpdateEmailTemplateLanguagesDto,
} from 'dtos';
import { LoggerService } from '../logger';
import { fetchSecrets, fromBase64Unicode } from '../utilities';
import { EmailService } from './../services/email.service';

@ApiTags('emailtemplate')
@Controller({
  path: 'emailtemplate',
  version: '1',
})
export default class EmailTemplateController {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  @Post('/check-template-name')
  @ApiOperation({
    summary: 'checkTemplateName',
    description: 'checkTemplateName',
    operationId: 'checkTemplateName-emailtemplate-view',
  })
  @ApiCreatedResponse({
    description: 'Check if the template name exists.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async checkTemplateName(
    @Body()
    body: CheckTemplateNameDto,
  ) {
    const { template_name, workspace_key, item_key } = body;

    if (!template_name || !workspace_key || !item_key) {
      throw new HttpException(
        'Template name, Workspace Key and Client Key is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.emailService.checkIfTemplateNameExists({
      template_name,
      workspace_key,
      item_key,
    });

    return {
      exists,
      message: exists
        ? 'Template name already exists. Please choose a different name.'
        : null,
    };
  }

  // @Get('/template/:template_key/language/:language_code')
  // api gateway throws error "Execution failed due to configuration error: Illegal character in path at index 76: "
  //  so I have to remove the path parameter and use query parameter instead. no idea why its throws error.
  @Get('/template')
  @ApiOperation({
    summary: 'getEmailTemplateById',
    description: 'getEmailTemplateById',
    operationId: 'getEmailTemplateById-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @ApiQuery({ name: 'email_category_key', required: false, type: String })
  getEmailTemplateById(
    @Query('template_key') template_key: string,
    @Query('language_code') language_code: string,
    @Query('email_category_key') email_category_key?: string,
  ): Promise<any> {
    return this.emailService.getEmailTemplateById(
      template_key,
      language_code,
      email_category_key,
    );
  }

  @Post('/template')
  @ApiOperation({
    summary: 'getEmailTemplates',
    description: 'getEmailTemplates',
    operationId: 'getEmailTemplates-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Templates has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getEmailTemplates(@Body() body: EmailTemplatesDto[]): Promise<any> {
    return await this.emailService.getEmailTemplates(body);
  }

  @Post('/template/delete')
  @ApiOperation({
    summary: 'Delete Email Template',
    description: 'Delete an email template by its key',
    operationId: 'deleteEmailTemplate-emailtemplate-edit',
  })
  @ApiOkResponse({
    status: 200,
    description: 'The email template has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async deleteEmailTemplate(
    @Body() dto: EmailDelete,
  ): Promise<Record<string, any>> {
    return await this.emailService.deleteEmailTemplates(dto.templateKeys);
  }

  @ApiResponse({ status: 404, description: 'Email template not found.' })
  @Get('/template/search')
  @ApiOperation({
    summary: 'Search Email Templates',
    description: 'Search for email templates by a search string',
    operationId: 'searchEmailTemplates-emailtemplate-view',
  })
  @ApiOkResponse({
    status: 200,
    description: 'The email templates have been successfully retrieved.',
  })
  @ApiQuery({ name: 'email_category_key', required: false, type: String })
  @ApiQuery({ name: 'workspace_key', required: false, type: String })
  @ApiQuery({ name: 'item_key', required: false, type: String })
  @ApiQuery({ name: 'lang', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort_by', required: false, type: String })
  async searchEmailTemplates(
    @Query('search') search: string,
    @Query('email_category_key') emailCategoryKey?: string,
    @Query('workspace_key') workspaceKey?: string,
    @Query('item_key') itemKey?: string,
    @Query('lang') lang?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ): Promise<Record<string, any>> {
    return await this.emailService.searchEmailTemplates(
      search,
      emailCategoryKey,
      workspaceKey,
      itemKey,
      lang,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Get('/workspace')
  @ApiOperation({
    summary: 'getWorkspaceKey',
    description: 'getWorkspaceKey',
    operationId: 'getWorkspaceKey-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Workspace key has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getWorkspaceKey(
    @Query('workspace_name') workspace_name: string,
  ): Promise<any> {
    if (!workspace_name) {
      throw new HttpException(
        'Workspace name is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.emailService.getWorkspaceKey(workspace_name);
  }

  //@Get('/email/:email_category_key')
  // api gateway throws error "Execution failed due to configuration error: Illegal character in path at index 76: "
  //  so I have to remove the path parameter and use query parameter instead. no idea why its throws error.
  @Get('/email')
  @ApiOperation({
    summary: 'getEmailTemplate',
    description: 'getEmailTemplate',
    operationId: 'getEmailTemplateByCategory-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @ApiQuery({ name: 'item_key', required: false, type: String })
  // @ApiQuery({ name: 'lang', required: false, type: String })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  //  @ApiQuery({ name: 'limit', required: false, type: Number })
  getEmailTemplate(
    @Query('email_category_key') emailCategoryKey: string,
    @Query('workspace_key') workspaceKey?: string,
    @Query('item_key') itemKey?: string,
    @Query('lang') lang?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ): Promise<any> {
    return this.emailService.getEmailTemplate(
      emailCategoryKey,
      workspaceKey,
      itemKey,
      lang,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Get('/test/:email_category_key')
  @ApiOperation({
    summary: 'getEmailTemplate',
    description: 'getEmailTemplate',
    operationId:
      'getEmailTemplateByCategorytest-emailtemplate-skip_KfOneAuthorizer',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @ApiQuery({ name: 'item_key', required: false, type: String })
  // @ApiQuery({ name: 'lang', required: false, type: String })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  //  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getEmailTemplate1(
    @Param('email_category_key') emailCategoryKey: string,
  ): Promise<string> {
    const sesSecret = await fetchSecrets(
      '/system/platform/api-creds/connect-ses',
      'us-east-1',
    );
    console.log(sesSecret);

    return emailCategoryKey;
  }

  @Get('/test2')
  @ApiOperation({
    summary: 'getEmailTemplate',
    description: 'getEmailTemplate',
    operationId:
      'getEmailTemplateByCategory4-emailtemplate-skip_KfOneAuthorizer',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @ApiQuery({ name: 'item_key', required: false, type: String })
  // @ApiQuery({ name: 'lang', required: false, type: String })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  //  @ApiQuery({ name: 'limit', required: false, type: Number })
  getEmailTemplate2(
    //@Param('email_category_key') emailCategoryKey: string,
    @Query('email_category_key') email_category_key: string,
  ): string {
    this.logger.info('email_category_key', {
      email_category_key,
      context: 'mycontext',
    });

    //throw new Error('test error');

    this.logger.warn('email_category_key', 'test', 'test2', 'test3');

    return email_category_key;
  }

  @Get('/category')
  @ApiOperation({
    summary: 'getEmailCategory',
    description: 'getEmailCategory',
    operationId: 'getEmailCategoryQuery-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getEmailCategoryQuery(
    @Query('workspace_key') workspaceKey: string,
  ): Promise<any> {
    return this.emailService.getEmailCategory(workspaceKey);
  }

  @Get('/category/:workspace_key')
  @ApiOperation({
    summary: 'getEmailCategory',
    description: 'getEmailCategory',
    operationId: 'getEmailCategory-emailtemplate-view',
  })
  @ApiOkResponse({
    description: 'The Email Template has been successfully returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getEmailCategory(@Param('workspace_key') workspaceKey: string): Promise<any> {
    return this.emailService.getEmailCategory(workspaceKey);
  }

  @Put('/update-or-create')
  @ApiOperation({
    summary: 'updateOrCreate',
    description: 'updateOrCreate',
    operationId: 'updateOrCreateEmailTemplate-emailtemplate-edit',
  })
  @ApiOkResponse({
    description: 'create or update email template and languages.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async updateOrCreate(@Body() dto: UpdateEmailTemplateLanguagesDto) {
    const cleanDto = { ...dto, body: fromBase64Unicode(dto.body ?? '') };
    const result =
      await this.emailService.updateOrCreateEmailTemplateAndLanguages(cleanDto);
    return {
      success: true,
      data: result,
    };
  }

  // @Post('/updateorcreate')
  // @ApiOperation({
  //   summary: 'updateOrCreate-post',
  //   description: 'updateOrCreate',
  //   operationId: 'updateOrCreateEmailTemplatepost-emailtemplate-edit',
  // })
  // @ApiOkResponse({
  //   description: 'create or update email template and languages.',
  // })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // async updateOrCreate2(@Body() dto: UpdateEmailTemplateLanguagesDto) {
  //   const result =
  //     await this.emailService.updateOrCreateEmailTemplateAndLanguages(dto);
  //   return {
  //     success: true,
  //     data: result,
  //   };
  // }

  // @Put(':template_language_key')
  // @ApiOperation({
  //   summary: 'updateEmailTemplateLanguage',
  //   description: 'updateEmailTemplateLanguage',
  //   operationId: 'updateEmailTemplateLanguage-emailtemplate-edit',
  // })
  // @ApiOkResponse({
  //   description: 'The email template has been successfully updated.',
  // })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // async updateEmailTemplateLanguage(
  //   @Param('template_language_key') template_language_key: string,
  //   @Body() updateDto: UpdateEmailTemplateLanguagesDto,
  // ) {
  //   return this.emailService.updateEmailTemplateLanguage(
  //     template_language_key,
  //     updateDto,
  //   );
  // }
}
