import * as aws from '@aws-sdk/client-ses';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfigService } from '../services';
//import { fetchSecrets } from '../utilities/';

@Injectable()
export class MailerService implements OnModuleInit {
  // private ses: SES;
  private mailTransporter: any;

  constructor(private readonly appConfigService: AppConfigService) {}

  onModuleInit() {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: this.appConfigService.getConfigValue('AWS_REGION'),
    });

    this.mailTransporter = nodemailer.createTransport({
      SES: { ses, aws },
    });
  }

  getConfigSet = () => {
    return this.appConfigService.getConfigValue('SES_CONFIGURATION_SET');
  };

  async sendEmailViaNodeMailer(
    to: string | string[],
    subject: string,
    body: { html?: string; text?: string },
    from?: string,
  ): Promise<string> {
    try {
      const mailOptions = {
        from,
        to,
        subject,
        html: body.html,
        text: body.text,
        ses: {
          ConfigurationSetName: this.getConfigSet(),
        },
      };

      return new Promise((resolve, reject) => {
        this.mailTransporter.sendMail(mailOptions, (err, info) => {
          this.mailTransporter.close();
          if (err) {
            console.log(err);
            reject(err instanceof Error ? err : new Error(String(err)));
          } else {
            resolve(info?.response);
          }
        });
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
