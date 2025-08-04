import type {
  RenderEmailResponse,
  SendEmailPayloadData,
} from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

export class VerificationOptEmailTemplate extends AbstractEmailTemplate<'sendVerificationOTP'> {
  render(
    data: SendEmailPayloadData<'sendVerificationOTP'>,
  ): Promise<RenderEmailResponse> {
    return Promise.resolve({
      html: `<p>Your OTP is: ${data.otp}</p>`,
      text: `Your OTP is: ${data.otp}`,
    });
  }
  get subject(): string {
    return 'Your OTP Code';
  }
}
