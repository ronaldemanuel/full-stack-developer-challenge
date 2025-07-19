import type {
  RenderEmailResponse,
  SendEmailPayloadData,
} from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';
import { renderInvitationEmail } from '../emails/invitation';

export class InvitationEmailTemplate extends AbstractEmailTemplate<'sendInvitationEmail'> {
  override render(
    data: SendEmailPayloadData<'sendInvitationEmail'>
  ): Promise<RenderEmailResponse> {
    return renderInvitationEmail(data);
  }
  override get subject(): string {
    return "You've been invited to join an organization";
  }
}
