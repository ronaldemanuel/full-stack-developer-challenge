import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import type { EmailTypes } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import type { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@EventsHandler(SendEmailEvent)
export class SendEmailHandler
  implements IEventHandler<SendEmailEvent<EmailTypes>>
{
  // TODO: implement nodemailer
  constructor(private readonly nodemailer: MailerService) {}

  async handle(event: SendEmailEvent<EmailTypes>) {
    await this.nodemailer.sendMail(event.payload);
  }

  private renderEmail(event: SendEmailEvent<EmailTypes>): ISendMailOptions {
    event.data.data;
    return {};
  }
}
