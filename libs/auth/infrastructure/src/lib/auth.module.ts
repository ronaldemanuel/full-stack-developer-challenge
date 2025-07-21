import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AuthService } from '@nx-ddd/auth-domain';
import { AuthWithBetterAuthService } from './better-auth/services/auth-with-better-auth.service.js';
import { BetterAuthDatabaseAdapterFactory } from './better-auth/factories/better-auth-database-adapter.factory.js';
import {
  BETTER_AUTH_CONFIG_TOKEN,
  type BetterAuthConfig,
  BetterAuthFactory,
} from './better-auth/factories/better-auth.factory.js';
import { DatabaseModule } from '@nx-ddd/database-infrastructure';
import { env } from '@/env.mjs';
import {
  SendInvitationEmailUseCase,
  SendMagicLinkUseCase,
  SendResetPasswordUseCase,
  SendVerificationEmailUseCase,
} from '@nx-ddd/auth-application';

@Module({})
export class AuthModule {
  static forBetterAuth(): DynamicModule {
    return {
      imports: [DatabaseModule.forDrizzle()],
      module: AuthModule,
      providers: [
        SendVerificationEmailUseCase.UseCase,
        SendResetPasswordUseCase.UseCase,
        SendMagicLinkUseCase.UseCase,
        SendInvitationEmailUseCase.UseCase,

        {
          provide: BETTER_AUTH_CONFIG_TOKEN,
          useValue: {
            baseUrl: env.BASE_URL,
            productionUrl: env.BASE_URL,
            secret: env.AUTH_SECRET,
          } satisfies BetterAuthConfig,
        },
        BetterAuthDatabaseAdapterFactory,
        BetterAuthFactory,
        {
          provide: AuthService.TOKEN,
          useClass: AuthWithBetterAuthService,
        },
      ],
      exports: [AuthService.TOKEN],
    };
  }
}
