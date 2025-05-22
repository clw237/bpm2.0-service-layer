import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './config/swagger.config';
import ExceptionFilter from './filters/exception-filter';
import { LoggerService } from './logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = '8081'; //DO NOT CHANGE THIS LINE  (if you change the port number ,deployment will fail). Do not check in the changes to this line.

    const logger = app.get(LoggerService);
    // Enable URI Based Versioning
    app.enableVersioning({
      type: VersioningType.URI,
      /** This is the default version of the API */
      defaultVersion: VERSION_NEUTRAL,
    });

    app.enableCors();
    app.useGlobalFilters(new ExceptionFilter(logger));

    // ValidationPipe is used for class-validator and class-transformer validation
    app.useGlobalPipes(
      new ValidationPipe({
        /** This will remove any additional properties that are not defined in the DTO */
        whitelist: true,
      }),
    );

    // Swagger setup
    const {
      info,
      servers = [],
      tags = [],
    }: OpenAPIObject = SwaggerConfigService.getConfig(port);
    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(info.title)
      .setDescription(info.description ?? '')
      .setVersion(info.version)
      .addServer(servers[0].url, servers[0].description)
      .addTag(tags[0].name, tags[0].description)
      .addSecurity('KfOneAuthorizer', {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        'x-amazon-apigateway-authorizer': {
          authorizerResultTtlInSeconds: 300,
          authorizerUri:
            'arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambda_authorizer_arn}/invocations',
          identitySource: 'method.request.header.Authorization',
          type: 'request',
        },
        'x-amazon-apigateway-authtype': 'Custom',
      } as any)
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    for (const path in document.paths) {
      for (const method in document.paths[path]) {
        if (document.paths[path][method]?.operationId) {
          if (
            document.paths[path][method]?.operationId !== 'gethealthcheck' &&
            document.paths[path][method]?.operationId.indexOf(
              'skip_KfOneAuthorizer',
            ) === -1
          ) {
            document.paths[path][method].security = [
              {
                KfOneAuthorizer: [],
              },
            ];
          }
        }

        let pathParams = {} as Record<string, string>;

        const params = document.paths[path][method]?.parameters;
        if (params && params.length > 0) {
          for (const param of params) {
            if (param.in === 'path') {
              pathParams[`integration.request.path.${param.name}`] =
                `method.request.path.${param.name}`;
            }
          }
        }
        let integration = {
          uri: '${backend_url}' + path,
          httpMethod: method?.toUpperCase(),
          type: 'http_proxy',
          connectionType: 'VPC_LINK',
          connectionId: '${vpc_link_id}',
          passthroughBehavior: 'when_no_match',
          timeoutInMillis: '${timeout_in_millis}',
          tlsConfig: {
            insecureSkipVerification: true,
          },
        } as any;

        if (Object.keys(pathParams).length > 0) {
          integration.requestParameters = pathParams;
        }

        document.paths[path][method]['x-amazon-apigateway-integration'] =
          integration;
      }
      // eslint-disable-next-line @typescript-eslint/dot-notation
      document.paths[path]['optionsTODO'] = '${cors_data}TODO';
    }

    // How to update swagger in shared services repo
    // 1. Run locally and get JSON
    // 2. Replace '${cors_data}TODO' with ${cors_data}    (make sure to remove quotes)
    // 3. Replace "optionsTODO" with options
    SwaggerModule.setup('swagger', app, document, {
      jsonDocumentUrl: 'swagger/json',
    });

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('An error occurred during the bootstrap process:', error);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
});
