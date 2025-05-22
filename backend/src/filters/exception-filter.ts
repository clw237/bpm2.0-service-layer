import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../logger';

@Catch()
export default class ExceptionLoggerFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    const obj = {
      message: JSON.stringify(message),
      stack: exception.stack,
      status,
      path: request.url,
    };

    this.logger.error(
      message,
      exception.stack,
      request.url,
      request.method,
      JSON.stringify(request.body ?? {}),
    );
    console.log('ExceptionLoggerFilter', obj);

    // Send response
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
