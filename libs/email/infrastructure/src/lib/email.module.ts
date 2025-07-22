import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { SendEventEmailHandler } from '@nx-ddd/email-application';
import { EmailRenderService } from '@nx-ddd/email-domain';

import { env } from '../env.mjs';
import { ReactEmailRenderService } from './services';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory() {
        switch (env.EMAIL_PROVIDER) {
          case 'aws': {
            const sesClient = new SESv2Client({ region: 'eu-west-2' });
            const sesTransport = nodemailer.createTransport({
              SES: {
                sesClient,
                SendEmailCommand,
              },
            });
            return {
              transport: sesTransport,
            };
          }
          case 'smtp':
            return {
              transport: {
                host: env.EMAIL_SMTP_HOST,
                port: env.EMAIL_SMTP_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: env.EMAIL_SMTP_USER,
                  pass: env.EMAIL_SMTP_PASS,
                },
              },
            };
          case 'local':
            return {
              transport: { port: 1025 },
            };
        }
      },
    }),
  ],
  providers: [
    {
      provide: EmailRenderService.TOKEN,
      useClass: ReactEmailRenderService,
    },
    {
      provide: 'SendEventEmailHandler',
      useFactory: (
        mailerService: MailerService,
        emailRenderService: EmailRenderService.Service,
      ) => {
        return new SendEventEmailHandler(mailerService, emailRenderService);
      },
      inject: [MailerService, EmailRenderService.TOKEN],
    },
  ],
  exports: ['SendEventEmailHandler'],
})
export class EmailModule {}
