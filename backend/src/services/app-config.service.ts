/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectApplicationConfig } from '../dtos/appconfig.dto';

@Injectable()
export default class AppConfigService {
  constructor(
    private configService: ConfigService,
    private connectAppConfig: ConnectApplicationConfig,
  ) {}

  getConfigValue(key: string): string {
    return this.get<string>(key);
  }

  get<T>(key: string): T {
    return (
      this.configService.get<T>(key) ?? (this.connectAppConfig as any)[key]
    );
  }

  getDebug<T>(key: string): string {
    const s1 = this.configService.get<T>(key) ?? '';
    const s2 = (this.connectAppConfig as any)[key] ?? '';
    return `${s1} - ${s2}`;
  }
}
