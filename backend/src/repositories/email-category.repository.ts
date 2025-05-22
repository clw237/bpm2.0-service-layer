import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailCategory } from 'entities';
import { Repository } from 'typeorm';

@Injectable()
export default class EmailCategoryRepository {
  constructor(
    @InjectRepository(EmailCategory)
    private readonly emailCategoryRepository: Repository<EmailCategory>,
  ) {}

  async getEmailCategory(workspace_key: string): Promise<EmailCategory[]> {
    return await this.emailCategoryRepository.find({
      where: {
        workspace_key: workspace_key,
        is_display: true,
      },
      order: { sort_order: 'ASC' },
    });
  }

  async getEmailCategoryFromCategoryCode(
    email_category_code: string,
  ): Promise<EmailCategory | null> {
    return await this.emailCategoryRepository.findOne({
      where: { email_category_code },
    });
  }
}
