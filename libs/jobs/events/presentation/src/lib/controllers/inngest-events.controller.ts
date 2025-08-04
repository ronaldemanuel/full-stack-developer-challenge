import type { GetFunctionInput } from 'inngest';
import { Controller, Inject } from '@nestjs/common';

import type { SendEmailEventHandler } from '@nx-ddd/email-application';
import type { EventTypes } from '@nx-ddd/jobs-events-domain';

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
  }: GetFunctionInput<typeof inngest, EventTypes.SEND_EMAIL>) {
    const data = event.data as any;

    await this.sendEmailHandler.handle(data);
  }
}
