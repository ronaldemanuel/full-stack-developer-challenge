import type { RenderEmailResponse } from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';
import { renderMagickLinkEmail } from '../emails/magick-link-email';
import { appConfig } from '@nx-ddd/shared-domain';

export class MagickLinkEmailTemplate extends AbstractEmailTemplate<'sendMagicLink'> {
  override render(data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }): Promise<RenderEmailResponse> {
    return renderMagickLinkEmail({
      firstName: data.user.name,
      actionUrl: data.url,
      mailType: 'login',
      siteName: appConfig.name,
    });
  }
  override get subject(): string {
    return `Login to your ${appConfig.name} account`;
  }
}
