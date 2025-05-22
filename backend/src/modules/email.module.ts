import { Module } from '@nestjs/common';
import { Email1Service } from '../services/email1.service';

@Module({
  imports: [],
  providers: [Email1Service],
})
export default class EmailModule {}
