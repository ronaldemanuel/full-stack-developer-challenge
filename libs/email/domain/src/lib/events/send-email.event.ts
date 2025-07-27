import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { EventTypes } from '@nx-ddd/jobs-events-domain';

import type {
  EmailTypes,
  SendEmailPayload,
} from '../schemas/send-email.schema';

export class SendEmailEvent<T extends EmailTypes> implements IEvent {
  constructor(
    public readonly id: T,
    public readonly data: SendEmailPayload<T>,
  ) {}
  get identifier(): EventTypes {
    return EventTypes.SEND_EMAIL;
  }
}
