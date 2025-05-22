import { Injectable, Logger } from '@nestjs/common';
import { createVerify } from 'crypto';
import * as https from 'https';

@Injectable()
export default class SnsSignatureVerificationService {
  private readonly logger = new Logger('SnsVerificationService');

  async verifySnsMessage(rawMessage: any): Promise<boolean> {
    try {
      let message: any;
      if (typeof rawMessage === 'string') {
        try {
          message = JSON.parse(rawMessage);
        } catch (e) {
          console.error('Failed to parse message string:', e);
          return false;
        }
      } else if (rawMessage.param_3) {
        try {
          message = JSON.parse(rawMessage.param_3);
        } catch (e) {
          console.error('Failed to parse param_3:', e);
          return false;
        }
      } else {
        message = rawMessage;
      }

      console.log('Parsed message type:', message.Type);
      console.log('MessageId:', message.MessageId);

      if (
        !message.SigningCertURL ||
        !message.Signature ||
        !message.SignatureVersion
      ) {
        console.log('Missing required fields:', {
          hasSigningCertURL: !!message.SigningCertURL,
          hasSignature: !!message.Signature,
          hasSignatureVersion: !!message.SignatureVersion,
        });
        return false;
      }

      let publicKey;
      try {
        publicKey = await this.getSigningCertificate(message.SigningCertURL);
        console.log('Certificate retrieved successfully');
      } catch (error) {
        console.error('Certificate fetch error:', error);
        return false;
      }

      const stringToSign = this.buildCanonicalString(message);
      console.log('String to sign length:', stringToSign.length);

      const decodedSignature = Buffer.from(message.Signature, 'base64');

      try {
        const verify = createVerify('SHA1');
        verify.update(stringToSign);
        const isValid = verify.verify(publicKey, decodedSignature);
        console.log('Verification result:', isValid);
        return isValid;
      } catch (error) {
        console.error('Verification error:', error.message);
        return false;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }

  private buildCanonicalString(message: any): string {
    let stringToSign = '';

    if (message.Type === 'Notification') {
      const keys = ['Message', 'MessageId'];
      if (message.Subject) {
        keys.push('Subject');
      }
      keys.push('Timestamp', 'TopicArn', 'Type');

      stringToSign = keys.reduce((acc, key) => {
        if (message[key] !== undefined) {
          return acc + key + '\n' + message[key].toString() + '\n';
        }
        return acc;
      }, '');
    } else if (
      message.Type === 'SubscriptionConfirmation' ||
      message.Type === 'UnsubscribeConfirmation'
    ) {
      stringToSign =
        [
          'Message',
          message.Message,
          'MessageId',
          message.MessageId,
          'SubscribeURL',
          message.SubscribeURL,
          'Timestamp',
          message.Timestamp,
          'Token',
          message.Token,
          'TopicArn',
          message.TopicArn,
          'Type',
          message.Type,
        ].join('\n') + '\n';
    }

    return stringToSign;
  }

  private async getSigningCertificate(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const request = https.get(
        url,
        {
          timeout: 5000,
          headers: {
            Accept: 'application/x-pem-file',
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch certificate: ${res.statusCode}`));
            return;
          }

          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          res.on('end', () => {
            const cert = Buffer.concat(chunks).toString('utf8');
            if (!cert.includes('-----BEGIN CERTIFICATE-----')) {
              reject(new Error('Invalid certificate format'));
              return;
            }
            resolve(cert);
          });
        },
      );

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Certificate request timed out'));
      });
    });
  }
}
