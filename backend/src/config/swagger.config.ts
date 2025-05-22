import { Injectable } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfigService {
  static getConfig(port: string): OpenAPIObject {
    return {
      openapi: '3.0.0',
      info: {
        title: 'KF-ONE API Template',
        version: '1.0',
        description: 'Comprehensive list of API resources available.',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'kfone-template-api',
          description: 'operation groups',
        },
      ],
      paths: {},
      components: {
        schemas: {},
      },
    };
  }
}
