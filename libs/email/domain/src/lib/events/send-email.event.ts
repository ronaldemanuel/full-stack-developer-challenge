import type { IEvent } from '@nx-ddd/job-events-domain';
import { EventTypes } from '@nx-ddd/job-events-domain';

import type {
  EmailTypes,
  SendEmailPayload,
} from '../schemas/send-email.schema.js';

export class SendEmailEvent<T extends EmailTypes> implements IEvent {
  constructor(
    public readonly id: T,
    public readonly data: SendEmailPayload<T>,
  ) {}
  get identifier(): EventTypes {
    return EventTypes.POST_CREATED;
  }
}
