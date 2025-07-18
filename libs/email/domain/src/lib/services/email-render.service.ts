import type {
  EmailTypes,
  SendEmailPayload,
} from '../schemas/send-email.schema.js';

export namespace IEmailRenderService {
  export const TOKEN = 'EMAIL_RENDER_SERVICE';

  export type Output = Promise<{
    html: string;
    text: string;
  }>;

  export interface Service {
    eventsMap: Record<
      EmailTypes,
      (data: SendEmailPayload<EmailTypes>) => Output
    >;

    render(id: EmailTypes, data: SendEmailPayload<EmailTypes>): Output;
  }
}
