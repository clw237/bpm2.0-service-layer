import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { secretManagerConfig } from 'config';
import { Log } from 'entities';
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
    entities: [Log],
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  };
};
