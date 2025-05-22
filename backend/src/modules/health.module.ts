import { Module } from '@nestjs/common';
import { HealthController } from 'controllers';
import { ConsumerModule, ProducerModule } from 'kfone-mq-library';

@Module({
  imports: [ProducerModule, ConsumerModule],
  providers: [],
  controllers: [HealthController],
})
export default class HealthModule {}
