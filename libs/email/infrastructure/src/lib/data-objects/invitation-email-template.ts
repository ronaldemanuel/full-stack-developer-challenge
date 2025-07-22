import type {
  RenderEmailResponse,
  SendEmailPayloadData,
} from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

import { renderInvitationEmail } from '../emails/invitation';

export class InvitationEmailTemplate extends AbstractEmailTemplate<'sendInvitationEmail'> {
  render(
    data: SendEmailPayloadData<'sendInvitationEmail'>,
  ): Promise<RenderEmailResponse> {
    return renderInvitationEmail(data);
  }
  get subject(): string {
    return "You've been invited to join an organization";
  }
}
