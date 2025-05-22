import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { secretManagerConfig } from 'config';
import {
  EmailCategory,
  EmailCategoryMergeFields,
  EmailCategoryScheduleType,
  EmailSend,
  EmailSentResults,
  EmailTemplate,
  EmailTemplateLanguages,
  EmailWhiteList,
  Log,
  SchedulerEmails,
  Schedulers,
  ScheduleTaskLog,
  ScheduleTypes,
  User,
  UserPool,
  UserPoolAttributes,
  UserPoolAttributesDef,
  UserPoolLog,
  Workspace,
} from 'entities';
import { DatabaseConfig } from 'src/dtos/appconfig.dto';

export const typeOrmPostgresConfig = async (
  databaseConfig: DatabaseConfig,
): Promise<TypeOrmModuleOptions> => {
  const schemaName = process.env.SCHEMA_NAME;
  const dbType = 'postgres';

  // Fetch secrets from secret manager
  const secrets = await secretManagerConfig();
  const { username, password } = secrets.database;

  return {
    type: dbType as 'postgres',
    url: `postgres://${username}:${encodeURIComponent(password)}@${process.env.DB_HOST ?? databaseConfig.host}:${process.env.DB_PORT ?? databaseConfig.port}/${process.env.DB_DATABASE ?? databaseConfig.database}?schema=${schemaName}&sslMode=Prefer`,
    schema: schemaName,
    //logging: true,
    entities: [
      User,
      EmailTemplateLanguages,
      EmailTemplate,
      ScheduleTypes,
      EmailCategoryScheduleType,
      EmailCategory,
      EmailCategoryMergeFields,
      Workspace,
      Schedulers,
      ScheduleTaskLog,
      EmailSend,
      EmailSentResults,
      EmailWhiteList,
      Log,
      UserPool,
      UserPoolLog,
      UserPoolAttributes,
      UserPoolAttributesDef,
      SchedulerEmails,
    ],
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  };
};
