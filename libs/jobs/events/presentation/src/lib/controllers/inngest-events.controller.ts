import type { GetFunctionInput } from 'inngest';
import { Controller, Inject } from '@nestjs/common';

import type { SendEmailEventHandler } from '@nx-ddd/email-application';
import type { EmailTypes } from '@nx-ddd/email-domain';
import type { EventTypes } from '@nx-ddd/jobs-events-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';

import type { inngest } from '../inngest';
import { EventsInngest } from '../inngest';

@Controller()
export class InngestEventsController {
  @Inject('SendEventEmailHandler')
  private readonly sendEmailHandler!: SendEmailEventHandler.Handler;

  @EventsInngest.Function({ id: 'emailHandler' })
  @EventsInngest.Trigger({ event: 'app-queue/send-email' })
  public async handleSendEmail({
    event,
    step,
  }: GetFunctionInput<typeof inngest, EventTypes.SEND_EMAIL>) {
    const data = event.data as any;

    const eventId = event.id as EmailTypes;

    console.log(`Sending ${eventId} email type to ${data.user.email}`);

    const emailEvent = new SendEmailEvent(eventId, {
      data,
      to: data.user.email,
    });

    await this.sendEmailHandler.handle(emailEvent);

    console.log('Rodando novo: ', event.data);
    console.log('Step: ', step);
  }
}
