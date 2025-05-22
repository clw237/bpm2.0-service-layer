import type { GetSecretValueResponse } from '@aws-sdk/client-secrets-manager';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import LoggerService from '../logger/logger.service';

export const fetchSecrets = async (secretName: string, awsRegion: string) => {
  const logger = LoggerService.getInstance();
  try {
    const client = new SecretsManagerClient({
      region: awsRegion,
    });

    const response: GetSecretValueResponse = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found or contains no data.`);
    }

    return JSON.parse(response.SecretString ?? '');
  } catch (error) {
    logger.error(secretName, 'Error fetching secrets:', error);
    throw new Error(`Failed to fetch secrets: ${error.message}`);
  }
};
