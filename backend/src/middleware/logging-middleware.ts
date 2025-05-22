import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import LoggerService from '../logger/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = LoggerService.getInstance();
  //constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, headers, query } = req;

    const message = {
      method,
      url,
      body,
      query,
      headers,
    };
    console.log(JSON.stringify(message));
    //this.logger.info(JSON.stringify(message), 'HTTP Request');
    this.logger.info(JSON.stringify(message), 'HTTP Request');
    next();
  }
}
