import type { RenderEmailResponse } from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

export class VerificationEmailTemplate extends AbstractEmailTemplate<'sendVerificationEmail'> {
  render(data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }): Promise<RenderEmailResponse> {
    return Promise.resolve({
      html: `<a href="${data.url}">Verify your email address</a>`,
      text: `Please verify your email address by clicking the following link: ${data.url}`,
    });
  }
  get subject(): string {
    return 'Verify your email address';
  }
}
