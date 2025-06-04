import { Campaign } from 'src/entities';

export interface OperationResult {
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
