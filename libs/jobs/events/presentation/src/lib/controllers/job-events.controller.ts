import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EventTypes } from '@nx-ddd/job-events-domain';
import { SendEventEmailHandler } from '@nx-ddd/email-application';
import type { SendEmailEvent } from '@nx-ddd/email-domain';
import type { EmailTypes } from '@nx-ddd/email-domain';

@Controller()
export class JobEventsController {
  @Inject(SendEventEmailHandler)
  private readonly sendEmailHandler!: SendEventEmailHandler;

  // Controller logic goes here
  @EventPattern(EventTypes.SEND_EMAIL)
  handleSendEmailEvent(data: SendEmailEvent<EmailTypes>) {
    return this.sendEmailHandler.handle(data);
  }
}
