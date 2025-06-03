import { Campaign } from 'src/entities/campaign.entity';

export interface BpmOperationResult {
  campaignId: string;
  success: boolean;
  retryCount?: number;
  error?: {
    code: string;
    message: string;
  };
}

export type CampaignLaunchParams = Pick<
  Campaign,
  | 'id'
  | 'deadline'
  | 'participants'
  | 'reminderDaysBefore'
  | 'maxRetries'
  | 'retryIntervalDays'
>;
