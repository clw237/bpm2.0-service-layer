import { IsDefined, IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  @IsDefined()
  database: string;

  @IsString()
  @IsDefined()
  host: string;

  @IsString()
  @IsDefined()
  port: string;
}

export class ConnectApplicationConfig {
  @IsString()
  @IsDefined()
  AWS_REGION: string;

  @IsString()
  @IsDefined()
  AWS_SECRET_NAME: string;

  @IsString()
  @IsDefined()
  RABBITMQ_SECRET_NAME: string;

  @IsString()
  @IsDefined()
  LOG_TO_DB: string;

  @IsString()
  @IsDefined()
  LOGIN_URL: string;
}
