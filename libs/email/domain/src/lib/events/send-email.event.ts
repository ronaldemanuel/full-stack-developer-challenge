import type {
  EmailTypes,
  SendEmailPayload,
} from '../schemas/send-email.schema.js';
import type { IEvent } from '@nx-ddd/shared-domain';

export class SendEmailEvent<T extends EmailTypes> implements IEvent {
  constructor(
    public readonly id: T,
    public readonly data: SendEmailPayload<T>
  ) {}
  get identifier(): 'app-queue/send-email' {
    return 'app-queue/send-email';
  }
}
