import { Module } from '@nestjs/common';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import nodemailer from 'nodemailer';
import { env } from '../env.mjs';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { SendEventEmailHandler } from '@nx-ddd/email-application';
import { EmailRenderService } from '@nx-ddd/email-domain';
import { ReactEmailRenderService } from './services';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory() {
        if (env.EMAIL_PROVIDER === 'aws') {
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
        } else {
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
      provide: SendEventEmailHandler,
      useFactory: (
        mailerService: MailerService,
        emailRenderService: EmailRenderService.Service
      ) => {
        return new SendEventEmailHandler(mailerService, emailRenderService);
      },
      inject: [MailerService, EmailRenderService.TOKEN],
    },
  ],
  exports: [SendEventEmailHandler],
})
export class EmailModule {}
