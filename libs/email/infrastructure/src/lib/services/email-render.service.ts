import type {
  EmailMap,
  EmailTypes,
  IEmailRenderService,
  SendEmailPayload,
} from '@nx-ddd/email-domain';
import { InvitationEmailTemplate } from '../data-objects/invitation-email-template';
import { MagicLinkEmailTemplate } from '../data-objects/magic-link-email-template';
import { ResetPasswordEmailTemplate } from '../data-objects/reset-password-email-template';
import { VerificationEmailTemplate } from '../data-objects/verification-email-template';
import { VerificationOptEmailTemplate } from '../data-objects/verification-otp-email-template';
import { env } from '../../env.mjs';

export class EmailRenderService implements IEmailRenderService.Service {
  emailMap: EmailMap = {
    sendVerificationEmail: new VerificationEmailTemplate(),
    sendMagicLink: new MagicLinkEmailTemplate(),
    sendResetPassword: new ResetPasswordEmailTemplate(),
    sendVerificationOTP: new VerificationOptEmailTemplate(),
    sendInvitationEmail: new InvitationEmailTemplate(),
  };

  async render<T extends EmailTypes>(
    id: T,
    data: SendEmailPayload<T>
  ): IEmailRenderService.Output {
    const template = this.emailMap[id];
    const renderedEmail = await template.render(data.data);

    return {
      subject: template.subject,
      to: data.to,
      html: renderedEmail.html,
      text: renderedEmail.text,
      from: env.EMAIL_FROM,
    };
  }
}
