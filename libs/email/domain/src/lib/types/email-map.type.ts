import type { AbstractEmailTemplate } from '../data-objects/email-template.js';
import type { EmailTypes } from '../schemas/send-email.schema.js';

export type EmailMap = {
  [K in EmailTypes]: AbstractEmailTemplate<K>;
};
