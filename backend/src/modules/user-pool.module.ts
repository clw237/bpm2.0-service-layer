import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoolController } from 'controllers';
import { ConsumerModule, ProducerModule } from 'kfone-mq-library';
import { UserPool, UserPoolAttributes, UserPoolLog } from '../entities';
import {
  UserPoolAttributesDefRepository,
  UserPoolAttributesRepository,
  UserPoolLogRepository,
  UserPoolRepository,
} from '../repositories';
import { UserPoolService } from '../services/index';

@Module({
  imports: [
    ConsumerModule,
    ProducerModule,
    // Add TypeOrmModule.forFeature to register the entities
    TypeOrmModule.forFeature([UserPool, UserPoolAttributes, UserPoolLog]),
  ],
  providers: [
    UserPoolService,
    UserPoolRepository,
    UserPoolAttributesRepository,
    UserPoolAttributesDefRepository,
    UserPoolLogRepository,
  ],
  controllers: [UserPoolController],
  exports: [
    UserPoolService,
    UserPoolRepository,
    UserPoolAttributesRepository,
    UserPoolAttributesDefRepository,
    UserPoolLogRepository,
  ],
})
export class UserPoolModule {}
