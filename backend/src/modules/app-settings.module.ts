import { Module } from '@nestjs/common';
import { AppSettingsController } from '../controllers';

@Module({
  controllers: [AppSettingsController],
})
export default class AppConfigModule {}
