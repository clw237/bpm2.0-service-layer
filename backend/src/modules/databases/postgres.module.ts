import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmPostgresConfig } from 'config';
import { TypedConfigModule } from 'nest-typed-config';
import { DatabaseConfig } from 'src/dtos/appconfig.dto';

@Module({
  imports: [
    TypedConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [TypedConfigModule],
      useFactory: async (databaseConfig: DatabaseConfig) =>
        await typeOrmPostgresConfig(databaseConfig),
      inject: [DatabaseConfig],
    }),
  ],
})
export default class PostgresDatabaseModule {}
