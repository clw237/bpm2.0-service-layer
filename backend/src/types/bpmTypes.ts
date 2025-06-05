export interface OperationResult {
  campaignId: string;
  bpmWorkflowInstanceId?: string;
  success: boolean;
  participantCount?: number;
  error?: {
    type: 'NETWORK' | 'VALIDATION' | 'BPM_ERROR';
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface CampaignLaunchParams {
  id: string;
  workflowTemplateId: string;
  deadline: Date;
  reminderDaysBefore: number;
  assessments: AssessmentType[];
  participants: string[];
}

export interface ParticipantUpdatePayload {
  campaignId: string;
  participantId: string;
  assessment: AssessmentType;
  status: AssessmentStatus;
}

export type WebhookEvent = 'REMINDER';

// New types based on Decisions BPM workflow requirements
export enum AssessmentType {
  TRAITS = 'traits',
  DRIVERS = 'drivers',
  COMPETENCIES = 'competencies',
}

export type AssessmentStatus = Record<string, 'completed' | 'pending'>;

export interface DecisionsBpmResponse {
  instanceId: string;
  sequenceNumber: number;
  timestamp: Date;
}

export interface BpmError {
  code: 'WORKFLOW_NOT_FOUND' | 'INVALID_PARTICIPANT' | 'DEADLINE_PASSED';
  message: string;
  details?: {
    campaignId?: string;
    participantId?: string;
    assessment?: AssessmentType;
  };
}
