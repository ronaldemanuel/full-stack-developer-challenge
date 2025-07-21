import type { FactoryProvider } from '@nestjs/common';
import type { Adapter } from 'better-auth';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  magicLink,
  multiSession,
  oAuthProxy,
  organization,
} from 'better-auth/plugins';

import {
  SendInvitationEmailUseCase,
  SendMagicLinkUseCase,
  SendResetPasswordUseCase,
  SendVerificationEmailUseCase,
} from '@nx-ddd/auth-application';

import { BETTER_AUTH_DATABASE_ADAPTER_TOKEN } from './better-auth-database-adapter.factory.js';

export const BETTER_AUTH_TOKEN = 'BETTER_AUTH';
export const BETTER_AUTH_CONFIG_TOKEN = 'BETTER_AUTH_CONFIG';

export interface BetterAuthConfig {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}

export const initAuth = (
  config: BetterAuthConfig,
  adapter: Adapter,
  sendVerificationEmailUseCase: SendVerificationEmailUseCase.UseCase,
  sendResetPasswordUseCase: SendResetPasswordUseCase.UseCase,
  sendMagicLinkEmailUseCase: SendMagicLinkUseCase.UseCase,
  sendInvitationEmailUseCase: SendInvitationEmailUseCase.UseCase,
) => {
  return betterAuth({
    appName: 'Better Auth',
    database: adapter,
    emailVerification: {
      async sendVerificationEmail({ user, url, token }) {
        return sendVerificationEmailUseCase.execute({
          user: {
            name: user.name,
            email: user.email,
          },
          url,
          token,
        });
      },
    },
    account: {
      accountLinking: {
        trustedProviders: ['google', 'github', 'demo-app'],
      },
    },
    emailAndPassword: {
      enabled: true,
      async sendResetPassword({ user, url, token }) {
        return sendResetPasswordUseCase.execute({
          user: {
            name: user.name,
            email: user.email,
          },
          url,
          token,
        });
      },
    },
    plugins: [
      organization({
        async sendInvitationEmail(data) {
          sendInvitationEmailUseCase.execute({
            email: data.email,
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink: `${config.baseUrl}/accept-invitation/${data.id}`,
          });
        },
      }),
      magicLink({
        async sendMagicLink({ email, token, url }) {
          return sendMagicLinkEmailUseCase.execute({
            user: {
              name: email,
              email,
            },
            url,
            token,
          });
        },
      }),
      multiSession(),
      oAuthProxy(),
      nextCookies(),
      admin({
        // cspell:disable-next-line
        adminUserIds: ['EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB'],
      }),
    ],
  });
};

export type BetterAuth = ReturnType<typeof initAuth>;

export const BetterAuthFactory: FactoryProvider = {
  provide: BETTER_AUTH_TOKEN,
  useFactory: (
    config: BetterAuthConfig,
    adapter: Adapter,
    sendVerificationEmailUseCase: SendVerificationEmailUseCase.UseCase,
    sendResetPasswordUseCase: SendResetPasswordUseCase.UseCase,
    sendMagicLinkEmailUseCase: SendMagicLinkUseCase.UseCase,
    sendInvitationEmailUseCase: SendInvitationEmailUseCase.UseCase,
  ) => {
    return initAuth(
      config,
      adapter,
      sendVerificationEmailUseCase,
      sendResetPasswordUseCase,
      sendMagicLinkEmailUseCase,
      sendInvitationEmailUseCase,
    );
  },
  inject: [
    BETTER_AUTH_CONFIG_TOKEN,
    BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
    SendVerificationEmailUseCase.UseCase,
    SendResetPasswordUseCase.UseCase,
    SendMagicLinkUseCase.UseCase,
    SendInvitationEmailUseCase.UseCase,
  ],
};
