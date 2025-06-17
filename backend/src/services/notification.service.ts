import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ReminderDto } from 'src/dtos';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendReminder(payload: ReminderDto) {
    this.logger.log(`Forwarding reminder to KFOne: ${JSON.stringify(payload)}`);
    await firstValueFrom(
      this.httpService.post(
        `${process.env.KFONE_API_URL}/notifications`,
        payload,
      ),
    );
  }
}
