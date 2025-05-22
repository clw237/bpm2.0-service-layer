import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailWhitelistController } from '../controllers';
import { EmailWhiteListRepository } from '../repositories';
import { EmailWhiteListService } from '../services/email-whitelist.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailWhiteListService, EmailWhiteListRepository],
  controllers: [EmailWhitelistController],
  exports: [EmailWhiteListService, EmailWhiteListRepository],
})
export default class EmailWhitelistModule {}
