import type {
  EmailTypes,
  IEmailRenderService,
  SendEmailPayload,
} from '@nx-ddd/email-domain';

export class EmailRenderService implements IEmailRenderService.Service {
  eventsMap: Record<
    EmailTypes,
    (data: SendEmailPayload<EmailTypes>) => IEmailRenderService.Output
  > = {
    sendVerificationEmail: async () => {
      return {
        html: '',
        text: '',
      };
    },
  };

  render(
    id: EmailTypes,
    data: SendEmailPayload<EmailTypes>
  ): IEmailRenderService.Output {
    return this.eventsMap[id](data);
  }
}
