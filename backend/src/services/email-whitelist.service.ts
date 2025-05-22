import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailWhiteListRepository } from '../repositories/index';

@Injectable()
export class EmailWhiteListService {
  constructor(private emailWhiteListRepository: EmailWhiteListRepository) {}

  async checkIfEmailWhiteListed(email: string): Promise<boolean> {
    const existingRecord = await this.emailWhiteListRepository.findOne({
      where: { email: email },
    });

    return existingRecord ? true : false;
  }

  async addRecord(email_address: string): Promise<string | null> {
    const email_send_key =
      await this.emailWhiteListRepository.addRecord(email_address);
    if (!email_send_key) {
      throw new BadRequestException(`whitelist email add record failed`);
    }
    return email_send_key;
  }
}
