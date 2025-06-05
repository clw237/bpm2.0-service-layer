import { Campaign } from 'src/entities';

export interface OperationResult {
  campaignId: string;
  bpmWorkflowId?: string;
  success: boolean;
  participantCount?: number;
  participants?: string[];
  retryCount?: number;
  error?: {
    type: 'NETWORK' | 'VALIDATION' | 'BPM_ERROR';
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type CampaignLaunchParams = Pick<
  Campaign,
  | 'id'
  | 'deadline'
  | 'participants'
  | 'reminderDaysBefore'
  | 'assessments'
  | 'bpmWorkflowId'
>;

export interface ParticipantUpdatePayload {
  campaignId: string;
  participantId: string;
  assessment: string;
  status: 'completed' | 'pending';
}

export type WebhookEvent =
  | 'REMINDER'
  | 'PARTICIPANT_INACTIVE'
  | 'CAMPAIGN_COMPLETE';
