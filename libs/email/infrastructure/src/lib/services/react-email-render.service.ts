import type {
  EmailMap,
  EmailRenderService,
  EmailTypes,
  SendEmailPayload,
} from '@nx-ddd/email-domain';

import { env } from '../../env';
import { InvitationEmailTemplate } from '../data-objects/invitation-email-template';
import { MagicLinkEmailTemplate } from '../data-objects/magic-link-email-template';
import { OTPEmailTemplate } from '../data-objects/otp-email-template';
import { ResetPasswordEmailTemplate } from '../data-objects/reset-password-email-template';
import { VerificationEmailTemplate } from '../data-objects/verification-email-template';
import { VerificationOptEmailTemplate } from '../data-objects/verification-otp-email-template';

export class ReactEmailRenderService implements EmailRenderService.Service {
  emailMap: EmailMap = {
    sendVerificationEmail: new VerificationEmailTemplate(),
    sendMagicLink: new MagicLinkEmailTemplate(),
    sendResetPassword: new ResetPasswordEmailTemplate(),
    sendVerificationOTP: new VerificationOptEmailTemplate(),
    sendInvitationEmail: new InvitationEmailTemplate(),
    sendOTPEmail: new OTPEmailTemplate(),
  };

  async render<T extends EmailTypes>(
    id: T,
    data: SendEmailPayload<T>,
  ): EmailRenderService.Output {
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
