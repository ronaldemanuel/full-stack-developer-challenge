import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import type { SendEventEmailHandler } from '@nx-ddd/email-application';
import type { EmailTypes, SendEmailEvent } from '@nx-ddd/email-domain';
import { EventTypes } from '@nx-ddd/job-events-domain';

@Controller()
export class JobEventsController {
  // THESE GUYS MUST BE STRINGS
  @Inject('SendEventEmailHandler')
  private readonly sendEmailHandler!: SendEventEmailHandler;

  // Controller logic goes here
  @EventPattern(EventTypes.SEND_EMAIL)
  handleSendEmailEvent(data: SendEmailEvent<EmailTypes>) {
    return this.sendEmailHandler.handle(data);
  }
}
