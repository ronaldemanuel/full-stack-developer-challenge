import type { ISendMailOptions } from '@nestjs-modules/mailer';
import type {
  EmailTypes,
  SendEmailPayload,
} from '../schemas/send-email.schema.js';
import type { EmailMap } from '../types/email-map.type.js';

export namespace IEmailRenderService {
  export const TOKEN = 'EMAIL_RENDER_SERVICE';

  export type Output = Promise<ISendMailOptions>;

  export interface Service {
    emailMap: EmailMap;

    render(id: EmailTypes, data: SendEmailPayload<EmailTypes>): Output;
  }
}
