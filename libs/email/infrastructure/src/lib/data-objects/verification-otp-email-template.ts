import type {
  RenderEmailResponse,
  SendEmailPayloadData,
} from '@nx-ddd/email-domain';
import { AbstractEmailTemplate } from '@nx-ddd/email-domain';

export class VerificationOptEmailTemplate extends AbstractEmailTemplate<'sendVerificationOTP'> {
  override render(
    data: SendEmailPayloadData<'sendVerificationOTP'>
  ): Promise<RenderEmailResponse> {
    return Promise.resolve({
      html: `<p>Your OTP is: ${data.otp}</p>`,
      text: `Your OTP is: ${data.otp}`,
    });
  }
  override get subject(): string {
    return 'Your OTP Code';
  }
}
