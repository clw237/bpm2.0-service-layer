import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KFONE_EVENTS',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          // Get and validate values
          const url = config.get<string>('RABBITMQ_URL');
          const queue = config.get<string>('KFONE_EVENT_QUEUE');
          if (!url || !queue) {
            throw new Error('RABBITMQ_URL and KFONE_EVENT_QUEUE must be set');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
              queueOptions: { durable: true },
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
