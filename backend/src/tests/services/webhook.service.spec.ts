import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from '../../services/webhook.service';

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
  });

  describe('processReminder', () => {
    it('should log reminder processing', () => {
      const payload = {
        campaignId: 'C123',
        participantId: 'P456',
        email: 'test@example.com',
        missingAssessments: ['A1'],
        attempt: 1,
      };

      // Since processReminder only logs, we can spy on console.log or logger if needed.
      // For now, just call the method to ensure no errors are thrown.
      expect(() => webhookService.processReminder(payload)).not.toThrow();
    });
  });

  describe('processParticipantInactivation', () => {
    it('should log participant inactivation', () => {
      const payload = {
        campaignId: 'C123',
        participantId: 'P456',
      };

      expect(() =>
        webhookService.processParticipantInactivation(payload),
      ).not.toThrow();
    });
  });

  describe('processCampaignSummary', () => {
    it('should log campaign summary', () => {
      const payload = {
        campaignId: 'C123',
        ownerEmail: 'owner@example.com',
        completedCount: 5,
        incompleteCount: 2,
      };

      expect(() =>
        webhookService.processCampaignSummary(payload),
      ).not.toThrow();
    });
  });
});
