import { Module } from '@nestjs/common';

import {
  SendInvitationEmailUseCase,
  SendMagicLinkUseCase,
  SendOTPEmailUseCase,
  SendResetPasswordUseCase,
  SendVerificationEmailUseCase,
} from './use-cases';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SendVerificationEmailUseCase.UseCase,
    SendResetPasswordUseCase.UseCase,
    SendMagicLinkUseCase.UseCase,
    SendInvitationEmailUseCase.UseCase,
    SendOTPEmailUseCase.UseCase,
  ],
  exports: [
    SendVerificationEmailUseCase.UseCase,
    SendResetPasswordUseCase.UseCase,
    SendMagicLinkUseCase.UseCase,
    SendInvitationEmailUseCase.UseCase,
    SendOTPEmailUseCase.UseCase,
  ],
})
export class AuthApplicationModule {}
