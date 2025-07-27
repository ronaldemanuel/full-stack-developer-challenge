import type { AbstractEmailTemplate } from '../data-objects/email-template';
import type { EmailTypes } from '../schemas/send-email.schema';

export type EmailMap = {
  [K in EmailTypes]: AbstractEmailTemplate<K>;
};
