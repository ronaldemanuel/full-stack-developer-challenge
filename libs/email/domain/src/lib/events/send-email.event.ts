import type { EmailTypes, SendEmailPayload } from '../schemas/send-email.schema.js';

export class SendEmailEvent<T extends EmailTypes> {
  constructor(
    public readonly id: T,
    public readonly data: SendEmailPayload<T>
  ) {}
}
