import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import type { EmailTypes, IEmailRenderService } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import type { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@EventsHandler(SendEmailEvent)
export class SendEmailHandler
  implements IEventHandler<SendEmailEvent<EmailTypes>>
{
  constructor(
    private readonly nodemailer: MailerService,
    private readonly renderEmailService: IEmailRenderService.Service
  ) {}

  async handle(event: SendEmailEvent<EmailTypes>) {
    const options: ISendMailOptions = await this.renderEmailService.render(
      event.id,
      event.data
    );
    return await this.nodemailer.sendMail(options);
  }
}
