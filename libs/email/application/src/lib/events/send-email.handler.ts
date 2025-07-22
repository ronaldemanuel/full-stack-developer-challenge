import type { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import type { IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import type { EmailRenderService, EmailTypes } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';

@EventsHandler(SendEmailEvent)
export class SendEventEmailHandler
  implements IEventHandler<SendEmailEvent<EmailTypes>>
{
  constructor(
    private readonly nodemailer: MailerService,
    private readonly renderEmailService: EmailRenderService.Service,
  ) {}

  private readonly logger = new Logger(SendEventEmailHandler.name);

  async handle(event: SendEmailEvent<EmailTypes>) {
    const options: ISendMailOptions = await this.renderEmailService.render(
      event.id,
      event.data,
    );
    this.logger.log(`Sending email with subject: ${options.subject}`);
    const emailResponse = await this.nodemailer.sendMail(options);
    this.logger.log(
      `Email sent successfully with response: ${JSON.stringify(emailResponse)}`,
    );
    return emailResponse;
  }
}
