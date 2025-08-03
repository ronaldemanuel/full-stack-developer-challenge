import type { GetFunctionInput } from 'inngest';
import { All, Controller, Inject } from '@nestjs/common';

import type { SendEmailEventHandler } from '@nx-ddd/email-application';
import type { SendResetPasswordPayload } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import type { inngest } from '../inngest';
import { EventsInngest } from '../inngest';

@Controller('')
export class InngestEventsController {
  @Inject('SendEventEmailHandler')
  private readonly sendEmailHandler!: SendEmailEventHandler.Handler;

  @EventsInngest.Function({ id: 'sendResetPassword' })
  @EventsInngest.Trigger({ event: EventTypes.SEND_EMAIL })
  @All('*')
  public async handleSendEmail({
    event,
    step,
  }: GetFunctionInput<typeof inngest, EventTypes.SEND_EMAIL>) {
    const input: SendResetPasswordPayload = {
      token: '123',
      url: 'http://youtube.com',
      user: { email: 'emronald15el@gmail.com', name: 'Ronald' },
    };

    const emailEvent = new SendEmailEvent('sendResetPassword', {
      data: input,
      to: input.user.email,
    });

    await this.sendEmailHandler.handle(emailEvent);

    console.log('Rodando novo: ', event.data);
    console.log('Step: ', step);
  }
}
