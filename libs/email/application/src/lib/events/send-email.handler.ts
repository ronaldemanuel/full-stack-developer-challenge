import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import type { EmailTypes, EmailRenderService } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import type { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@EventsHandler(SendEmailEvent)
export class SendEventEmailHandler
  implements IEventHandler<SendEmailEvent<EmailTypes>>
{
  constructor(
    private readonly nodemailer: MailerService,
    private readonly renderEmailService: EmailRenderService.Service
  ) {}

  private readonly logger = new Logger(SendEventEmailHandler.name);

  async handle(event: SendEmailEvent<EmailTypes>) {
    const options: ISendMailOptions = await this.renderEmailService.render(
      event.id,
      event.data
    );
    this.logger.log(`Sending email with subject: ${options.subject}`);
    return await this.nodemailer.sendMail(options);
  }
}
