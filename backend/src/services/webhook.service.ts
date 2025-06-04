import { Injectable, Logger } from '@nestjs/common';
import { WebhookDto } from 'src/dtos';
import {
  CampaignRepository,
  LogRepository,
  UserRepository,
} from 'src/repositories';

/**
 * Assumes an existing notification service is available elsewhere in the application.
 * The notificationService injected here must have a sendReminder method:
 * sendReminder({ email: string, attempt: number, deadline: Date }): Promise<void>
 */
@Injectable()
export default class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly logRepository: LogRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly notificationService: {
      sendReminder: (params: {
        email: string;
        attempt: number;
        deadline: Date;
      }) => Promise<void>;
    },
  ) {}

  /**
   * Processes a reminder webhook for a participant.
   * - Skips if participant is completed.
   * - Sends reminder via external notification service.
   * - Increments retry count.
   * - Marks participant as inactive if max retries reached.
   */
  async processReminder(payload: WebhookDto): Promise<void> {
    const participant = await this.userRepository.getUser(
      payload.participantId,
    );

    if (!participant) {
      this.logger.warn(`Participant ${payload.participantId} not found`);
      return;
    }
    /*     if (participant.status === 'COMPLETED') {
      this.logger.log(
        `Skipping reminder for completed participant ${participant.id}`,
      );
      return;
    } */

    //const maxRetries = participant.campaign?.maxRetries ?? 3;
    //const attempt = participant.retryCount + 1;

    /* try {
      await this.notificationService.sendReminder({
        email: participant.email,
        attempt,
        deadline: participant.campaign.deadline,
      });
      await this.participantRepo.updateRetryCount(participant.id, attempt);

      if (attempt >= maxRetries) {
        await this.participantRepo.markInactive(participant.id);
        this.logger.warn(
          `Max retries reached. Marked participant ${participant.id} as INACTIVE.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send reminder to participant ${participant.id} (attempt ${attempt}): ${error.message}`,
      );
      // Optionally, handle retry logic or escalate error here
      throw error;
    } */
  }
}
