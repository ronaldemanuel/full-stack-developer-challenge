import type {
  RenderEmailResponse,
  SendEmailPayloadData,
} from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

import { renderOTPEmail } from '../emails/otp-email';

export class OTPEmailTemplate extends AbstractEmailTemplate<'sendOTPEmail'> {
  render(
    data: SendEmailPayloadData<'sendOTPEmail'>,
  ): Promise<RenderEmailResponse> {
    return renderOTPEmail(data);
  }
  get subject(): string {
    return 'Your OTP Code';
  }
}
