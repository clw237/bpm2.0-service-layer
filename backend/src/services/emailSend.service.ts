import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { EmailSend } from '../entities/index';
import { EmailSendRepository } from '../repositories/index';

@Injectable()
export class EmailSendService {
  constructor(private readonly emailSendRepository: EmailSendRepository) {}

  async getEmailSends(): Promise<EmailSend[]> {
    const email_sends = await this.emailSendRepository.getEmailSends();
    if (!email_sends) {
      throw new NotFoundException(`No Email Send found`);
    }
    return email_sends;
  }

  async getEmailSend(template_key: string): Promise<EmailSend> {
    const email_send =
      await this.emailSendRepository.getEmailSend(template_key);
    if (!email_send) {
      throw new NotFoundException(
        `Email send with template key ${template_key} not found`,
      );
    }
    return email_send;
  }

  async addRecord(
    email_send_key: string,
    email_address: string,
    template_key: string,
    language_code: string,
    message_id: string | null,
    workspace_user_key: string,
    status: string,
    data: string,
    error: string | null,
    meta_data: JSON | null = null,
  ): Promise<{
    success: boolean;
    email_send_key: string | null;
    message: string | null;
  }> {
    const result = await this.emailSendRepository.addRecord(
      email_send_key,
      email_address,
      template_key,
      language_code,
      message_id,
      workspace_user_key,
      status,
      data ?? '',
      error ?? '',
      meta_data,
    );
    if (!result) {
      throw new BadRequestException(`Email send add record failed`);
    }
    return result;
  }

  async updateRecord(
    email_send_key: string,
    status: string,
    error: string | null,
    message_id: string | null,
    data?: string | null,
  ): Promise<UpdateResult | null> {
    const updateData: any = {
      status,
      error,
      updated_at: new Date(),
    };

    if (data) {
      updateData.data = data;
    }

    if (message_id) {
      updateData.message_id = message_id;
    }

    const email_updateRecord = await this.emailSendRepository.update(
      { email_send_key },
      updateData,
    );

    if (!email_updateRecord.affected || email_updateRecord.affected === 0) {
      throw new BadRequestException(`Email send update record failed`);
    }

    return email_updateRecord;
  }
}
