import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BpmController } from '../../controllers/bpm.controller';
import { WebhookService } from '../../services/webhook.service';

describe('BpmController', () => {
  let controller: BpmController;
  let webhookService: WebhookService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BpmController],
      providers: [
        WebhookService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BPM_HMAC_SECRET') return 'test-secret';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<BpmController>(BpmController);
    webhookService = module.get<WebhookService>(WebhookService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('handleReminder', () => {
    it('should throw UnauthorizedException if signature is missing', async () => {
      const mockReq = {
        headers: {},
      } as any;

      await expect(
        controller.handleReminder({} as any, mockReq),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Add more tests for valid signature, invalid signature, etc.
  });
});
