import type { RenderEmailResponse } from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';
import { renderResetPasswordEmail } from '../emails/reset-password';

export class ResetPasswordEmailTemplate extends AbstractEmailTemplate<'sendResetPassword'> {
  override render(data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }): Promise<RenderEmailResponse> {
    return renderResetPasswordEmail({
      resetLink: data.url,
      username: data.user.email,
    });
  }
  override get subject(): string {
    return 'Reset your password';
  }
}
