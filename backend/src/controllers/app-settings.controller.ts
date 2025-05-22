import { Controller, Get, Param } from '@nestjs/common';
import { AppConfigService } from '../services';

@Controller({
  path: 'appsettings',
  version: '1',
})
export default class AppSettingsController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('/appconfigtest')
  getConfig(): string {
    return process.env.NODE_ENV ?? 'not set';
  }

  @Get('/appconfigtest/:key')
  getConfigByKey(@Param('key') key: string): string {
    return this.appConfigService.getDebug(key);
  }

  @Get('/date')
  date(): any {
    const date = new Date();
    const toISOString = date.toISOString();
    const toLocaleString = date.toLocaleString();
    const toLocaleDateString = date.toLocaleDateString();
    const toLocaleTimeString = date.toLocaleTimeString();

    return {
      date,
      toISOString,
      toLocaleString,
      toLocaleDateString,
      toLocaleTimeString,
    };
  }
}
