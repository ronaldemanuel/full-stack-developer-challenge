import type { RenderEmailResponse } from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

import { renderResetPasswordEmail } from '../emails/reset-password';

export class ResetPasswordEmailTemplate extends AbstractEmailTemplate<'sendResetPassword'> {
  render(data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }): Promise<RenderEmailResponse> {
    return renderResetPasswordEmail({
      resetLink: data.url,
      username: data.user.email,
    });
  }
  get subject(): string {
    return 'Reset your password';
  }
}
