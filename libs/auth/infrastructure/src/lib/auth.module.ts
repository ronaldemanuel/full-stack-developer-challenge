import type { DynamicModule } from '@nestjs/common';
import { env } from '@/env.mjs';
import { Module } from '@nestjs/common';

import {
  SendInvitationEmailUseCase,
  SendMagicLinkUseCase,
  SendResetPasswordUseCase,
  SendVerificationEmailUseCase,
} from '@nx-ddd/auth-application';
import { AuthService } from '@nx-ddd/auth-domain';

import type { BetterAuthConfig } from './better-auth/factories/better-auth.factory.js';
import { BetterAuthDatabaseAdapterFactory } from './better-auth/factories/better-auth-database-adapter.factory.js';
import {
  BETTER_AUTH_CONFIG_TOKEN,
  BetterAuthFactory,
} from './better-auth/factories/better-auth.factory.js';
import { AuthWithBetterAuthService } from './better-auth/services/auth-with-better-auth.service.js';

@Module({})
export class AuthModule {
  static forBetterAuth(): DynamicModule {
    return {
      imports: [],
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
            googleClientId: env.AUTH_GOOGLE_ID,
            googleClientSecret: env.AUTH_GOOGLE_SECRET,
            githubClientId: env.AUTH_GITHUB_ID,
            githubClientSecret: env.AUTH_GITHUB_SECRET,
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
