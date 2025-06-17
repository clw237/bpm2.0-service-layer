//import { UserPoolReminderDto } from 'dtos';

export interface IScheduleConfig {
  timezone?: string;
  time?: string;
  frequency?: number[];
  date?: string;
  utcDate?: string;
  assessmentDeadlineInUtc?: string;
}

export interface ISchedulerListItem {
  scheduler_key: string;
  workspace_key: string;
  template_key: string;
  item_key: string;
  schedule_json: IScheduleConfig;
  item_type: string;
  schedule_type_code: string;
}

/* export interface IExecuteSchedulerType {
  executeScheduler(
    SchedulerListItem: ISchedulerListItem,
    attribDefMap: Map<string, string>,
  ): Promise<UserPoolReminderDto[]>;
}

export type IExecuteSchedulerFunc = (
  SchedulerListItem: ISchedulerListItem,
  attribDefMap: Map<string, string>,
) => Promise<UserPoolReminderDto[]>;
 */
