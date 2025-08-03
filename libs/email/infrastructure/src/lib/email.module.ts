import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { SendEmailEventHandler } from '@nx-ddd/email-application';
import { EmailRenderService } from '@nx-ddd/email-domain';

import { env } from '../env';
import { ReactEmailRenderService } from './services/index';

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
                auth: env.EMAIL_SMTP_USER
                  ? {
                      user: env.EMAIL_SMTP_USER,
                      pass: env.EMAIL_SMTP_PASS,
                    }
                  : undefined,
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
      provide: SendEmailEventHandler.TOKEN,
      useFactory: (
        mailerService: MailerService,
        emailRenderService: EmailRenderService.Service,
      ) => {
        return new SendEmailEventHandler.Handler(
          mailerService,
          emailRenderService,
        );
      },
      inject: [MailerService, EmailRenderService.TOKEN],
    },
  ],
  exports: [SendEmailEventHandler.TOKEN],
})
export class EmailModule {}
