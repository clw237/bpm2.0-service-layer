import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsumerService, ProducerService } from 'kfone-mq-library';

@ApiTags('health')
@Controller({
  path: '/',
})
export default class HealthCheckController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Health check API',
    description: 'Health Check API',
    operationId: 'gethealthcheck',
  })
  @ApiOkResponse({ description: 'Health check API' })
  healthcheck() {
    try {
      return HttpStatus.OK;
    } catch (err) {
      throw err;
    }
  }

  @Get('rabbitmq')
  @ApiOperation({
    summary: 'Health check API',
    description: 'Health Check API',
    operationId: 'gethealthcheck',
  })
  checkRabbitMQHealth(): { status: string } {
    const isProducerConnected = this.producerService.isConnected();
    const isConsumerConnected = this.consumerService.isConnected();
    console.log('isProducerConnected', isProducerConnected);
    console.log('isConsumerConnected', isConsumerConnected);
    return {
      status:
        isProducerConnected && isConsumerConnected
          ? 'RabbitMQ is healthy'
          : 'RabbitMQ is not connected',
    };
  }
}
