import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import { BpmService } from '../../services/campaign-integration.service';
import { APIError } from '../../types/errors';

jest.mock('axios');

describe('BpmClient', () => {
  let bpmClient: BpmService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BpmService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'bpm.url') return 'https://bpm-mock.com';
              if (key === 'bpm.apiKey') return 'test-api-key';
            }),
          },
        },
      ],
    }).compile();

    bpmClient = moduleRef.get<BpmService>(BpmService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('launchCampaign', () => {
    it('should successfully launch a campaign', async () => {
      const mockResponse = { data: { campaignId: '123' } };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await bpmClient.launchCampaign({
        id: 'test',
        deadline: '2025-01-01',
        participants: [],
      });

      expect(result).toBe('123');
      expect(axios.post).toHaveBeenCalledWith('/campaigns', expect.any(Object));
    });

    it('should throw APIError on BPM connection failure', async () => {
      (axios.post as jest.Mock).mockRejectedValue({
        response: { status: 503, data: 'Service Unavailable' },
      });

      await expect(
        bpmClient.launchCampaign({
          id: 'test',
          deadline: '2025-01-01',
          participants: [],
        }),
      ).rejects.toThrow(APIError);
    });
  });
});
