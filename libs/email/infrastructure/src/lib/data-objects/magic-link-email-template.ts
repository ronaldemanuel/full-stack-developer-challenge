import type { RenderEmailResponse } from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';
import { appConfig } from '@nx-ddd/shared-domain';

import { renderMagicLinkEmail } from '../emails/magic-link-email';

export class MagicLinkEmailTemplate extends AbstractEmailTemplate<'sendMagicLink'> {
  render(data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }): Promise<RenderEmailResponse> {
    return renderMagicLinkEmail({
      firstName: data.user.name,
      actionUrl: data.url,
      mailType: 'login',
      siteName: appConfig.name,
    });
  }
  get subject(): string {
    return `Login to your ${appConfig.name} account`;
  }
}
